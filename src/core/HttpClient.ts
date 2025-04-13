import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { SDKError } from './SDKError';
import { HttpClientConfig } from '../types/index';

export class HttpClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly retryOptions?: { retries: number; delay: number };

  constructor(config: HttpClientConfig) {
    this.retryOptions = config.retryOptions;
    this.axiosInstance = axios.create({
      baseURL: config.baseUrl,
      headers: {
        Authorization: 'Bearer ' + config.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Tries to execute the given function, retrying up to `retries` times
   * if it fails with an error. The delay between retries increases
   * exponentially with each retry, starting at `delay` milliseconds.
   *
   * @param fn The function to try to execute
   * @param retries The number of times to retry if the function fails
   * @param delay The delay between retries in milliseconds
   * @returns The result of the function if it succeeds, or throws an
   * {@link SDKError} if all retries fail
   */
  private async retryRequest<T>(
    fn: () => Promise<AxiosResponse<T>>,
    retries: number,
    delay: number
  ): Promise<AxiosResponse<T>> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await this.delay(delay);
        return this.retryRequest(fn, retries - 1, delay * 2);
      } else {
        throw SDKError.fromApiError(error);
      }
    }
  }

  /**
   * Returns a Promise that resolves after the given number of milliseconds.
   * @param ms The number of milliseconds to wait
   * @returns A Promise that resolves after the given amount of time
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Returns the base URL for the HTTP client, which is used as the prefix for
   * all requests made by the client. This can be used to determine the
   * environment the client is configured to communicate with.
   * @returns The base URL for the HTTP client
   */
  public getBaseUrl() {
    return this.axiosInstance.defaults.baseURL;
  }

  // GET Request
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const request = () => this.axiosInstance.get<T>(url, config);
    return this.retryOptions
      ? this.retryRequest(request, this.retryOptions.retries, this.retryOptions.delay)
      : request();
  }

  // POST Request
  public async post<T>(url: string, config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const request = () => this.axiosInstance.post<T>(url, config);
    return this.retryOptions
      ? this.retryRequest(request, this.retryOptions.retries, this.retryOptions.delay)
      : request();
  }

  // DELETE Request
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const request = () => this.axiosInstance.delete<T>(url, config);
    return this.retryOptions
      ? this.retryRequest(request, this.retryOptions.retries, this.retryOptions.delay)
      : request();
  }

  // PUT request
  public async put<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const request = () => this.axiosInstance.put<T>(url, data, config);
    return this.retryOptions
      ? this.retryRequest(request, this.retryOptions.retries, this.retryOptions.delay)
      : request();
  }
}
