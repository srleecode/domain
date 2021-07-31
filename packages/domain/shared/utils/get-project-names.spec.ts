import {
  addProjectConfiguration,
  ProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { getProjectNames } from './get-project-names';

describe('getProjectNames', () => {
  let appTree: Tree;
  const baseFolder = 'libs/test-app/test-domain';
  const addProjects = () => {
    const mockProjectConfiguration: ProjectConfiguration = {
      root: `${baseFolder}/data-access`,
      targets: {},
    };
    const mockCypressProjectConfiguration: ProjectConfiguration = {
      root: `${baseFolder}/.cypress`,
      targets: {},
    };
    addProjectConfiguration(
      appTree,
      'test-app-test-domain',
      mockProjectConfiguration
    );
    addProjectConfiguration(
      appTree,
      'e2e-test-app-test-domain',
      mockCypressProjectConfiguration
    );
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should be no changes when no projects root starts with given folder', async () => {
    expect(getProjectNames(appTree, baseFolder)).toEqual([]);
  });

  it('should remove all projects under the given folder', async () => {
    addProjects();
    expect(getProjectNames(appTree, baseFolder)).toEqual([
      'test-app-test-domain',
      'e2e-test-app-test-domain',
    ]);
  });
});
