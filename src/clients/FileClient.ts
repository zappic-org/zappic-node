import { HttpClient } from '@core/HttpClient';
import fs from 'fs';
import FormData from 'form-data';
import { ProjectClient } from './ProjectClient';
import { SDKError } from '@core/SDKError';
import { CHUNK_SIZE } from './Constants';

export class FileClient {
  private readonly httpClient: HttpClient;
  private readonly projectClient: ProjectClient;

  /**
   * Constructs an instance of ImageClient.
   *
   * @param httpClient The HttpClient instance used for making HTTP requests.
   * @param projectClient The ProjectClient instance used for managing project-related operations.
   */

  constructor(httpClient: HttpClient, projectClient: ProjectClient) {
    this.httpClient = httpClient;
    this.projectClient = projectClient;
  }

  /**
   * Uploads a file to the current project.
   *
   * @param file The path to the file to upload, or a Buffer containing the file data.
   * @param metadata Optional file metadata to upload with the file.
   * @returns The uploaded file.
   * @throws {SDKError} if no project is set, or if the upload fails.
   */
  public async uploadFile(
    filePath: string,
    key: string,
    uploadProgress?: (progress: number) => void
  ): Promise<File> {
    const currentProjectId = this.projectClient.getCurrentProject();

    if (!currentProjectId) {
      throw new SDKError('No active project set. Please set a project before uploading.');
    }

    // check if the file is a directory as directories are not supported as of now
    if (fs.statSync(filePath).isDirectory()) {
      throw new SDKError('Directory uploads are not supported at this time.');
    }

    try {
      // information about the file needed to create apporpriate chunks
      const fileStats = fs.statSync(filePath);

      // a buffer to avoid multiple reads of the file reducing memory footprint of the upload
      const fileBuffer = fs.readFileSync(filePath);
      const totalSize = fileStats.size;
      const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);
      let totalUploaded = 0;

      // experimental: we can think of a way to globally store the last chunk index in case
      // of failure and resume the upload from there or from the last chunk index -1
      let lastChunkIndex = 0;

      for (let i = 0; i < totalChunks; i++) {
        // each file is uploaded in chunks of 30MB otherwise will be dropped by the server
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, totalSize);
        const chunk = fileBuffer.subarray(start, end);
        lastChunkIndex = i;

        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('chunkIndex', i);
        formData.append('totalChunks', totalChunks);
        formData.append('fileSize', totalSize);
        formData.append('fileName', key);

        const response = await this.httpClient.post<File>(`/${currentProjectId}`, {
          data: formData,
          headers: formData.getHeaders(),
          onUploadProgress: (progressEvent) => {
            totalUploaded = start + progressEvent.loaded;
            uploadProgress?.(totalUploaded / totalSize);
          },
        });
        if (i === totalChunks - 1) {
          return response.data;
        }
      }
      throw new SDKError('Upload completed but no file was returned.');
    } catch (error: any) {
      throw new SDKError('Failed to upload file', error?.response?.status, error?.response?.data);
    }
  }

  /**
   * Downloads an file from the current project
   * @param url The url of the file to download
   * @returns A Buffer containing the file data
   * @throws SDKError If no active project has been set
   * @throws SDKError If the file doesn't exist or the download fails
   */
  public async downloadFile(url: string): Promise<Buffer> {
    const currentProjectId = this.projectClient.getCurrentProject();
    if (!currentProjectId) {
      throw new SDKError('No active project set. Please set a project before uploading.');
    }

    try {
      const response = await this.httpClient.get(url, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data as any);
    } catch (error: any) {
      throw new SDKError(
        `Failed to download file ${url}`,
        error?.response?.status,
        error?.response?.data
      );
    }
  }

  /**
   * Deletes an file from the current project
   * @param fileId The id of the file to delete
   * @returns An object with a single boolean property `success` indicating whether the deletion was successful
   * @throws SDKError If no active project has been set
   * @throws SDKError If the file doesn't exist or the deletion fails
   */
  public async deleteFile(fileId: string): Promise<{ success: boolean }> {
    const currentProjectId = this.projectClient.getCurrentProject();
    if (!currentProjectId) {
      throw new SDKError('No active project set. Please set a project before uploading.');
    }
    try {
      await this.httpClient.delete(`${currentProjectId}/${fileId}`);
      return { success: true };
    } catch (error: any) {
      throw new SDKError(
        `Failed to delete file ${fileId}`,
        error?.response?.status,
        error?.response?.data
      );
    }
  }

  /**
   * Lists all files in the current project, or in the project with the given projectId.
   *
   * Future releases will support pagination.
   * @param projectId The id of the project to list files from. If not provided, the current
   * project will be used.
   * @returns An array of ImageFile objects, each representing an file in the project.
   * @throws {SDKError} if the request fails, or if no project is set and no projectId is provided.
   */
  public async listFiles(projectId?: string): Promise<File[]> {
    try {
      const resolvedProjectId = projectId ?? this.projectClient.getCurrentProject();
      if (!resolvedProjectId) {
        throw new SDKError(
          'No project ID provided and no active project set. Please provide a projectId or call setActiveProject().'
        );
      }
      const url = `${resolvedProjectId}/all`;
      const response = await this.httpClient.get<File[]>(url);
      return response.data;
    } catch (error: any) {
      throw new SDKError(
        'Failed to fetch file list',
        error?.response?.status,
        error?.response?.data
      );
    }
  }
}
