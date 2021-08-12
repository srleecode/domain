import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { FrontendFramework } from '../model/framework.enum';
import { isFeAppFolderExisting } from './is-fe-app-folder-existing';

describe('isAngularAppFolderExisting', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should return false when no angular app grouping folder exists', () => {
    expect(isFeAppFolderExisting(FrontendFramework.Angular, tree)).toBe(false);
  });
  it('should return true when an angular app grouping folder exists', () => {
    tree.write(`libs/${FrontendFramework.Angular}-app`, '');
    expect(isFeAppFolderExisting(FrontendFramework.Angular, tree)).toBe(true);
  });
});
