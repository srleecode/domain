import {
  addProjectConfiguration,
  ProjectConfiguration,
  readJson,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { addDomainLibrary } from './add-domain-library';
import { AngularCreateLibrarySchema } from './model/angular-create-library-schema.model';
import * as libraryGeneratorMock from '@nrwl/angular/src/generators/library/library';
import { ApplicationType } from '@srleecode/domain/shared/utils';

describe('addDomainLibrary', () => {
  let tree: Tree;
  const commonLibraryOptions: AngularCreateLibrarySchema = {
    buildable: true,
    strict: false,
    enableIvy: true,
    publishable: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    jest.spyOn(libraryGeneratorMock, 'libraryGenerator');
  });

  it('should pass correct parameters to @nrwl/angular generator', async () => {
    await addDomainLibrary(
      tree,
      '',
      'application',
      'libs/test-app/test-domain',
      'test-app',
      ApplicationType.Angular,
      true,
      commonLibraryOptions
    );
    expect(libraryGeneratorMock.libraryGenerator).toHaveBeenCalledWith(
      expect.anything(),
      {
        directory: 'test-app/test-domain',
        importPath: '@proj/test-app/test-domain/application',
        name: 'application',
        standaloneConfig: false,
        tags: 'app:test-app,scope:test-app-test-domain,type:application',
        prefix: 'test-app',
        ...commonLibraryOptions,
      }
    );
  });

  it('should clear lint file overrides', async () => {
    await addDomainLibrary(
      tree,
      '',
      'application',
      'libs/test-app/test-domain',
      'test-app',
      ApplicationType.Angular,
      true,
      commonLibraryOptions
    );
    const lintJson = readJson(
      tree,
      'libs/test-app/test-domain/application/.eslintrc.json'
    );
    expect(lintJson.overrides).toEqual([]);
  });

  it('should add project to e2e projects implicitDependencies', async () => {
    const mockProjectConfiguration: ProjectConfiguration = {
      root: `libs/test-app/test-domain/.e2e`,
      targets: {},
    };
    addProjectConfiguration(
      tree,
      'e2e-test-app-test-domain',
      mockProjectConfiguration
    );
    await addDomainLibrary(
      tree,
      '',
      'application',
      'libs/test-app/test-domain',
      'test-app',
      ApplicationType.Angular,
      true,
      commonLibraryOptions
    );
    const projectConfig = readProjectConfiguration(
      tree,
      'e2e-test-app-test-domain'
    );
    expect(projectConfig.implicitDependencies).toEqual([
      'test-app-test-domain-application',
    ]);
  });
});
