import { readJson, updateJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { cypressProjectGenerator } from './generator';
import { AddCypressProjectGeneratorSchema } from './schema';
import { CypressProject } from '../shared/model/cypress-project.enum';
import { getModuleFilePath, printTreeChanges } from '../shared/utils/tree';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';

describe('generator:cypress-project', () => {
  let tree: Tree;
  const application = 'test-application';
  const domain = 'domain';
  const defaultOptions: AddCypressProjectGeneratorSchema = {
    application: 'test-application',
    domain: 'domain',
    projectType: CypressProject.E2E,
    addComponentCommand: false,
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    const moduleFile = `import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
})
export class TestApplicationMultipleLibraryDomainFeatureModule {}`;
    tree.write(
      getModuleFilePath(application, domain, DomainLibraryName.Feature),
      moduleFile
    );
    tree.write('jest.config.js', `module.exports = {projects: []};`);
    updateJson(tree, 'nx.json', (json) => {
      json.projects = {};
      json.projects[
        `${application}-${domain}-${DomainLibraryName.DataAccess}`
      ] = {};
      return json;
    });
    updateJson(tree, 'workspace.json', (json) => {
      json.projects = {};
      json.projects[
        `${application}-${domain}-${DomainLibraryName.DataAccess}`
      ] = {
        projectType: 'library',
        root: `libs/${application}/${domain}/${DomainLibraryName.DataAccess}`,
        sourceRoot: `libs/${application}/${domain}/${DomainLibraryName.DataAccess}/src`,
        prefix: 'srlee',
        targets: {
          lint: {
            executor: '@nrwl/linter:eslint',
            options: {
              lintFilePatterns: [
                `libs/${application}/${domain}/${DomainLibraryName.DataAccess}/src/**/*.ts`,
                `libs/${application}/${domain}/${DomainLibraryName.DataAccess}/src/**/*.html`,
              ],
            },
          },
          test: {
            executor: '@nrwl/jest:jest',
            outputs: [
              `coverage/libs/${application}/${domain}/${DomainLibraryName.DataAccess}`,
            ],
            options: {
              jestConfig: `libs/${application}/${domain}/${DomainLibraryName.DataAccess}/jest.config.js`,
              passWithNoTests: true,
            },
          },
        },
      };
      return json;
    });
    tree.write(
      `libs/${application}/${domain}/${DomainLibraryName.DataAccess}/tsconfig.json`,
      `{"exclude": [] }`
    );
    tree.write(
      `libs/${application}/${domain}/${DomainLibraryName.DataAccess}/tsconfig.lib.json`,
      `{"exclude": [] }`
    );
    tree.write(
      `libs/${application}/${domain}/${DomainLibraryName.DataAccess}/.eslintrc.json`,
      `{"overrides": [{"parserOptions": {"project": ["libs/test-application/jest-junit-reporter/data-access/tsconfig.*?.json"]}  }]}`
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('Cypress Project', () => {
    it('should generate e2e project in domain', async () => {
      await cypressProjectGenerator(tree, {
        ...defaultOptions,
        addComponentCommand: true,
      }).catch((e) => {
        printTreeChanges(tree);
        throw e;
      });

      const nxJson = readJson(tree, 'nx.json');
      const workspaceJson = readJson(tree, 'workspace.json');
      const projectName = `e2e-${application}-${domain}`;
      expect(nxJson.projects[projectName]).toBeDefined();
      expect(workspaceJson.projects[projectName]).toBeDefined();
      expect(
        tree.exists(
          `libs/${application}/${domain}/.cypress/src/support/index.ts`
        )
      ).toBe(true);
      expect(nxJson.projects[projectName].implicitDependencies).toEqual([
        `${application}-${domain}-${DomainLibraryName.DataAccess}`,
      ]);
      expect(
        tree.exists(
          `libs/${application}/${domain}/.cypress/src/support/component-command.ts`
        )
      ).toBe(true);
    });
    it('should generate storybook project in domain', async () => {
      await cypressProjectGenerator(tree, {
        ...defaultOptions,
        projectType: CypressProject.Storybook,
      }).catch((e) => {
        printTreeChanges(tree);
        throw e;
      });

      const nxJson = readJson(tree, 'nx.json');
      const workspaceJson = readJson(tree, 'workspace.json');
      const projectName = `storybook-${application}-${domain}`;
      expect(nxJson.projects[projectName]).toBeDefined();
      expect(workspaceJson.projects[projectName]).toBeDefined();
    });
  });
});
