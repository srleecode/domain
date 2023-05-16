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
import { ApplicationType } from '@srleecode/domain/shared/utils';

describe('addDomainLibrary', () => {
  let tree: Tree;
  const commonLibraryOptions: AngularCreateLibrarySchema = {
    buildable: true,
    strict: false,
    enableIvy: true,
    publishable: false,
  };
  const groupingFolderPath = 'libs/test-app/test-domain';

  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
  });

  it('should clear lint file overrides', async () => {
    await addDomainLibrary(
      tree,
      '',
      'application',
      groupingFolderPath,
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

  it('should add jest junit report config when addJestJunitReporter is true', async () => {
    const type = 'application';
    await addDomainLibrary(
      tree,
      '',
      type,
      groupingFolderPath,
      'test-app',
      ApplicationType.Angular,
      true,
      { ...commonLibraryOptions, addJestJunitReporter: true }
    );
    expect(
      tree.read(`${groupingFolderPath}/${type}/jest.config.ts`).toString()
    ).toMatch(
      `reporters: ['default', [ 'jest-junit', { outputDirectory: './test-reports', outputName: "test-app-test-domain-application.xml" } ] ]`
    );
  });

  it('should remove config that should be in the jest preset as it can be global', async () => {
    const type = 'application';
    await addDomainLibrary(
      tree,
      '',
      type,
      groupingFolderPath,
      'test-app',
      ApplicationType.Angular,
      true,
      commonLibraryOptions
    );
    const jestFile = tree
      .read(`${groupingFolderPath}/${type}/jest.config.ts`)
      .toString();
    expect(jestFile).not.toMatch(
      /snapshotSerializers|transformIgnorePatterns|transform/
    );
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
      groupingFolderPath,
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
