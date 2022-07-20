import {
  ensureNxProject,
  fileExists,
  tmpProjPath,
} from '@nrwl/nx-plugin/testing';

export const createProject = () => {
  if (isProjectExisting()) {
    throw new Error(`Project was not cleaned up at ${tmpProjPath()}`);
  }
  ensureNxProject('@srleecode/domain', 'dist/packages/domain');
};

const isProjectExisting = () => fileExists(`${tmpProjPath()}/package.json`);
