import { addProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { getProjectNames } from './get-project-names';

describe('getProjectNames', () => {
  let appTree: Tree;
  const groupingFolder = 'libs/test-app/test-domain';

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should be no changes when no projects root starts with given folder', async () => {
    expect(getProjectNames(appTree, groupingFolder)).toEqual([]);
  });

  it('should get all libraries under the domain folder', async () => {
    addProjectConfiguration(appTree, 'test-app-test-domain', {
      root: `${groupingFolder}/data-access`,
      targets: {},
    });
    expect(getProjectNames(appTree, groupingFolder)).toEqual([
      'test-app-test-domain',
    ]);
  });

  it('should get e2e project under the domain folder', async () => {
    addProjectConfiguration(appTree, 'e2e-test-app-test-domain', {
      root: `${groupingFolder}/.e2e`,
      targets: {},
    });
    expect(getProjectNames(appTree, groupingFolder)).toEqual([
      'e2e-test-app-test-domain',
    ]);
  });

  it('should get all libraries under a app grouping folder', async () => {
    addProjectConfiguration(appTree, 'test-app-test-domain', {
      root: `${groupingFolder}/data-access`,
      targets: {},
    });
    expect(getProjectNames(appTree, 'libs/test-app')).toEqual([
      'test-app-test-domain',
    ]);
  });

  it('should get all libraries under a parent domain grouping folder', async () => {
    addProjectConfiguration(appTree, 'test-app-parent-domain-child-domain', {
      root: `libs/test-app/parent-domain/child-domain/data-access`,
      targets: {},
    });
    expect(getProjectNames(appTree, 'libs/test-app/parent-domain')).toEqual([
      'test-app-parent-domain-child-domain',
    ]);
  });
});
