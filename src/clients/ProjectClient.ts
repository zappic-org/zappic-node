import { HttpClient } from '@core/HttpClient';
import { SDKError } from '@core/SDKError';
import { Project } from '../types/index';

export class ProjectClient {
  private readonly httpClient: HttpClient;
  private activeProjectId: string | null = null;

  /**
   * Initializes a new instance of the ProjectClient class.
   *
   * @param httpClient An instance of HttpClient used for making HTTP requests.
   */

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Sets the active project for the client, which determines the
   * project that endpoints like {@link listFiles} will target.
   * @param projectId The id of the project to set as active
   */
  public setActiveProject(projectId: string): void {
    this.activeProjectId = projectId;
  }

  /**
   * Gets the currently active project id, or null if no project
   * has been set as active.
   * @returns The currently active project id, or null
   */
  public getCurrentProject(): string | null {
    return this.activeProjectId;
  }

  /**
   * Creates a new project with the specified name.
   * Sends a POST request to the server to create the project and returns the created project details.
   *
   * @param name - The name of the project to be created.
   * @returns A promise that resolves to the created Project object.
   * @throws SDKError if an error occurs while creating the project.
   */

  public async createProject(name: string): Promise<Project> {
    try {
      const response = await this.httpClient.post<Project>('/projects', {
        data: {
          name,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new SDKError(
        'Failed to create project',
        error?.response?.status,
        error?.response?.data
      );
    }
  }

  /**
   * Retrieves a list of projects associated with the current user.
   * Sends a GET request to the server to fetch the projects and returns an array of Project objects.
   *
   * @returns A promise that resolves to an array of Project objects.
   * @throws SDKError if an error occurs while fetching the projects.
   */

  public async getUserProjects(): Promise<Project[]> {
    try {
      const response = await this.httpClient.get<Project[]>('/projects');
      return response.data;
    } catch (error: any) {
      throw new SDKError(
        'Failed to fetch user projects',
        error?.response?.status,
        error?.response?.data
      );
    }
  }
}
