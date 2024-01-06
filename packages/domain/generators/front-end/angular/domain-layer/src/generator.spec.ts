import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { createDomainLayerGenerator } from './generator';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AngularCreateLibrarySchema } from '../../../shared';
// eslint-disable-next-line @nx/enforce-module-boundaries
import * as frontEndSharedMock from '../../../shared';
import { CreateDomainLayerGeneratorSchema } from './schema';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ApplicationType, getGroupingFolders } from '../../../../shared/utils';
import { createDummyGroupingFolder } from '@srleecode/domain/shared/test-utils';

describe('createDomainLayerGenerator', () => {
  let tree: Tree;
  const commonLibraryOptions: AngularCreateLibrarySchema = {
    buildable: true,
    strict: false,
    enableIvy: true,
    publishable: false,
  };
  const groupingFolder = 'libs/test-app/test-domain/';
  beforeEach(() => {
    jest.clearAllMocks();
    tree = createTreeWithEmptyWorkspace();
    createDummyGroupingFolder(tree, groupingFolder);
    jest.spyOn(frontEndSharedMock, 'addDomainLibrary');
  });

  it('should pass correct parameters to @nx/angular generator', async () => {
    const schema: CreateDomainLayerGeneratorSchema = {
      groupingFolder,
      buildable: true,
      strict: false,
      enableIvy: true,
      publishable: false,
    };
    const groupingFolders = getGroupingFolders(tree, schema.groupingFolder);
    await createDomainLayerGenerator(tree, schema);
    expect(frontEndSharedMock.addDomainLibrary).toHaveBeenCalledWith(
      expect.anything(),
      '',
      'domain',
      schema.groupingFolder,
      groupingFolders.app,
      ApplicationType.Angular,
      true,
      schema,
    );
  });
  it('should add jest junit reporter config when addJestJunitReporter is true', async () => {
    await createDomainLayerGenerator(tree, {
      ...commonLibraryOptions,
      groupingFolder,
      addJestJunitReporter: true,
    });
    const jestConfig = tree
      .read(`${groupingFolder}/domain/jest.config.ts`)
      .toString();
    expect(jestConfig).toMatch('jest-junit');
  });
  it('should add create correct domain name in tsconfig', async () => {
    await createDomainLayerGenerator(tree, {
      ...commonLibraryOptions,
      groupingFolder,
      addJestJunitReporter: true,
    });
    const jestConfig = tree
      .read(`${groupingFolder}/domain/project.json`)
      .toString();
    expect(jestConfig).toMatch('"name": "test-app-test-domain-domain"');
  });
});
