import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { getProjects, Tree } from '@nrwl/devkit';
import { removeGenerator } from './generator';
import { CreateInfrastructureLayerGeneratorSchema } from '../../../front-end/angular/infrastructure-layer/src/schema';
import { createInfrastructureLayerGenerator } from '../../../front-end/angular/infrastructure-layer/src/generator';
import { createDummyGroupingFolder } from '@srleecode/domain/shared/test-utils';

describe('removeGenerator', () => {
  let appTree: Tree;
  const folderToDelete = 'libs/test-app';

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    createDummyGroupingFolder(appTree, `libs/test-app/test-domain`);
  });

  it('should be no changes when no projects root starts with given folder', async () => {
    const existingFileChanges = appTree
      .listChanges()
      .filter((c) => c.path !== 'libs/test-app/test-domain/dummyFile');
    await removeGenerator(appTree, {
      groupingFolder: folderToDelete,
    });

    expect(appTree.listChanges()).toEqual(existingFileChanges);
  });

  it('should remove all projects under the given folder', async () => {
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
    const projects = getProjects(appTree);
    expect(projects.size).toBe(0);
  });
});
