import { readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { defaultOptions } from './default-options.constant';
import createComponentGenerator from './generator';
import { ComponentType } from './model/component-type.enum';

describe('createComponentGenerator', () => {
  let tree: Tree;
  const libraryPath = 'libs/test-app/test-domain/presentation';
  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should create presentation library when it doesnt exist', async () => {
    const libraryPath = 'libs/test-app/test-domain/presentation';
    await createComponentGenerator(tree, defaultOptions);
    expect(
      tree.exists(
        `${libraryPath}/src/lib/feature/test-example/test-example.component.ts`
      )
    ).toBe(true);
  });
  it('should create project with the correct tags', async () => {
    await createComponentGenerator(tree, defaultOptions);
    const projectConfig = readProjectConfiguration(
      tree,
      'test-app-test-domain-presentation'
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
        `${libraryPath}/src/lib/feature/test-example/test-example.component.ts`
      )
    ).toBe(true);
    expect(
      tree.exists(
        `${libraryPath}/src/lib/ui/test-example/test-example.component.ts`
      )
    ).toBe(true);
  });
  it('should add export to index', async () => {
    await createComponentGenerator(tree, defaultOptions);
    await createComponentGenerator(tree, {
      ...defaultOptions,
      type: ComponentType.Ui,
    });
    const indexTs = tree.read(`${libraryPath}/src/index.ts`).toString();
    expect(indexTs).toMatch(
      `export * from './lib/feature/test-example.component.ts';`
    );
    expect(indexTs).toMatch(
      `export * from './lib/ui/test-example.component.ts';`
    );
  });
});
