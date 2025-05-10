// src/clients/PermissionClient.ts

import { HttpClient } from '@core/HttpClient';
import { SDKError } from '@core/SDKError';
import { ProjectClient } from './ProjectClient';

export class PermissionClient {
  private readonly httpClient: HttpClient;
  private readonly projectClient: ProjectClient;
  private readonly cachedPermissions: Map<string, string[]> = new Map();

  constructor(httpClient: HttpClient, projectClient: ProjectClient) {
    this.httpClient = httpClient;
    this.projectClient = projectClient;
  }

  /**
   * Fetches the permissions for the given project ID. If no project ID is provided
   * and no active project is set, an error will be thrown.
   *
   * The result is cached for the lifetime of the PermissionClient instance, so calling
   * this method multiple times with the same project ID will return the same result
   * without making a network request.
   *
   * @param projectId The ID of the project to fetch permissions for. If not provided,
   * the active project will be used.
   * @returns A list of permissions for the given project.
   * @throws {SDKError} if no project ID is provided and no active project is set.
   * @throws {SDKError} if the request fails.
   */
  public async getPermissions(projectId?: string): Promise<string[]> {
    const resolvedProjectId = projectId ?? this.projectClient.getCurrentProject();

    if (!resolvedProjectId) {
      throw new SDKError(
        'No project ID provided and no active project set. Please provide a projectId or call setActiveProject().'
      );
    }

    if (this.cachedPermissions.has(resolvedProjectId)) {
      return this.cachedPermissions.get(resolvedProjectId)!;
    }

    try {
      const response = await this.httpClient.get<string[]>(`/${resolvedProjectId}/permissions`);
      const permissions = response.data;
      this.cachedPermissions.set(resolvedProjectId, permissions);
      return permissions;
    } catch (error: any) {
      throw new SDKError(
        'Failed to fetch permissions',
        error?.response?.status,
        error?.response?.data
      );
    }
  }

  /**
   * Checks if the given permission is present in the list of permissions for the
   * active project.
   *
   * @param permission The permission to check for.
   * @returns A promise that resolves to true if the permission is present, or
   * false if it is not.
   * @throws {SDKError} if the request fails.
   */
  public async hasPermission(permission: string): Promise<boolean> {
    const permissions = await this.getPermissions();
    return permissions.includes(permission);
  }
}
