import { logger, readJson, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { libraryGenerator } from '@nx/angular/generators';
import { createMockFileGenerator } from './generator';

describe('createMockFileGenerator', () => {
  let tree: Tree;
  const sourceRoot = 'libs/test-app/test-domain/feature-test-example/src';
  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });
  const runGenerators = async () => {
    await libraryGenerator(tree, {
      name: 'feature-test-example',
      directory: 'libs/test-app/test-domain',
    }).catch((e: Error) => {
      logger.error(e.message);
      logger.error(e.stack);
      throw e;
    });
    await createMockFileGenerator(tree, {
      projectName: 'test-app-test-domain-feature-test-example',
      mockFileName: 'test-example',
    });
  };
  it('should create mock file', async () => {
    await runGenerators();
    const mockFile = tree
      .read(`${sourceRoot}/lib/mocks/test-example.mock.ts`)
      .toString();
    expect(mockFile).toMatch(`export const TEST_EXAMPLE_MOCK = {};`);
  });

  it('should create index exporting mock file', async () => {
    await runGenerators();
    const indexFile = tree.read(`${sourceRoot}/testing.ts`).toString();
    expect(indexFile).toMatch(`export * from './lib/mocks/test-example.mock';`);
  });

  it('should create tsconfig path', async () => {
    await runGenerators();
    const tsConfig = readJson(tree, 'tsconfig.base.json');
    expect(
      tsConfig.compilerOptions.paths[
        '@proj/test-app/test-domain/feature-test-example/testing'
      ]
    ).toEqual([
      'libs/test-app/test-domain/feature-test-example/src/testing.ts',
    ]);
  });
});
