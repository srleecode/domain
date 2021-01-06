import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import {
  isHavingCypressProject,
  getCypressProjectName,
  isHavingImplicitDependenciesAfterRemoval,
  getUnprocessedCypressProjectName,
  getCypressJsonPath,
  getCypressProjectLinter,
  getStorybookProjectUiFramework,
} from './cypress-project';
import * as nxJsonUtils from './nx-json';
import * as treeUtils from './tree';
import { Linter, NxJson } from '@nrwl/workspace';
import { DomainLibraryName } from '../schematics/shared/model/domain-library-name.enum';
import { getParsedDomain } from './domain';
import { CypressProject } from '../schematics/shared/model/cypress-project.enum';

describe('Cypress project', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const leafDomain = 'leaf-domain';

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
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
    const mockNxJson: NxJson = {
      npmScope: 'project',
      projects: {
        [`${CypressProject.E2E}-${application}-${leafDomain}`]: {
          implicitDependencies: [
            `${application}-${leafDomain}-${DomainLibraryName.DataAccess}`,
          ],
        },
        [`${CypressProject.E2E}-${application}-${noDependenciesDomain}`]: {
          implicitDependencies: [],
        },
      },
    };
    beforeEach(() => {
      jest.spyOn(nxJsonUtils, 'getNxJson').mockReturnValue(mockNxJson);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should return true when project has implicit dependencies that are not being removed', () => {
      expect(
        isHavingImplicitDependenciesAfterRemoval(
          application,
          leafDomain,
          [],
          CypressProject.E2E,
          appTree
        )
      ).toBe(true);
    });
    it('should return false when project has implicit dependencies that are being removed', () => {
      expect(
        isHavingImplicitDependenciesAfterRemoval(
          application,
          leafDomain,
          [DomainLibraryName.DataAccess],
          CypressProject.E2E,
          appTree
        )
      ).toBe(false);
    });
    it('should return false when project has no implicit dependencies', () => {
      expect(
        isHavingImplicitDependenciesAfterRemoval(
          application,
          noDependenciesDomain,
          [],
          CypressProject.E2E,
          appTree
        )
      ).toBe(false);
    });
  });
  describe('isHavingCypressProject', () => {
    const mockNxJson: NxJson = {
      npmScope: 'project',
      projects: {
        [`${CypressProject.E2E}-${application}-${leafDomain}`]: {
          implicitDependencies: [
            `${application}-${leafDomain}-${DomainLibraryName.DataAccess}`,
          ],
        },
      },
    };
    beforeEach(() => {
      jest.spyOn(nxJsonUtils, 'getNxJson').mockReturnValue(mockNxJson);
    });
    afterEach(() => {
      jest.clearAllMocks();
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
    it('should return child domain with two slashes', () => {
      const domain = 'parent-domain/child-domain';
      expect(
        getUnprocessedCypressProjectName(
          application,
          domain,
          CypressProject.E2E
        )
      ).toBe(`${CypressProject.E2E}/${application}/${getParsedDomain(domain)}`);
    });
    it('should return parent domain with two slashes', () => {
      const domain = 'parent-domain/shared';
      expect(
        getUnprocessedCypressProjectName(
          application,
          domain,
          CypressProject.E2E
        )
      ).toBe(`${CypressProject.E2E}/${application}/${getParsedDomain(domain)}`);
    });

    it('should return leaf domain with one slashes', () => {
      const domain = 'leaf-domain';
      expect(
        getUnprocessedCypressProjectName(
          application,
          domain,
          CypressProject.E2E
        )
      ).toBe(`${CypressProject.E2E}/${application}-${domain}`);
    });
  });
  describe('getCypressProjectLinter', () => {
    const mockWorkspaceJson = {
      projects: {
        [`${CypressProject.Storybook}-${application}-${leafDomain}`]: {
          root: 'libs/test-application/jest-junit-reporter/.cypress',
          sourceRoot: 'libs/test-application/jest-junit-reporter/.cypress/src',
          projectType: 'application',
          architect: {
            lint: {
              builder: '@nrwl/linter:lint',
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
        },
        [`${CypressProject.Storybook}-${application}-${leafDomain}-tslint`]: {
          root: 'libs/test-application/jest-junit-reporter/.cypress',
          sourceRoot: 'libs/test-application/jest-junit-reporter/.cypress/src',
          projectType: 'application',
          architect: {
            lint: {
              builder: '@angular-devkit/build-angular:tslint',
              options: {
                tsConfig: [],
                exclude: [
                  '**/node_modules/**',
                  '!libs/test-application/storybook-domain/data-access/**/*',
                ],
              },
            },
          },
        },
      },
    };
    beforeEach(() => {
      jest
        .spyOn(treeUtils, 'readWorkspaceInTree')
        .mockReturnValue(mockWorkspaceJson);
    });
    afterEach(() => {
      jest.clearAllMocks();
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
  describe('getStorybookProjectUiFramework', () => {
    const mockWorkspaceJson = {
      projects: {
        [`${CypressProject.Storybook}-${application}-${leafDomain}`]: {
          root: 'libs/test-application/jest-junit-reporter/.cypress',
          sourceRoot: 'libs/test-application/jest-junit-reporter/.cypress/src',
          projectType: 'application',
          architect: {
            storybook: {
              builder: '@nrwl/storybook:storybook',
              options: {
                uiFramework: '@storybook/angular',
                port: 4400,
                config: {
                  configFolder:
                    'libs/test-application/jest-junit-reporter/.cypress',
                },
              },
              configurations: {
                ci: {
                  quiet: true,
                },
              },
            },
          },
        },
      },
    };
    beforeEach(() => {
      jest
        .spyOn(treeUtils, 'readWorkspaceInTree')
        .mockReturnValue(mockWorkspaceJson);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should return ui framework for given project', () => {
      expect(
        getStorybookProjectUiFramework(application, leafDomain, appTree)
      ).toBe('@storybook/angular');
    });
  });
});
