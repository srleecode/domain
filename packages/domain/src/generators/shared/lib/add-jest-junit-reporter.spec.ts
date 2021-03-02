import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { addJestJunitReporter } from './add-jest-junit-reporter';

describe('addJestJunitReporter', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'test-domain';
  const libraryType = DomainLibraryName.Ui;
  const jestConfigPath = `libs/${application}/${domain}/${libraryType}/jest.config.js`;
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    appTree.write(
      jestConfigPath,
      `module.exports = {preset: '../../jest.config.js'};`
    );
  });

  it('should add reporter to jest config', () => {
    addJestJunitReporter(appTree, application, domain, libraryType);
    expect(appTree.read(jestConfigPath).toString()).toBe(
      `module.exports={preset:'../../jest.config.js', reporters: ['default', [ 'jest-junit', { outputDirectory: './test-reports', outputName: "test-application-test-domain-ui.xml" } ] ]};`
    );
  });
});
