import { readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { cypressE2EGenerator } from './generator';

describe('cypressE2EGenerator', () => {
  let tree: Tree;

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    tree.write(`libs/test-app/test-domain/shell/src.index.ts`, '');
    await cypressE2EGenerator(tree, {
      baseFolder: 'libs/test-app/test-domain',
    });
  });

  it('should move cypress directory from apps to libs', async () => {
    expect(tree.exists(`libs/test-app/test-domain/.e2e/cypress.json`)).toBe(
      true
    );
  });

  it('should update cypress cypress project name to correct name', async () => {
    expect(
      readProjectConfiguration(tree, 'e2e-test-app-test-domain')
    ).toBeDefined();
  });

  it('should delete dev server target from e2e target', async () => {
    const projectConfig = readProjectConfiguration(
      tree,
      'e2e-test-app-test-domain'
    );
    const e2eTarget = projectConfig.targets['e2e'];
    expect(e2eTarget.options.devServerTarget).toBeUndefined();
    expect(e2eTarget.configurations).toBeUndefined();
  });

  it('should remove page object file', () => {
    expect(
      tree.exists(`libs/test-app/test-domain/.e2e/src/support/app.po.ts`)
    ).toBe(false);
  });

  it('should remove custom commands file', () => {
    expect(
      tree.exists(`libs/test-app/test-domain/.e2e/src/support/commands.ts`)
    ).toBe(false);
  });

  it('should reset index.ts to an empty file', () => {
    expect(
      tree
        .read(`libs/test-app/test-domain/.e2e/src/support/index.ts`)
        .toString()
    ).toBe('');
  });

  it('should add existing domain libraries as implicit dependencies', () => {
    const projectConfig = readProjectConfiguration(
      tree,
      'e2e-test-app-test-domain'
    );
    expect(projectConfig.implicitDependencies).toEqual([
      'test-app-test-domain-shell',
    ]);
  });
});
