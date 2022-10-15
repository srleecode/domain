import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { getProjects, readJson, Tree } from '@nrwl/devkit';
import { moveGenerator } from './generator';
import { libraryGenerator } from '@nrwl/workspace';
import { setupDomainTestGenerator } from '@srleecode/domain/cypress/domain-test';

describe('moveGenerator', () => {
  let appTree: Tree;
  const originalFolder = 'libs/test-app';
  const destination = 'libs/second-test-app';
  const addProjects = async () => {
    await libraryGenerator(appTree, {
      name: 'data-access',
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
      'second-test-app-test-domain-data-access',
      'second-test-app-second-test-domain-shell',
      'second-test-app-test-domain-e2e',
    ]);
  });

  it('should move project references for project that is moved', async () => {
    await libraryGenerator(appTree, {
      name: 'data-access',
      directory: `test-app/test-domain`,
    });
    let projects = getProjects(appTree);
    await moveGenerator(appTree, {
      groupingFolder: originalFolder,
      destination,
    });
    projects = getProjects(appTree);
    expect(projects.get('second-test-app-test-domain-data-access').root).toBe(
      'libs/second-test-app/test-domain/data-access'
    );
    const tsConfig = readJson(appTree, 'tsconfig.base.json');
    expect(tsConfig.compilerOptions.paths).toEqual({
      '@proj/second-test-app/test-domain/data-access': [
        'libs/second-test-app/test-domain/data-access/src/index.ts',
      ],
    });
  });
  it('should fix updated tsconfig path imports from nrwl move', async () => {
    const startDirectory = 'test-app/test-domain';
    await libraryGenerator(appTree, {
      name: 'data-access',
      directory: startDirectory,
    });
    await libraryGenerator(appTree, {
      name: 'shell',
      directory: startDirectory,
    });
    appTree.write(
      `libs/test-app/test-domain/shell/src/lib/test-app-test-domain-shell.ts`,
      `import { testAppTestDomainDataAccess } from "@proj/${startDirectory}/data-access";\n` +
        appTree
          .read(
            `libs/test-app/test-domain/shell/src/lib/test-app-test-domain-shell.ts`
          )
          .toString()
    );
    await moveGenerator(appTree, {
      groupingFolder: originalFolder,
      destination,
    });
    const shellFile = appTree
      .read(
        `libs/second-test-app/test-domain/shell/src/lib/test-app-test-domain-shell.ts`
      )
      .toString();
    expect(shellFile).toMatch('@proj/second-test-app/test-domain/data-access');
    const readme = appTree
      .read(`libs/second-test-app/test-domain/shell/README.md`)
      .toString();
    expect(readme).toMatch('second-test-app-test-domain-shell');
  });
});
