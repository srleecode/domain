import { logger, readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { libraryGenerator } from '@nrwl/angular/src/generators/library/library';
import { createMockFileGenerator } from './generator';

describe('createMockFileGenerator', () => {
  let tree: Tree;
  const sourceRoot = 'libs/test-app/test-domain/feature-test-example/src';
  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    await libraryGenerator(tree, {
      name: 'feature-test-example',
      directory: 'test-app/test-domain',
    }).catch((e: Error) => {
      logger.error(e.message);
      logger.error(e.stack);
      throw e;
    });
    await createMockFileGenerator(tree, {
      projectName: 'test-app-test-domain-feature-test-example',
      mockFileName: 'test-example',
    });
  });

  it('should create mock file', () => {
    const mockFile = tree
      .read(`${sourceRoot}/lib/mocks/test-example.mock.ts`)
      .toString();
    expect(mockFile).toBe(`export const TEST_EXAMPLE_MOCK = {};`);
  });

  it('should create index exporting mock file', () => {
    const indexFile = tree.read(`${sourceRoot}/testing.ts`).toString();
    expect(indexFile).toBe(`export * from './lib/mocks/test-example.mock';`);
  });

  it('should create tsconfig path', () => {
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
