import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { initialiseAngularWorkspace } from './initialise-angular-workspace';

describe('initialiseAngularWorkspace', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add component testing file', () => {
    initialiseAngularWorkspace(tree);
    expect(
      tree.exists(`.component-testing/global-mount-options.constant.ts`)
    ).toBe(true);
  });

  it('should add component testing ts config path', () => {
    initialiseAngularWorkspace(tree);
    const tsConfig = readJson(tree, 'tsconfig.base.json');
    expect(
      tsConfig.compilerOptions.paths[`@cypress/component-testing`]
    ).toEqual([`.component-testing/global-mount-options.constant.ts`]);
  });
});
