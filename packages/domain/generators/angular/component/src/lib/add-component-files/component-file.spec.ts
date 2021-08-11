import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { addComponentFiles } from './add-component-files';
import { defaultOptions } from '../../default-options.constant';
import { checkFileContentIsSame } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';
import { ComponentType } from '../../model/component-type.enum';
import { ViewEncapsulation } from '../../model/view-encapsulation.enum';

describe('addComponentFiles - component file', () => {
  let tree: Tree;
  const testFilePath = `${defaultOptions.groupingFolder}/${dasherize(
    defaultOptions.name
  )}.component.ts`;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });
  it('should create component file', () => {
    addComponentFiles(tree, defaultOptions);
    checkFileContentIsSame(
      tree,
      testFilePath,
      join(__dirname, './expected-files/component-file.txt')
    );
  });

  it('should have OnPush change detection strategy when component type is ui', () => {
    addComponentFiles(tree, { ...defaultOptions, type: ComponentType.Ui });
    const styleFilePath = `${defaultOptions.groupingFolder}/${dasherize(
      defaultOptions.name
    )}.component.ts`;
    const componentFile = tree.read(styleFilePath).toString();
    expect(componentFile).toMatch(
      /changeDetection: ChangeDetectionStrategy.OnPush/
    );
  });
  it('should have ViewEncapsulation.None when it is provided', () => {
    addComponentFiles(tree, {
      ...defaultOptions,
      viewEncapsulation: ViewEncapsulation.None,
    });
    const styleFilePath = `${defaultOptions.groupingFolder}/${dasherize(
      defaultOptions.name
    )}.component.ts`;
    const componentFile = tree.read(styleFilePath).toString();
    expect(componentFile).toMatch(/encapsulation: ViewEncapsulation.None/);
  });

  it('should have ViewEncapsulation.ShadowDom when it is provided', () => {
    addComponentFiles(tree, {
      ...defaultOptions,
      viewEncapsulation: ViewEncapsulation.ShadowDom,
    });
    const styleFilePath = `${defaultOptions.groupingFolder}/${dasherize(
      defaultOptions.name
    )}.component.ts`;
    const componentFile = tree.read(styleFilePath).toString();
    expect(componentFile).toMatch(/encapsulation: ViewEncapsulation.ShadowDom/);
  });
});
