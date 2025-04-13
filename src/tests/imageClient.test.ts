import { ImageClient } from '@clients/ImageClient';
import { HttpClient } from '@core/HttpClient';
import { ImageFile } from '../types/index';
import { CONFIG } from '../config';
import { ProjectClient } from '@clients/ProjectClient';

jest.mock('@core/HttpClient');
jest.mock('@clients/ProjectClient');

describe('ImageClient', () => {
  let mockHttpClient: jest.Mocked<HttpClient>;
  let mockProjectClient: ProjectClient;
  let imageClient: ImageClient;

  const mockProjectId = 'mock-project-id';

  beforeEach(() => {
    mockHttpClient = new HttpClient({
      apiKey: CONFIG.apiKey ?? '',
      baseUrl: CONFIG.baseUrl,
    }) as jest.Mocked<HttpClient>;
    mockProjectClient = new ProjectClient(mockHttpClient);
    imageClient = new ImageClient(mockHttpClient, mockProjectClient);
  });

  it('should list images using provided projectId', async () => {
    const mockImages: ImageFile[] = [{ id: '1', title: 'Test Image' } as ImageFile];

    mockHttpClient.get = jest.fn().mockResolvedValue({ data: mockImages });

    const result = await imageClient.listImages(mockProjectId);
    expect(result).toEqual(mockImages);
    expect(mockHttpClient.get).toHaveBeenCalledWith(`${mockProjectId}/all`);
  });

  it('should list images using current projectId', async () => {
    const mockImages: ImageFile[] = [{ id: '1', title: 'Current Image' } as ImageFile];

    mockHttpClient.get = jest.fn().mockResolvedValue({ data: mockImages });
    (mockProjectClient.getCurrentProject as jest.Mock).mockReturnValue(mockProjectId);
    const result = await imageClient.listImages();
    expect(result).toEqual(mockImages);
    expect(mockHttpClient.get).toHaveBeenCalledWith(`${mockProjectId}/all`);
  });

  it('should throw if no projectId is set', async () => {
    const badClient = new ImageClient(mockHttpClient, mockProjectClient);

    await expect(badClient.listImages()).rejects.toThrow('Failed to fetch image list');
  });

  it('should delete an image', async () => {
    mockHttpClient.delete = jest.fn().mockResolvedValue({ status: 200 });
    (mockProjectClient.getCurrentProject as jest.Mock).mockReturnValue(mockProjectId);

    const result = await imageClient.deleteImage('image-id');
    expect(result).toEqual({ success: true });
    expect(mockHttpClient.delete).toHaveBeenCalledWith(`${mockProjectId}/image-id`);
  });

  it('should download an image', async () => {
    (mockProjectClient.getCurrentProject as jest.Mock).mockReturnValue(mockProjectId);

    const mockBuffer = Buffer.from('image content');

    mockHttpClient.get = jest.fn().mockResolvedValue({ data: mockBuffer });

    const result = await imageClient.downloadImage('image-id');
    expect(result).toEqual(mockBuffer);
    expect(mockHttpClient.get).toHaveBeenCalledWith(`/${mockProjectId}/image-id`, {
      responseType: 'arraybuffer',
    });
  });

  it('should upload an image', async () => {
    (mockProjectClient.getCurrentProject as jest.Mock).mockReturnValue(mockProjectId);

    const mockFile = {} as Buffer;
    const mockImage: ImageFile = { id: '123', title: 'Uploaded' } as ImageFile;

    mockHttpClient.post = jest.fn().mockResolvedValue({ data: mockImage });

    const result = await imageClient.uploadImage(mockFile);

    expect(result).toEqual(mockImage);
    expect(mockHttpClient.post).toHaveBeenCalled(); // Can extend to check form data
  });
});
