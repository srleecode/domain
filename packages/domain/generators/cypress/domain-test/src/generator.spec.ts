import { readJson, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { setupDomainTestGenerator } from './generator';

describe('setupDomainTestGenerator', () => {
  let tree: Tree;

  describe('e2e', () => {
    beforeAll(async () => {
      tree = createTreeWithEmptyWorkspace();
      tree.write(`libs/test-app/test-domain/shell/src.index.ts`, '');
      await setupDomainTestGenerator(tree, {
        groupingFolder: 'libs/test-app/test-domain',
        type: 'e2e',
      });
    }, 240000);

    it('should move cypress directory from apps to libs', async () => {
      expect(
        tree.exists(`libs/test-app/test-domain/.e2e/cypress.config.ts`)
      ).toBe(true);
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
    it('should add tags', () => {
      const projectConfig = readProjectConfiguration(
        tree,
        'e2e-test-app-test-domain'
      );
      expect(projectConfig.tags).toEqual([
        'app:test-app',
        'scope:test-app-test-domain',
        'type:e2e',
      ]);
    });
  });

  describe('ct', () => {
    const cypressFile = 'libs/test-app/test-domain/.ct/cypress.config.ts';
    beforeAll(async () => {
      tree = createTreeWithEmptyWorkspace();
      tree.write(`libs/test-app/test-domain/shell/src.index.ts`, '');
      await setupDomainTestGenerator(tree, {
        groupingFolder: 'libs/test-app/test-domain',
        type: 'ct',
      });
    }, 240000);

    it('should move cypress directory from apps to libs', () => {
      expect(tree.exists(cypressFile)).toBe(true);
    });
    it('should replace e2e with the ct target', () => {
      const projectConfig = readProjectConfiguration(
        tree,
        'ct-test-app-test-domain'
      );
      const ctTarget = projectConfig.targets['ct'];
      expect(ctTarget).toEqual({
        executor: '@nrwl/cypress:cypress',
        options: {
          cypressConfig: cypressFile,
          testingType: 'e2e',
          baseUrl: 'http://localhost:4400',
        },
      });
    });
  });
});
