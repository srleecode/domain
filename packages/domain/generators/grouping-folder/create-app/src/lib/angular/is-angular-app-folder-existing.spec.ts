import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Language } from '../model/language.enum';
import { isAngularAppFolderExisting } from './is-angular-app-folder-existing';

describe('isAngularAppFolderExisting', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should return false when no angular app grouping folder exists', () => {
    expect(isAngularAppFolderExisting(tree)).toBe(false);
  });
  it('should return true when an angular app grouping folder exists', () => {
    tree.write(`libs/${Language.Angular}-app`, '');
    expect(isAngularAppFolderExisting(tree)).toBe(true);
  });
});
