import { FileClient } from '@clients/FileClient';
import { HttpClient } from '@core/HttpClient';
import { ZappicFile } from '../types/index';
import { CONFIG } from '../config';
import { ProjectClient } from '@clients/ProjectClient';

jest.mock('@core/HttpClient');
jest.mock('@clients/ProjectClient');

describe('ImageClient', () => {
  let mockHttpClient: jest.Mocked<HttpClient>;
  let mockProjectClient: ProjectClient;
  let fileClient: FileClient;

  const mockProjectId = 'mock-project-id';

  beforeEach(() => {
    mockHttpClient = new HttpClient({
      apiKey: CONFIG.apiKey ?? '',
      baseUrl: CONFIG.baseUrl,
    }) as jest.Mocked<HttpClient>;
    mockProjectClient = new ProjectClient(mockHttpClient);
    fileClient = new FileClient(mockHttpClient, mockProjectClient);
  });

  it('should list images using provided projectId', async () => {
    const mockFiles: ZappicFile[] = [{ id: '1', title: 'Test Image' } as ZappicFile];

    mockHttpClient.get = jest.fn().mockResolvedValue({ data: mockFiles });

    const result = await fileClient.listFiles(mockProjectId);
    expect(result).toEqual(mockFiles);
    expect(mockHttpClient.get).toHaveBeenCalledWith(`${mockProjectId}/all`);
  });

  it('should list images using current projectId', async () => {
    const mockFiles: ZappicFile[] = [{ id: '1', title: 'Current Image' } as ZappicFile];

    mockHttpClient.get = jest.fn().mockResolvedValue({ data: mockFiles });
    (mockProjectClient.getCurrentProject as jest.Mock).mockReturnValue(mockProjectId);
    const result = await fileClient.listFiles();
    expect(result).toEqual(mockFiles);
    expect(mockHttpClient.get).toHaveBeenCalledWith(`${mockProjectId}/all`);
  });

  it('should throw if no projectId is set', async () => {
    const badClient = new FileClient(mockHttpClient, mockProjectClient);

    await expect(badClient.listFiles()).rejects.toThrow('Failed to fetch image list');
  });

  it('should delete a file', async () => {
    mockHttpClient.delete = jest.fn().mockResolvedValue({ status: 200 });
    (mockProjectClient.getCurrentProject as jest.Mock).mockReturnValue(mockProjectId);

    const result = await fileClient.deleteFile('file-id');
    expect(result).toEqual({ success: true });
    expect(mockHttpClient.delete).toHaveBeenCalledWith(`${mockProjectId}/file-id`);
  });

  it('should download a file', async () => {
    (mockProjectClient.getCurrentProject as jest.Mock).mockReturnValue(mockProjectId);

    const mockBuffer = Buffer.from('image content');

    mockHttpClient.get = jest.fn().mockResolvedValue({ data: mockBuffer });

    const result = await fileClient.downloadFile('file-url');
    expect(result).toEqual(mockBuffer);
    expect(mockHttpClient.get).toHaveBeenCalledWith(`/file-url`, {
      responseType: 'arraybuffer',
    });
  });

  it('should upload a file', async () => {
    (mockProjectClient.getCurrentProject as jest.Mock).mockReturnValue(mockProjectId);

    const mockFilePath = './mockdata/sample.jpg';
    const mockFileKey = 'sample.jpg';

    const mockFile: ZappicFile = { id: '123', title: 'Uploaded' } as ZappicFile;

    mockHttpClient.post = jest.fn().mockResolvedValue({ data: mockFile });

    const result = await fileClient.uploadFile(mockFilePath, mockFileKey);

    expect(result).toEqual(mockFile);
    expect(mockHttpClient.post).toHaveBeenCalled(); // Can extend to check form data
  });
});
