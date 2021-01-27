import { StyleType } from '../model/style-type.enum';
import { addLibrariesRules } from './add-libraries';
import * as testingUtils from '../../../utils/testing';
import { AddLibrariesNormalizedSchema } from '../../add-libraries/model/normalized-schema.model';
import { CreateNormalizedSchema } from '../../create/model/normalized-schema.model';
import { Linter } from '@nrwl/workspace';
import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { DomainConfig } from '../model/domain-config.model';
import * as nxJsonUtils from '../../../utils/nx-json';
import { DomainLibraryName } from '../model/domain-library-name.enum';

describe('addLibrariesRules', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'test-domain';
  const projectName = 'projectName';
  const tags = ['testTag', 'testTag2'];
  const directory = 'testDirectory';
  const prefix = 'testPrefix';
  const style = StyleType.Scss;
  const npmScope = 'project';
  jest.spyOn(nxJsonUtils, 'getNpmScope').mockReturnValue(npmScope);

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    const json: DomainConfig = {
      [`${application}-${domain}`]: {
        buildable: true,
        enableIvy: true,
        strict: false,
        publishable: false,
      },
    };
    appTree.create('domain.config.json', JSON.stringify(json));
  });
  it('should get add library rules when given add libraries schema', () => {
    const options: AddLibrariesNormalizedSchema = {
      application,
      domain,
      prefix,
      style,
      routing: true,
      libraryDefinitions: [
        {
          projectName,
          tags,
          directory,
          type: DomainLibraryName.DataAccess,
        },
      ],
    };

    jest
      .spyOn(testingUtils, 'getExternalSchematic')
      .mockReturnValue(testingUtils.emptyRule);

    addLibrariesRules(appTree, options, false);
    expect(testingUtils.getExternalSchematic).toHaveBeenCalledWith(
      '@nrwl/angular',
      'lib',
      {
        directory,
        linter: Linter.EsLint,
        name: projectName,
        prefix,
        style,
        routing: true,
        lazy: true,
        tags: `${tags[0]},${tags[1]}`,
        buildable: true,
        enableIvy: true,
        strict: false,
        publishable: false,
      }
    );
  });
  it('should get add library rules when given create domain schema', () => {
    const options: CreateNormalizedSchema = {
      application: 'test-application',
      domain: 'test-domain',
      prefix,
      style,
      routing: true,
      buildable: true,
      enableIvy: false,
      strict: false,
      publishable: true,
      libraryDefinitions: [
        {
          projectName,
          tags,
          directory,
          type: DomainLibraryName.DataAccess,
        },
      ],
    };

    jest
      .spyOn(testingUtils, 'getExternalSchematic')
      .mockReturnValue(testingUtils.emptyRule);

    addLibrariesRules(appTree, options, true);
    expect(testingUtils.getExternalSchematic).toHaveBeenCalledWith(
      '@nrwl/angular',
      'lib',
      {
        directory,
        linter: Linter.EsLint,
        name: projectName,
        prefix,
        style,
        routing: true,
        lazy: true,
        buildable: true,
        enableIvy: false,
        strict: false,
        publishable: true,
        tags: `${tags[0]},${tags[1]}`,
        importPath: '@project/test-application/test-domain/data-access',
      }
    );
  });
});
