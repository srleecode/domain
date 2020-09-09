import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';
import {
  isHavingE2ECypressProject,
  getE2ECypressProjectName,
  isHavingImplicitDependenciesAfterRemoval,
  getUnprocessedE2ECypressProjectName,
} from './e2e-project';
import * as nxJsonUtils from '../utils/nx-json';
import { NxJson } from '@nrwl/workspace';
import { DomainLibraryName } from '../schematics/shared/model/domain-library-name.enum';
import { getParsedDomain } from './domain';

describe('e2e project', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const leafDomain = 'leaf-domain';

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
  });

  describe('getE2ECypressProjectName', () => {
    it('should return e2e project name for given application and domain', () => {
      expect(getE2ECypressProjectName(application, leafDomain)).toBe(
        `e2e-${application}-${leafDomain}`
      );
    });
  });

  describe('isHavingImplicitDependenciesAfterRemoval', () => {
    const noDependenciesDomain = 'second-domain';
    const mockNxJson: NxJson = {
      npmScope: 'project',
      projects: {
        [`e2e-${application}-${leafDomain}`]: {
          implicitDependencies: [
            `${application}-${leafDomain}-${DomainLibraryName.DataAccess}`,
          ],
        },
        [`e2e-${application}-${noDependenciesDomain}`]: {
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
          appTree
        )
      ).toBe(false);
    });
  });
  describe('isHavingE2ECypressProject', () => {
    const mockNxJson: NxJson = {
      npmScope: 'project',
      projects: {
        [`e2e-${application}-${leafDomain}`]: {
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
      expect(isHavingE2ECypressProject(application, leafDomain, appTree)).toBe(
        true
      );
    });
    it('should return false when domain does not have e2e project', () => {
      expect(isHavingE2ECypressProject(application, 'test', appTree)).toBe(
        false
      );
    });
  });
  describe('getUnprocessedE2ECypressProjectName', () => {
    it('should return child domain with two slashes', () => {
      const domain = 'parent-domain/child-domain';
      expect(getUnprocessedE2ECypressProjectName(application, domain)).toBe(
        `e2e/${application}/${getParsedDomain(domain)}`
      );
    });
    it('should return parent domain with two slashes', () => {
      const domain = 'parent-domain/shared';
      expect(getUnprocessedE2ECypressProjectName(application, domain)).toBe(
        `e2e/${application}/${getParsedDomain(domain)}`
      );
    });

    it('should return leaf domain with one slashes', () => {
      const domain = 'leaf-domain';
      expect(getUnprocessedE2ECypressProjectName(application, domain)).toBe(
        `e2e/${application}-${domain}`
      );
    });
  });
});
