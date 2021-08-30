import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { initialiseAngularWorkspace } from './initialise-angular-workspace';
import { ngAddGenerator } from '@srleecode/domain/init/ng-add';

describe('initialiseAngularWorkspace', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    await ngAddGenerator(tree)
  });

  it('should add component testing file', async () => {
    await initialiseAngularWorkspace(tree);
    expect(
      tree.exists(`.component-testing/global-mount-options.constant.ts`)
    ).toBe(true);
  });

  it('should add component testing ts config path', async () => {
    await initialiseAngularWorkspace(tree);
    const tsConfig = readJson(tree, 'tsconfig.base.json');
    expect(
      tsConfig.compilerOptions.paths[`@cypress/component-testing`]
    ).toEqual([`.component-testing/global-mount-options.constant.ts`]);
  });
});
