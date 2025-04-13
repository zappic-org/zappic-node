import { HttpClient } from '@core/HttpClient';
import fs from 'fs';
import path from 'path';
import { ImageFile, ImageMetadata } from '../types/index';
import FormData from 'form-data';
import { ProjectClient } from './ProjectClient';
import { SDKError } from '@core/SDKError';
export class ImageClient {
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
   * Uploads an image file to the current project.
   *
   * @param file The path to the file to upload, or a Buffer containing the image data.
   * @param metadata Optional image metadata to upload with the image.
   * @returns The uploaded image file.
   * @throws {SDKError} if no project is set, or if the upload fails.
   */
  public async uploadImage(file: string | Buffer, metadata?: ImageMetadata): Promise<ImageFile> {
    const currentProjectId = this.projectClient.getCurrentProject();

    if (!currentProjectId) {
      throw new SDKError('No active project set. Please set a project before uploading.');
    }

    try {
      const formData = new FormData();

      if (typeof file === 'string') {
        const fileStream = fs.createReadStream(file);
        formData.append('file', fileStream, {
          filename: path.basename(file),
          contentType: 'application/octet-stream',
        });
      } else {
        formData.append('file', file);
      }

      if (metadata) {
        formData.append('metadata', JSON.stringify(metadata));
      }

      const response = await this.httpClient.post<ImageFile>(`/${currentProjectId}`, {
        data: formData,
        headers: formData.getHeaders(),
      });
      return response.data;
    } catch (error: any) {
      throw new SDKError('Failed to upload image', error?.response?.status, error?.response?.data);
    }
  }

  /**
   * Downloads an image from the current project
   * @param imageId The id of the image to download
   * @returns A Buffer containing the image data
   * @throws SDKError If no active project has been set
   * @throws SDKError If the image doesn't exist or the download fails
   */
  public async downloadImage(imageId: string): Promise<Buffer> {
    const currentProjectId = this.projectClient.getCurrentProject();
    if (!currentProjectId) {
      throw new SDKError('No active project set. Please set a project before uploading.');
    }

    try {
      const response = await this.httpClient.get(`/${currentProjectId}/${imageId}`, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response as any);
    } catch (error: any) {
      throw new SDKError(
        `Failed to download image ${imageId}`,
        error?.response?.status,
        error?.response?.data
      );
    }
  }

  /**
   * Deletes an image from the current project
   * @param imageId The id of the image to delete
   * @returns An object with a single boolean property `success` indicating whether the deletion was successful
   * @throws SDKError If no active project has been set
   * @throws SDKError If the image doesn't exist or the deletion fails
   */
  public async deleteImage(imageId: string): Promise<{ success: boolean }> {
    const currentProjectId = this.projectClient.getCurrentProject();
    if (!currentProjectId) {
      throw new SDKError('No active project set. Please set a project before uploading.');
    }
    try {
      await this.httpClient.delete(`/${currentProjectId}/${imageId}`);
      return { success: true };
    } catch (error: any) {
      throw new SDKError(
        `Failed to delete image ${imageId}`,
        error?.response?.status,
        error?.response?.data
      );
    }
  }

  /**
   * Lists all images in the current project, or in the project with the given projectId.
   * @param projectId The id of the project to list images from. If not provided, the current
   * project will be used.
   * @returns An array of ImageFile objects, each representing an image in the project.
   * @throws {SDKError} if the request fails, or if no project is set and no projectId is provided.
   */
  public async listImages(projectId?: string): Promise<ImageFile[]> {
    try {
      const resolvedProjectId = projectId ?? this.projectClient.getCurrentProject();
      if (!resolvedProjectId) {
        throw new SDKError(
          'No project ID provided and no active project set. Please provide a projectId or call setActiveProject().'
        );
      }
      const url = `${resolvedProjectId}/all`;
      const response = await this.httpClient.get<ImageFile[]>(url);
      return response.data;
    } catch (error: any) {
      throw new SDKError(
        'Failed to fetch image list',
        error?.response?.status,
        error?.response?.data
      );
    }
  }
}
