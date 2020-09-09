import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import * as jestUtils from '../../../utils/jest-config';
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
      `libs/${application}/${domain}/${libraryType}/jest.config.js`,
      `module.exports = {preset: '../../ jest.config.js',};`
    );
    jest.spyOn(prettierUtils, 'formatFile');
    jest.spyOn(jestUtils, 'addPropertyToJestConfig');
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add reporter to jest config', () => {
    addJestJunitReporter(application, domain, libraryType)(appTree, undefined);
    expect(jestUtils.addPropertyToJestConfig).toHaveBeenCalledWith(
      expect.anything(),
      jestConfigPath,
      'reporters',
      [
        'default',
        [
          'jest-junit',
          {
            outputDirectory: './test-reports',
            outputName: `${application}-${domain}-${libraryType}.xml`,
          },
        ],
      ]
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
