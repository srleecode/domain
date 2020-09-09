import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import * as testingUtils from '../../../utils/testing';
import * as domainUtils from '../../../utils/domain';
import { Project } from '../../shared/model/project.model';
import { removeDomain } from './remove-domain';

describe('removeDomainRules', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const leafDomain = 'leaf-domain';
  const parentDomain = 'parent-domain';
  const childDomain = 'child-domain';
  const dataAccesslibraryType = DomainLibraryName.DataAccess;
  const utilLibraryType = DomainLibraryName.Util;
  const leafDomainDataAccessProjectName = `${application}-${leafDomain}-${dataAccesslibraryType}`;
  const leafDomainUtilProjectName = `${application}-${leafDomain}-${utilLibraryType}`;
  const parentDomainUtilProjectName = `${application}-${parentDomain}-shared-${utilLibraryType}`;
  const childDomainUtilProjectName = `${application}-${parentDomain}-${childDomain}-${utilLibraryType}`;

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
    jest
      .spyOn(testingUtils, 'getExternalSchematic')
      .mockReturnValue(testingUtils.emptyRule);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate remove rules when there are multiple libraries in leaf domain', () => {
    const projects: Project[] = [
      {
        name: leafDomainDataAccessProjectName,
        secondLevelDomain: '',
        type: DomainLibraryName.DataAccess,
      },
      {
        name: leafDomainUtilProjectName,
        secondLevelDomain: '',
        type: DomainLibraryName.Util,
      },
    ];
    jest.spyOn(domainUtils, 'getProjects').mockReturnValue(projects);
    removeDomain(application, leafDomain, appTree);
    expect(testingUtils.getExternalSchematic).toHaveBeenNthCalledWith(
      1,
      '@nrwl/workspace',
      'remove',
      {
        projectName: leafDomainDataAccessProjectName,
      }
    );
    expect(testingUtils.getExternalSchematic).toHaveBeenNthCalledWith(
      2,
      '@nrwl/workspace',
      'remove',
      {
        projectName: leafDomainUtilProjectName,
      }
    );
  });
  it('should generate remove rules for all libraries in parent domain and all children domains when parent domain is moving to new parent domain', () => {
    const projects: Project[] = [
      {
        name: childDomainUtilProjectName,
        secondLevelDomain: childDomain,
        type: DomainLibraryName.Util,
      },
      {
        name: parentDomainUtilProjectName,
        secondLevelDomain: 'shared',
        type: DomainLibraryName.Util,
      },
    ];
    jest.spyOn(domainUtils, 'getProjects').mockReturnValue(projects);
    removeDomain(application, `${parentDomain}/shared`, appTree);
    expect(testingUtils.getExternalSchematic).toHaveBeenNthCalledWith(
      1,
      '@nrwl/workspace',
      'remove',
      {
        projectName: childDomainUtilProjectName,
      }
    );
    expect(testingUtils.getExternalSchematic).toHaveBeenNthCalledWith(
      2,
      '@nrwl/workspace',
      'remove',
      {
        projectName: parentDomainUtilProjectName,
      }
    );
  });

  it('should generate remove rules child domain when moving to new child domain', () => {
    const projects: Project[] = [
      {
        name: childDomainUtilProjectName,
        secondLevelDomain: childDomain,
        type: DomainLibraryName.Util,
      },
    ];
    jest.spyOn(domainUtils, 'getProjects').mockReturnValue(projects);
    removeDomain(application, `${parentDomain}/${childDomain}`, appTree);
    expect(testingUtils.getExternalSchematic).toHaveBeenNthCalledWith(
      1,
      '@nrwl/workspace',
      'remove',
      {
        projectName: childDomainUtilProjectName,
      }
    );
  });
});
