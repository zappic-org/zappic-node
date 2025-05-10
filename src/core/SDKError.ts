export class SDKError extends Error {
  public statusCode?: number;
  public errorDetails?: any;

  /**
   * Creates a new SDKError object with the given message, status code and error details.
   * @param message The error message to associate with the SDKError.
   * @param statusCode The status code of the API request that caused the error.
   * @param errorDetails The error details returned by the API, if any.
   */
  constructor(message: string, statusCode?: number, errorDetails?: any) {
    super(message);
    this.name = 'SDKError';
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;

    Object.setPrototypeOf(this, SDKError.prototype);
  }

  /**
   * Creates an SDKError object from an API error response.
   * @param response The response from the API containing the error information.
   * @returns An SDKError object with the error message, status code and details from the API response.
   */
  public static fromApiError(response: any): SDKError {
    return new SDKError(
      response?.message || 'An unknown error occurred',
      response?.statusCode,
      response?.details
    );
  }
}
