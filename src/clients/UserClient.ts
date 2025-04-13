import { HttpClient } from '@core/HttpClient';
import { Project, Team, UserInfo } from '../types/index';
import { SDKError } from '@core/SDKError';

export class UserClient {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Fetches the user information for the given user ID.
   * @param userId The ID of the user to fetch information for.
   * @returns A promise that resolves to the user information if the request is successful.
   * @throws {SDKError} if the request fails.
   */
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

  /**
   * Fetches the projects for the given user ID.
   * @param userId The ID of the user to fetch projects for.
   * @returns A promise that resolves to an array of Project objects if the request is successful.
   * @throws {SDKError} if the request fails.
   */
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

  /**
   * Fetches the teams associated with the given user ID.
   * @param userId The ID of the user to fetch teams for.
   * @returns A promise that resolves to an array of Team objects if the request is successful.
   * @throws {SDKError} if the request fails.
   */
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
