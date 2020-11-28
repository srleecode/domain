import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import * as prettierUtils from '../../../utils/prettier';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { addJestJunitReporter } from './add-jest-junit-reporter';

describe('addJestJunitReporter', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'test-domain';
  const libraryType = DomainLibraryName.Ui;
  const jestConfigPath = `libs/${application}/${domain}/${libraryType}/jest.config.js`;
  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    appTree.create(
      jestConfigPath,
      `module.exports = {preset: '../../jest.config.js'};`
    );
    jest.spyOn(prettierUtils, 'formatFile');
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add reporter to jest config', () => {
    addJestJunitReporter(application, domain, libraryType)(appTree, undefined);
    expect(appTree.read(jestConfigPath).toString()).toBe(
      `module.exports = {
  preset: "../../jest.config.js",
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "./test-reports",
        outputName: "test-application-test-domain-ui.xml",
      },
    ],
  ],
};
`
    );
  });
  it('should format jest config after updating it', () => {
    addJestJunitReporter(application, domain, libraryType)(appTree, undefined);
    expect(prettierUtils.formatFile).toHaveBeenCalledWith(
      expect.anything(),
      jestConfigPath
    );
  });
});
