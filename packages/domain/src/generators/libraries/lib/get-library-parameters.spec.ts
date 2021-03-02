import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';
import { StyleType } from '../../shared/model/style-type.enum';
import * as nxJsonUtils from '../../shared/utils/nx-json';
import { LibrariesNormalizedSchema } from '../model/libraries-normalized-schema.model';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { Linter } from '../../shared/model/linter.enum';
import { getLibraryParameters } from './get-library-parameters';
import { NxLibraryParamters } from '../../shared/model/nx-library-parameters.model';

describe('getLibraryParameters', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'test-domain';
  const projectName = 'projectName';
  const tags = ['testTag', 'testTag2'];
  const directory = 'testDirectory';
  const prefix = 'testPrefix';
  const style = StyleType.Scss;
  const npmScope = 'project';
  jest.spyOn(nxJsonUtils, 'getNpmScope').mockReturnValue(npmScope);
  const options: LibrariesNormalizedSchema = {
    application,
    domain,
    prefix,
    style,
    routing: true,
    buildable: false,
    enableIvy: false,
    strict: false,
    publishable: false,
    libraryDefinitions: [
      {
        projectName,
        tags,
        directory,
        type: DomainLibraryName.DataAccess,
      },
    ],
  };
  const defaultLibraryParameters: NxLibraryParamters = {
    directory,
    linter: Linter.EsLint,
    name: projectName,
    prefix,
    style,
    routing: true,
    lazy: true,
    tags: `${tags[0]},${tags[1]}`,
    buildable: false,
    enableIvy: false,
    strict: false,
    publishable: false,
  };
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });
  it('should get default parameters when not given parameter values', () => {
    expect(getLibraryParameters(appTree, options)).toEqual([
      defaultLibraryParameters,
    ]);
  });
  it('should add import path when publishable is true', () => {
    expect(
      getLibraryParameters(appTree, { ...options, publishable: true })
    ).toEqual([
      {
        ...defaultLibraryParameters,
        publishable: true,
        importPath: '@project/test-application/test-domain/data-access',
      },
    ]);
  });
});
