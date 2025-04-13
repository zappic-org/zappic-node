// src/PlatformSDK.ts

import { HttpClient } from '@core/HttpClient';
import { AuthClient } from '@clients/AuthClient';
import { ProjectClient } from '@clients/ProjectClient';
import { UserClient } from '@clients/UserClient';
import { ImageClient } from '@clients/ImageClient';
import { PermissionClient } from '@clients/PermissionClient';
import { CONFIG } from './config';

export class PlatformSDK {
  private readonly httpClient: HttpClient;

  public auth: AuthClient;
  public project: ProjectClient;
  public user: UserClient;
  public image: ImageClient;
  public permission: PermissionClient;

  /**
   * Initializes a new instance of the PlatformSDK class, which provides clients for
   * interacting with the Zappic API.
   *
   * The API key is the only required property, and the base URL will default to
   * the production API URL if not provided.
   */
  constructor() {
    if (!CONFIG.apiKey) {
      throw new Error('API key is required to initialize PlatformSDK.');
    }

    this.httpClient = new HttpClient({
      apiKey: CONFIG.apiKey,
      baseUrl: CONFIG.baseUrl,
    });

    this.project = new ProjectClient(this.httpClient);
    this.auth = new AuthClient(this.httpClient);
    this.user = new UserClient(this.httpClient);
    this.image = new ImageClient(this.httpClient, this.project);
    this.permission = new PermissionClient(this.httpClient, this.project);
  }
}
