import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { getProjects, readJson, Tree } from '@nx/devkit';
import { removeGenerator } from './generator';
import { CreateInfrastructureLayerGeneratorSchema } from '../../../front-end/angular/infrastructure-layer/src/schema';
import { createInfrastructureLayerGenerator } from '../../../front-end/angular/infrastructure-layer/src/generator';
import { createDummyGroupingFolder } from '@srleecode/domain/shared/test-utils';
jest.mock('prettier', () => null);

describe('removeGenerator', () => {
  let appTree: Tree;
  const folderToDelete = 'libs/test-app';

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    createDummyGroupingFolder(appTree, `libs/test-app/test-domain`);
  });

  it('should remove all projects under the given folder', async () => {
    const schema: CreateInfrastructureLayerGeneratorSchema = {
      groupingFolder: 'libs/test-app/test-domain/',
      buildable: true,
      strict: false,
      enableIvy: true,
      publishable: false,
    };
    await createInfrastructureLayerGenerator(appTree, {
      ...schema,
      addJestJunitReporter: true,
    });
    await removeGenerator(appTree, {
      groupingFolder: folderToDelete,
    });
    const projects = getProjects(appTree);
    expect(projects.size).toBe(0);
  });
  it('should remove project from tsconfig', async () => {
    const schema: CreateInfrastructureLayerGeneratorSchema = {
      groupingFolder: 'libs/test-app/test-domain',
      buildable: true,
      strict: false,
      enableIvy: true,
      publishable: false,
    };
    await createInfrastructureLayerGenerator(appTree, {
      ...schema,
      addJestJunitReporter: true,
    });
    await removeGenerator(appTree, {
      groupingFolder: folderToDelete,
    });
    const tsConfig = readJson(appTree, 'tsconfig.base.json');
    const tsConfigPaths = Object.keys(tsConfig.compilerOptions.paths);
    expect(tsConfigPaths).toEqual([]);
  });
});
