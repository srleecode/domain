import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { checkFileContentIsSame } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';
import { addComponentFiles } from './add-component-files';
import { defaultOptions } from '../../default-options.constant';

describe('addComponentFiles - style file', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });
  it('should be empty when displayBlock is false', () => {
    addComponentFiles(tree, defaultOptions);
    const styleFilePath = `${defaultOptions.groupingFolder}/${dasherize(
      defaultOptions.name
    )}.component.${defaultOptions.style}`;
    const componentFile = tree.read(styleFilePath).toString();
    expect(componentFile).toBe('');
  });

  it('should add display block style when displayBlock is true', () => {
    addComponentFiles(tree, { ...defaultOptions, displayBlock: true });
    const styleFilePath = `${defaultOptions.groupingFolder}/${dasherize(
      defaultOptions.name
    )}.component.${defaultOptions.style}`;
    checkFileContentIsSame(
      tree,
      styleFilePath,
      join(__dirname, './expected-files/display-block-style.txt')
    );
  });
});
