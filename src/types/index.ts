export interface ZappicFile {
  id: string;
  userId: string;
  imageUrl?: string;
  folderId?: string;
  beforeSize?: number;
  afterSize?: number;
  uploadDate?: number;
  updatedAt?: number;
  isPrivate?: boolean;
  isDeleted?: boolean;
  isArchived?: boolean;
  title?: string;
  tags?: string[];
  description?: string;
  isFolder?: boolean;
  belongsToFolder?: boolean;
  type?: string;
  mimeType?: string;
  fileUrl?: string;
  projectId?: string;
  error?: string;
  contents?: ZappicFile[];
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
}

export interface HttpClientConfig {
  apiKey: string;
  baseUrl: string;
  retryOptions?: {
    retries: number;
    delay: number;
  };
}

// export interface ImageMetadata {
//   [key: string]: string | number | boolean;
// }

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  storage: number;
  createdAt: number;
  updatedAt: number;
  users: string[];
  tasks: string[];
}

export interface Team {
  id: string;
  name: string;
  membersCount?: number;
}

export type FileChunkSize = number;
