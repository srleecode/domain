import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import {
  isHavingCypressProject,
  getCypressProjectName,
  isHavingImplicitDependenciesAfterRemoval,
  getUnprocessedCypressProjectName,
  getCypressJsonPath,
  getCypressProjectLinter,
  isHavingEsLintRcJson,
  isHavingComponentCommand,
} from './cypress-project';
import * as treeUtils from './tree';
import { CypressProject } from '../model/cypress-project.enum';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { getParsedDomain } from './domain';
import { Linter } from '../model/linter.enum';
import { addProjectConfiguration } from './project-configuration';

describe('Cypress project', () => {
  let appTree: Tree;
  const application = 'test-application';
  const leafDomain = 'leaf-domain';

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  describe('getCypressProjectName', () => {
    it('should return e2e project name for given application, domain and e2e cypress project type', () => {
      expect(
        getCypressProjectName(application, leafDomain, CypressProject.E2E)
      ).toBe(`${CypressProject.E2E}-${application}-${leafDomain}`);
    });
  });

  describe('isHavingImplicitDependenciesAfterRemoval', () => {
    const noDependenciesDomain = 'second-domain';
    beforeEach(() => {
      addProjectConfiguration(
        appTree,
        `${CypressProject.E2E}-${application}-${leafDomain}`,
        {
          targets: {},
          root: '',
          implicitDependencies: [
            `${application}-${leafDomain}-${DomainLibraryName.DataAccess}`,
          ],
        }
      );
    });

    it('should return true when project has implicit dependencies that are not being removed', () => {
      expect(
        isHavingImplicitDependenciesAfterRemoval(
          appTree,
          application,
          leafDomain,
          [],
          CypressProject.E2E
        )
      ).toBe(true);
    });
    it('should return false when project has implicit dependencies that are being removed', () => {
      expect(
        isHavingImplicitDependenciesAfterRemoval(
          appTree,
          application,
          leafDomain,
          [DomainLibraryName.DataAccess],
          CypressProject.E2E
        )
      ).toBe(false);
    });
    it('should return false when project has no implicit dependencies', () => {
      expect(
        isHavingImplicitDependenciesAfterRemoval(
          appTree,
          application,
          noDependenciesDomain,
          [],
          CypressProject.E2E
        )
      ).toBe(false);
    });
  });
  describe('isHavingCypressProject', () => {
    beforeEach(() => {
      addProjectConfiguration(
        appTree,
        `${CypressProject.E2E}-${application}-${leafDomain}`,
        {
          targets: {},
          root: '',
          implicitDependencies: [
            `${application}-${leafDomain}-${DomainLibraryName.DataAccess}`,
          ],
        }
      );
    });
    it('should return true when domain has e2e project', () => {
      expect(
        isHavingCypressProject(
          application,
          leafDomain,
          CypressProject.E2E,
          appTree
        )
      ).toBe(true);
    });
    it('should return false when domain does not have e2e project', () => {
      expect(
        isHavingCypressProject(application, 'test', CypressProject.E2E, appTree)
      ).toBe(false);
    });
  });
  describe('getCypressJsonPath', () => {
    it('should get e2e cypress json path string', () => {
      const domain = 'parent-domain/child-domain';
      expect(getCypressJsonPath(application, domain, CypressProject.E2E)).toBe(
        `libs/${application}/${domain}/.cypress/cypress.json`
      );
    });
    it('should get storybook cypress json path string', () => {
      const domain = 'parent-domain/child-domain';
      expect(
        getCypressJsonPath(application, domain, CypressProject.Storybook)
      ).toBe(`libs/${application}/${domain}/.cypress/storybook-cypress.json`);
    });
  });
  describe('getUnprocessedCypressProjectName', () => {
    it('should return child domain', () => {
      const domain = 'parent-domain/child-domain';
      expect(
        getUnprocessedCypressProjectName(
          application,
          domain,
          CypressProject.E2E
        )
      ).toBe(`${CypressProject.E2E}-${application}-${getParsedDomain(domain)}`);
    });
    it('should return parent domain', () => {
      const domain = 'parent-domain/shared';
      expect(
        getUnprocessedCypressProjectName(
          application,
          domain,
          CypressProject.E2E
        )
      ).toBe(`${CypressProject.E2E}-${application}-${getParsedDomain(domain)}`);
    });

    it('should return leaf domain', () => {
      const domain = 'leaf-domain';
      expect(
        getUnprocessedCypressProjectName(
          application,
          domain,
          CypressProject.E2E
        )
      ).toBe(`${CypressProject.E2E}-${application}-${domain}`);
    });
  });
  describe('getCypressProjectLinter', () => {
    beforeEach(() => {
      addProjectConfiguration(
        appTree,
        `${CypressProject.Storybook}-${application}-${leafDomain}`,
        {
          root: 'libs/test-application/jest-junit-reporter/.cypress',
          sourceRoot: 'libs/test-application/jest-junit-reporter/.cypress/src',
          projectType: 'application',
          targets: {
            lint: {
              executor: '@nrwl/linter:lint',
              options: {
                linter: 'eslint',
                tsConfig: [
                  'libs/test-application/jest-junit-reporter/.cypress/tsconfig.e2e.json',
                ],
                exclude: [
                  '**/node_modules/**',
                  '!libs/test-application/jest-junit-reporter/.*/**',
                ],
              },
            },
          },
        }
      );
      addProjectConfiguration(
        appTree,
        `${CypressProject.Storybook}-${application}-${leafDomain}-tslint`,
        {
          root: 'libs/test-application/jest-junit-reporter/.cypress',
          sourceRoot: 'libs/test-application/jest-junit-reporter/.cypress/src',
          projectType: 'application',
          targets: {
            lint: {
              executor: '@angular-devkit/build-angular:tslint',
              options: {
                tsConfig: [],
                exclude: [
                  '**/node_modules/**',
                  '!libs/test-application/storybook-domain/data-access/**/*',
                ],
              },
            },
          },
        }
      );
    });

    it('should return configured Linter when project has lint builder @nrwl/linter:lint', () => {
      expect(
        getCypressProjectLinter(
          application,
          leafDomain,
          CypressProject.Storybook,
          appTree
        )
      ).toBe(Linter.EsLint);
    });
    it('should return Linter as TsLint when project has lint builder @angular-devkit/build-angular:tslint', () => {
      expect(
        getCypressProjectLinter(
          application,
          `${leafDomain}-tslint`,
          CypressProject.Storybook,
          appTree
        )
      ).toBe(Linter.TsLint);
    });
  });
  describe('isHavingEsLintRcJson', () => {
    beforeEach(() => {
      jest.spyOn(treeUtils, 'existsInTree').mockReturnValue(true);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should check if cypress project eslintrc.json exists', () => {
      isHavingEsLintRcJson(appTree, application, leafDomain);
      expect(treeUtils.existsInTree).toHaveBeenCalledWith(
        appTree,
        `libs/${application}/${leafDomain}/.cypress/.eslintrc.json`
      );
    });
  });
  describe('isHavingComponentCommand', () => {
    beforeEach(() => {
      appTree.write(
        `libs/${application}/${leafDomain}/.cypress/src/support/component-command.ts`,
        ''
      );
    });
    it('should return true if component command file exists', () => {
      isHavingEsLintRcJson(appTree, application, leafDomain);
      expect(isHavingComponentCommand(appTree, application, leafDomain)).toBe(
        true
      );
    });
  });
});
