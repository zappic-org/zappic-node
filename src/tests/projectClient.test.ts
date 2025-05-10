import { ProjectClient } from '@clients/ProjectClient';
import { HttpClient } from '@core/HttpClient';
import { Project } from '../types/index';
import { CONFIG } from '../config';

jest.mock('@core/HttpClient');

describe('ProjectClient', () => {
  let mockHttpClient: jest.Mocked<HttpClient>;
  let projectClient: ProjectClient;
  beforeEach(() => {
    mockHttpClient = new HttpClient({
      apiKey: CONFIG.apiKey ?? '',
      baseUrl: CONFIG.baseUrl,
    }) as jest.Mocked<HttpClient>;
    projectClient = new ProjectClient(mockHttpClient);
  });

  it('should fetch user projects', async () => {
    const fakeProjects: Project[] = [
      {
        id: '1',
        name: 'Project One',
        createdAt: 0,
        updatedAt: 0,
        userId: '',
        description: '',
        storage: 0,
        users: [],
        tasks: [],
      },
      {
        id: '2',
        name: 'Project Two',
        createdAt: 0,
        updatedAt: 0,
        userId: '',
        description: '',
        storage: 0,
        users: [],
        tasks: [],
      },
    ];

    mockHttpClient.get = jest.fn().mockResolvedValue({ data: fakeProjects });

    const projects = await projectClient.getUserProjects();

    expect(projects).toEqual(fakeProjects);
    expect(mockHttpClient.get).toHaveBeenCalledWith('/projects');
  });

  it('should create a project', async () => {
    const createdProject: Project = {
      id: '1',
      name: 'New Project',
      createdAt: 0,
      updatedAt: 0,
      userId: '',
      description: '',
      storage: 0,
      users: [],
      tasks: [],
    };

    mockHttpClient.post = jest.fn().mockResolvedValue({ data: createdProject });

    const result = await projectClient.createProject('New Project');

    expect(result.name).toEqual(createdProject.name);
    expect(mockHttpClient.post).toHaveBeenCalledWith('/projects', {
      data: {
        name: 'New Project',
      },
    });
  });

  it('should set and get the current project', () => {
    projectClient.setActiveProject('1234');
    expect(projectClient.getCurrentProject()).toBe('1234');
  });
});
