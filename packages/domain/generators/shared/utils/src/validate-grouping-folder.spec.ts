import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { validateGroupingFolder } from './validate-grouping-folder';
import { SchematicsException } from '@angular-devkit/schematics';
import { createDummyGroupingFolder } from '../../test-utils';

describe('validateGroupingFolder', () => {
  let tree: Tree;
  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });
  it('should throw an error when the grouping folder does not exist', () => {
    expect(() => validateGroupingFolder(tree, 'libs/test')).toThrowError(
      new SchematicsException(
        'The grouping folder directory does not exist "libs/test"'
      )
    );
  });
  it('should not throw an error when the grouping folder exists', () => {
    createDummyGroupingFolder(tree, 'libs/test/dummyFile');
    expect(() => validateGroupingFolder(tree, 'libs/test')).not.toThrow();
  });
});
