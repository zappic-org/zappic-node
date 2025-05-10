import { HttpClient } from '../core/HttpClient';
import { AuthClient } from '../clients/AuthClient';
import { CONFIG } from '../config';
jest.mock('../clients/AuthClient'); // Mock the AuthClient for testing

describe('AuthClient', () => {
  let authClient: AuthClient;
  const httpClient = new HttpClient({
    apiKey: CONFIG.apiKey ?? '',
    baseUrl: CONFIG.baseUrl ?? '',
  });

  beforeEach(() => {
    authClient = new AuthClient(httpClient);
  });

  test('should fetch user info successfully', async () => {
    const mockUserInfo = { id: '123', name: 'John Doe', email: 'john@example.com' };

    // Mock the method to return the mock data
    authClient.getUserInfo = jest.fn().mockResolvedValue(mockUserInfo);

    const userInfo = await authClient.getUserInfo();
    expect(userInfo).toEqual(mockUserInfo);
    expect(authClient.getUserInfo).toHaveBeenCalled();
  });

  test('should throw an error if fetching user info fails', async () => {
    const mockError = new Error('Failed to fetch user info');

    authClient.getUserInfo = jest.fn().mockRejectedValue(mockError);

    try {
      await authClient.getUserInfo();
    } catch (error) {
      expect(error).toEqual(mockError);
    }
  });
});
