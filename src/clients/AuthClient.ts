import { HttpClient } from '@core/HttpClient';
import { SDKError } from '@core/SDKError';
import { UserInfo } from '../types/index';

export class AuthClient {
  private httpClient: HttpClient;

  /**
   * Constructs an instance of AuthClient.
   *
   * @param httpClient The HttpClient instance used to perform HTTP requests.
   */

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Authenticates the client with the given API key, and sets it as the default
   * API key for all subsequent requests.
   *
   * @param apiKey The API key to use for authentication.
   */
  public authenticate(apiKey: string): void {
    this.httpClient = new HttpClient({
      apiKey,
      baseUrl: this.httpClient.getBaseUrl() ?? process.env.BASE_URL ?? '',
    });
  }

  /**
   * Fetches the user information for the authenticated client.
   *
   * @returns A promise that resolves to a UserInfo object containing the user's details.
   * @throws {SDKError} if the request fails.
   */

  public async getUserInfo(): Promise<UserInfo> {
    try {
      const response = await this.httpClient.get<UserInfo>('/user');
      return response.data;
    } catch (error: any) {
      throw new SDKError(
        'Failed to fetch user info',
        error?.response?.status,
        error?.response?.data
      );
    }
  }
}
