import { UserClient } from '@clients/UserClient';
import { HttpClient } from '@core/HttpClient';
import { CONFIG } from '../config';

jest.mock('@core/HttpClient');

describe('UserClient', () => {
  let mockHttpClient: jest.Mocked<HttpClient>;
  let userClient: UserClient;
  const mockUserId = 'user123';
  beforeEach(() => {
    mockHttpClient = new HttpClient({
      apiKey: CONFIG.apiKey ?? '',
      baseUrl: CONFIG.baseUrl,
    }) as jest.Mocked<HttpClient>;

    userClient = new UserClient(mockHttpClient);
  });

  it('should fetch user info', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com' };

    mockHttpClient.get = jest.fn().mockResolvedValue({ data: mockUser });

    const result = await userClient.getUserInfo(mockUserId);
    expect(result).toEqual(mockUser);
    expect(mockHttpClient.get).toHaveBeenCalledWith(`/users/${mockUserId}`);
  });

  it('should fetch user projects', async () => {
    const mockProjects = [
      { id: 'proj1', name: 'Project 1' },
      { id: 'proj2', name: 'Project 2' },
    ];

    mockHttpClient.get = jest.fn().mockResolvedValue({ data: mockProjects });

    const result = await userClient.getUserProjects(mockUserId);
    expect(result).toEqual(mockProjects);
    expect(mockHttpClient.get).toHaveBeenCalledWith(`/users/${mockUserId}/projects`);
  });

  it('should fetch user teams', async () => {
    const mockTeams = [
      { id: 'team1', name: 'Team A' },
      { id: 'team2', name: 'Team B' },
    ];

    mockHttpClient.get = jest.fn().mockResolvedValue({ data: mockTeams });

    const result = await userClient.getUserTeams(mockUserId);
    expect(result).toEqual(mockTeams);
    expect(mockHttpClient.get).toHaveBeenCalledWith(`/users/${mockUserId}/teams`);
  });
});
