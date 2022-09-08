import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { getWorkspaceLayout } from './get-workspace-layout';

describe('isHavingDepContraint', () => {
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should get workspace layout with npm scope prefixed with @', () => {
    expect(getWorkspaceLayout(appTree)).toEqual({
      appsDir: 'apps',
      libsDir: 'libs',
      npmScope: '@proj',
      standaloneAsDefault: true,
    });
  });
});
