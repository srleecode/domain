import { readProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { defaultOptions } from './default-options.constant';
import createComponentGenerator from './generator';
import { ComponentType } from './model/component-type.enum';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { createDummyGroupingFolder } from '../../../../shared/test-utils';
jest.mock('prettier', () => null);

describe('createComponentGenerator', () => {
  let tree: Tree;
  const libraryPath = 'libs/test-app/test-domain/presentation';
  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    createDummyGroupingFolder(tree, defaultOptions.groupingFolder);
  });

  it('should create presentation library when it doesnt exist', async () => {
    const libraryPath = 'libs/test-app/test-domain/presentation';
    await createComponentGenerator(tree, defaultOptions);
    expect(
      tree.exists(
        `${libraryPath}/src/lib/feature/test-example/test-example.component.ts`,
      ),
    ).toBe(true);
  });
  it('should create project with the correct tags', async () => {
    await createComponentGenerator(tree, defaultOptions);
    const projectConfig = readProjectConfiguration(
      tree,
      'test-app-test-domain-presentation',
    );
    expect(projectConfig.tags).toEqual([
      'app:test-app',
      'scope:test-app-test-domain',
      'type:presentation',
    ]);
  });
  it('should only add component when presentation library already exists', async () => {
    await createComponentGenerator(tree, defaultOptions);
    await createComponentGenerator(tree, {
      ...defaultOptions,
      type: ComponentType.Ui,
    });

    expect(
      tree.exists(
        `${libraryPath}/src/lib/feature/test-example/test-example.component.ts`,
      ),
    ).toBe(true);
    expect(
      tree.exists(
        `${libraryPath}/src/lib/ui/test-example/test-example.component.ts`,
      ),
    ).toBe(true);
  });
  it('should add export to index', async () => {
    await createComponentGenerator(tree, {
      ...defaultOptions,
      type: ComponentType.Ui,
    });
    const indexTs = tree.read(`${libraryPath}/src/index.ts`).toString();
    expect(indexTs).toMatch(
      `export * from './lib/ui/test-example/test-example.component';`,
    );
  });
  it('should create correct jest config', async () => {
    await createComponentGenerator(tree, defaultOptions);
    const jestConfig = tree.read(`${libraryPath}/jest.config.ts`).toString();
    expect(jestConfig).toMatch(
      `displayName: 'test-app-test-domain-presentation',`,
    );
  });
  it('should use provided prefix in eslint', async () => {
    await createComponentGenerator(tree, { ...defaultOptions, prefix: 'test' });
    const eslintFile = tree.read(`${libraryPath}/.eslintrc.json`).toString();
    expect(eslintFile).toMatch(`"prefix": "test"`);
  });
});
