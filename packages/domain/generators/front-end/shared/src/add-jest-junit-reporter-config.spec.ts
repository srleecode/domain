import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { addJestJunitReporterConfig } from './add-jest-junit-reporter-config';

describe('addJestJunitReporterConfig', () => {
  const libraryPath = `test-application/test-domain/infrastructure`;
  const jestConfigPath = `libs/${libraryPath}/jest.config.ts`;
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    appTree.write(
      jestConfigPath,
      `module.exports = {preset: '../../jest.config.ts'};`,
    );
  });

  it('should add reporter to jest config', () => {
    addJestJunitReporterConfig(appTree, libraryPath);
    expect(appTree.read(jestConfigPath).toString()).toMatch(
      `reporters: ['default', [ 'jest-junit', { outputDirectory: './test-reports', outputName: "test-application-test-domain-infrastructure.xml" } ] ]`,
    );
  });
});
