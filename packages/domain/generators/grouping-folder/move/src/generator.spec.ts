import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { getProjects, Tree } from '@nrwl/devkit';
import { moveGenerator } from './generator';
import { libraryGenerator } from '@nrwl/workspace';
import { setupDomainTestGenerator } from '@srleecode/domain/cypress/domain-test';

describe('moveGenerator', () => {
  let appTree: Tree;
  const originalFolder = 'libs/test-app';
  const destination = 'libs/second-test-app';
  const addProjects = async () => {
    await libraryGenerator(appTree, {
      name: 'infrastructure',
      directory: `test-app/test-domain`,
    });
    await libraryGenerator(appTree, {
      name: 'shell',
      directory: `test-app/second-test-domain`,
    });
    await setupDomainTestGenerator(appTree, {
      groupingFolder: 'libs/test-app/test-domain',
      type: 'e2e',
    });
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should be no changes when no projects root starts with given folder', async () => {
    const existingFileChanges = appTree.listChanges();
    await moveGenerator(appTree, {
      groupingFolder: originalFolder,
      destination,
    });
    expect(appTree.listChanges()).toEqual(existingFileChanges);
  });

  it('should move all projects under the given folder', async () => {
    await addProjects();
    await moveGenerator(appTree, {
      groupingFolder: originalFolder,
      destination,
    });
    const projects = getProjects(appTree);
    expect([...projects.keys()]).toEqual([
      'second-test-app-second-test-domain-shell',
      'second-test-app-test-domain-infrastructure',
      'second-test-app-test-domain-e2e',
    ]);
  });

  it('should move project references for project that is moved', async () => {
    await libraryGenerator(appTree, {
      name: 'infrastructure',
      directory: `test-app/test-domain`,
    });
    let projects = getProjects(appTree);
    await moveGenerator(appTree, {
      groupingFolder: originalFolder,
      destination,
    });
    projects = getProjects(appTree);
    expect(
      projects.get('second-test-app-test-domain-infrastructure').root
    ).toBe('libs/second-test-app/test-domain/infrastructure');
  });
});
