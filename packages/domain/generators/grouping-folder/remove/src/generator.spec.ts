import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import {
  addProjectConfiguration,
  getProjects,
  ProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { removeGenerator } from './generator';
import { libraryGenerator } from '@nrwl/workspace';
import { createDummyGroupingFolder } from '@srleecode/domain/shared/test-utils';

describe('removeGenerator', () => {
  let appTree: Tree;
  const folderToDelete = 'libs/test-app';
  const addProjects = async () => {
    await libraryGenerator(appTree, {
      name: 'infrastructure',
      directory: `test-app/test-domain`,
    });
    await libraryGenerator(appTree, {
      name: 'shell',
      directory: `test-app/second-test-domain`,
    });
    const mockProjectConfiguration: ProjectConfiguration = {
      root: `${folderToDelete}/test-domain/.cypress`,
      targets: {},
    };
    addProjectConfiguration(
      appTree,
      'e2e-test-app-test-domain',
      mockProjectConfiguration
    );
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    createDummyGroupingFolder(appTree, `libs/test-app/test-domain`);
  });

  it('should remove all projects under the given folder', async () => {
    await addProjects();
    await removeGenerator(appTree, {
      groupingFolder: folderToDelete,
    });
    const projects = getProjects(appTree);
    expect(projects.size).toBe(0);
  });
});
