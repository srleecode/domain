import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { defaultOptions, LIB_PATH } from '../../default-options.constant';
import { getFilesContents } from '@srleecode/domain/shared/test-utils';
import { join } from 'path';
import { ComponentType } from '../../model/component-type.enum';
import { ViewEncapsulation } from '../../model/view-encapsulation.enum';
import { createComponentGenerator } from '../../generator';
import { dasherize } from '@nrwl/workspace/src/utils/strings';

describe('component file', () => {
  let tree: Tree;
  const testFilePath = `${LIB_PATH}/${dasherize(
    defaultOptions.name
  )}.component.ts`;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });
  it('should create component file', async () => {
    await createComponentGenerator(tree, defaultOptions);
    const filesContents = getFilesContents(
      tree,
      testFilePath,
      join(__dirname, './expected-files/component-file.txt')
    );
    expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
  });

  it('should include only prefix and component name when passing in prefix', async () => {
    await createComponentGenerator(tree, {
      ...defaultOptions,
      prefix: 'prefix',
    });
    const filesContents = getFilesContents(
      tree,
      testFilePath,
      join(__dirname, './expected-files/component-file.txt')
    );
    expect(filesContents.treeFile).toMatch(`selector:'prefix-test-example'`);
  });

  it('should have OnPush change detection strategy when component type is ui', async () => {
    await createComponentGenerator(tree, {
      ...defaultOptions,
      type: ComponentType.Ui,
    });
    const uiTestFilePath = `${LIB_PATH.replace('feature', 'ui')}/${dasherize(
      defaultOptions.name
    )}.component.ts`;
    const componentFile = tree.read(uiTestFilePath).toString();
    expect(componentFile).toMatch(
      /changeDetection: ChangeDetectionStrategy.OnPush/
    );
  });
  it('should have ViewEncapsulation.None when it is provided', async () => {
    await createComponentGenerator(tree, {
      ...defaultOptions,
      viewEncapsulation: ViewEncapsulation.None,
    });
    const componentFile = tree.read(testFilePath).toString();
    expect(componentFile).toMatch(/encapsulation: ViewEncapsulation.None/);
  });

  it('should have ViewEncapsulation.ShadowDom when it is provided', async () => {
    await createComponentGenerator(tree, {
      ...defaultOptions,
      viewEncapsulation: ViewEncapsulation.ShadowDom,
    });
    const componentFile = tree.read(testFilePath).toString();
    expect(componentFile).toMatch(/encapsulation: ViewEncapsulation.ShadowDom/);
  });
});
