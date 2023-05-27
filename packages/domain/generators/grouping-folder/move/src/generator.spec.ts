import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { getProjects, readJson, Tree } from '@nx/devkit';
import { moveGenerator } from './generator';
import { setupDomainTestGenerator } from '@srleecode/domain/cypress/domain-test';
import { CreateInfrastructureLayerGeneratorSchema } from '../../../front-end/angular/infrastructure-layer/src/schema';
import { createInfrastructureLayerGenerator } from '../../../front-end/angular/infrastructure-layer/src/generator';

describe('moveGenerator', () => {
  let appTree: Tree;
  const originalFolder = 'libs/test-app';
  const destination = 'libs/second-test-app';
  const schema: CreateInfrastructureLayerGeneratorSchema = {
    groupingFolder: 'libs/test-app/test-domain',
    buildable: true,
    strict: false,
    enableIvy: true,
    publishable: false,
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should be no changes when no projects root starts with given folder', async () => {
    const existingFileChanges = appTree.listChanges();
    await moveGenerator(appTree, {
      groupingFolder: originalFolder,
      destination,
    });
    expect(appTree.listChanges()).toEqual(existingFileChanges);
  });

  it('should move all projects under the given folder', async () => {
    await createInfrastructureLayerGenerator(appTree, {
      ...schema,
      addJestJunitReporter: true,
    });
    await setupDomainTestGenerator(appTree, {
      groupingFolder: 'libs/test-app/test-domain',
      type: 'e2e',
    });
    await moveGenerator(appTree, {
      groupingFolder: originalFolder,
      destination,
    });
    const projects = getProjects(appTree);
    expect([...projects.keys()]).toEqual([
      'second-test-app-test-domain-infrastructure',
      'second-test-app-test-domain-e2e',
    ]);
  });

  it('should move project references for project that is moved', async () => {
    await createInfrastructureLayerGenerator(appTree, {
      ...schema,
      addJestJunitReporter: true,
    });
    await moveGenerator(appTree, {
      groupingFolder: originalFolder,
      destination,
    });
    const projects = getProjects(appTree);
    expect(
      projects.get('second-test-app-test-domain-infrastructure').root
    ).toBe('libs/second-test-app/test-domain/infrastructure');
    const tsConfig = readJson(appTree, 'tsconfig.base.json');
    expect(tsConfig.compilerOptions.paths).toEqual({
      '@proj/second-test-app/test-domain/infrastructure': [
        'libs/second-test-app/test-domain/infrastructure/src/index.ts',
      ],
    });
  });
});
