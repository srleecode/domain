import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { getFilesContents } from '@srleecode/domain/shared/test-utils';
import createComponentGenerator from '../../component/src/generator';
import { defaultOptions } from '../../component/src/default-options.constant';
import createComponentGlobalStylesGenerator from './generator';
import { join } from 'path';

describe('createComponentGlobalStylesGenerator', () => {
  let tree: Tree;
  const componentLibraryPath = `${
    defaultOptions.groupingFolder
  }/presentation/src/lib/${defaultOptions.type}/${dasherize(
    defaultOptions.name
  )}`;
  const componentFilePath = `${componentLibraryPath}/${dasherize(
    defaultOptions.name
  )}.component.ts`;

  beforeAll(async () => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    await createComponentGenerator(tree, defaultOptions);
    await createComponentGlobalStylesGenerator(tree, {
      componentFolderPath: componentLibraryPath,
    });
  });

  it('should create base component file', () => {
    const filesContents = getFilesContents(
      tree,
      `${componentLibraryPath}/base.component.ts`,
      join(__dirname, './lib/expected-files/base-component.txt')
    );
    expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
  });
  it('should create global scss file', () => {
    const filesContents = getFilesContents(
      tree,
      `${componentLibraryPath}/global.scss`,
      join(__dirname, './lib/expected-files/global.txt')
    );
    expect(filesContents.treeFile).toMatch(filesContents.expectedFile);
  });
  it('should add base component class import to main component', () => {
    const componentFile = tree.read(componentFilePath).toString();
    expect(componentFile).toMatch(
      `import { TestExampleBaseComponent } from './base.component';`
    );
  });
  it('should add base component class to declarations', () => {
    const componentFile = tree.read(componentFilePath).toString();
    expect(componentFile).toMatch(
      `declarations: [TestExampleBaseComponent, TestExampleComponent],`
    );
  });
  it('should add base component class to template', () => {
    const componentTemplatePath = componentFilePath.replace('.ts', '.html');
    const componentFile = tree.read(componentTemplatePath).toString();
    expect(componentFile.replace(/\s/g, '')).toMatch(
      `<test-app-test-domain-feature-test-example-base><p>test-exampleworks!</p></test-app-test-domain-feature-test-example-base>`
    );
  });
});
