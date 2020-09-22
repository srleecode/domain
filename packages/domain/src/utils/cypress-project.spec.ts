import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import {
  isHavingCypressProject,
  getCypressProjectName,
  isHavingImplicitDependenciesAfterRemoval,
  getUnprocessedCypressProjectName,
  getCypressJsonPath,
} from './cypress-project';
import * as nxJsonUtils from './nx-json';
import { NxJson } from '@nrwl/workspace';
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
    it('should get cypress json path string', () => {
      const domain = 'parent-domain/child-domain';
      expect(getCypressJsonPath(application, domain, CypressProject.E2E)).toBe(
        `apps/${CypressProject.E2E}/${application}/${domain}/cypress.json`
      );
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
});
