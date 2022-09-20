import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { addJestJunitReporter } from './add-jest-junit-reporter-config';

describe('addJestJunitReporter', () => {
  const libraryPath = `test-application/test-domain/ui-example`;
  const jestConfigPath = `libs/${libraryPath}/jest.config.js`;
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    appTree.write(
      jestConfigPath,
      `module.exports = {preset: '../../jest.config.js'};`
    );
  });

  it('should add reporter to jest config', () => {
    addJestJunitReporter(appTree, libraryPath);
    expect(appTree.read(jestConfigPath).toString()).toMatch(
      `reporters: ['default', [ 'jest-junit', { outputDirectory: './test-reports', outputName: "test-application/test-domain/ui-example.xml" } ] ]`
    );
  });
});
