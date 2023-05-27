import { logger } from '@nx/devkit';
import { ensureNxProject, fileExists, tmpProjPath } from '@nx/plugin/testing';

export const createProject = () => {
  if (isProjectExisting()) {
    logger.warn(`Project was not cleaned up at ${tmpProjPath()}`);
  }
  ensureNxProject('@srleecode/domain', 'dist/packages/domain');
};

const isProjectExisting = () => fileExists(`${tmpProjPath()}/package.json`);
