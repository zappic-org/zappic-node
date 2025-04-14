// src/index.ts

import { ZappicNodeSDK } from './ZappicNodeSDK';
import { AuthClient } from './clients/AuthClient';
import { ProjectClient } from './clients/ProjectClient';
import { FileClient } from './clients/FileClient';
import { PermissionClient } from './clients/PermissionClient';
import { SDKError } from './core/SDKError';

export { ZappicNodeSDK, AuthClient, ProjectClient, FileClient, PermissionClient, SDKError };

/**
 * Creates a new instance of the ZappicNodeSDK class, which provides clients for
 * interacting with the Zappic API.
 *
 * @returns A new instance of the ZappicNodeSDK class
 */
export const createSDK = () => {
  const sdk = new ZappicNodeSDK();
  return sdk;
};
