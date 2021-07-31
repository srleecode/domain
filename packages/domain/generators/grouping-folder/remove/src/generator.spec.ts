import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import {
  addProjectConfiguration,
  getProjects,
  ProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { removeGenerator } from './generator';
import { libraryGenerator } from '@nrwl/workspace';

describe('removeGenerator', () => {
  let appTree: Tree;
  const folderToDelete = 'libs/test-app';
  const addProjects = async () => {
    await libraryGenerator(appTree, {
      name: 'data-access',
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
  });

  it('should be no changes when no projects root starts with given folder', async () => {
    const existingFileChanges = appTree.listChanges();
    await removeGenerator(appTree, {
      folder: folderToDelete,
    });
    expect(appTree.listChanges()).toEqual(existingFileChanges);
  });

  it('should remove all projects under the given folder', async () => {
    await addProjects();
    await removeGenerator(appTree, {
      folder: folderToDelete,
    });
    const projects = getProjects(appTree);
    expect(projects.size).toBe(0);
  });
});
