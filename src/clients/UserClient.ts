import { HttpClient } from '@core/HttpClient';
import { Project, Team, UserInfo } from '../types/index';
import { SDKError } from '@core/SDKError';

export class UserClient {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public async getUserInfo(userId: string): Promise<UserInfo> {
    try {
      const response = await this.httpClient.get<UserInfo>(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new SDKError(
        'Failed to fetch user info',
        error?.response?.status,
        error?.response?.data
      );
    }
  }

  public async getUserProjects(userId: string): Promise<Project[]> {
    try {
      const response = await this.httpClient.get<Project[]>(`/users/${userId}/projects`);
      return response.data;
    } catch (error: any) {
      throw new SDKError(
        'Failed to fetch user projects',
        error?.response?.status,
        error?.response?.data
      );
    }
  }

  public async getUserTeams(userId: string): Promise<Team[]> {
    try {
      const response = await this.httpClient.get<Team[]>(`/users/${userId}/teams`);
      return response.data;
    } catch (error: any) {
      throw new SDKError(
        'Failed to fetch user teams',
        error?.response?.status,
        error?.response?.data
      );
    }
  }
}
