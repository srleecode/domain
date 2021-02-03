import { Tree } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import * as testingUtils from '../../../utils/testing';
import * as domainUtils from '../../../utils/domain';
import { Project } from '../../shared/model/project.model';
import { removeDomain } from './remove-domain';
import * as workspaceImport from '@nrwl/workspace/src/generators/remove/remove';

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
      .spyOn(workspaceImport, 'removeSchematic')
      .mockReturnValue(testingUtils.emptyRule as any);
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
    expect(workspaceImport.removeSchematic).toHaveBeenNthCalledWith(1, {
      projectName: leafDomainDataAccessProjectName,
      skipFormat: false,
      forceRemove: false,
    });
    expect(workspaceImport.removeSchematic).toHaveBeenNthCalledWith(2, {
      projectName: leafDomainUtilProjectName,
      skipFormat: false,
      forceRemove: false,
    });
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
    expect(workspaceImport.removeSchematic).toHaveBeenNthCalledWith(1, {
      projectName: childDomainUtilProjectName,
      skipFormat: false,
      forceRemove: false,
    });
    expect(workspaceImport.removeSchematic).toHaveBeenNthCalledWith(2, {
      projectName: parentDomainUtilProjectName,
      skipFormat: false,
      forceRemove: false,
    });
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
    expect(workspaceImport.removeSchematic).toHaveBeenNthCalledWith(1, {
      projectName: childDomainUtilProjectName,
      skipFormat: false,
      forceRemove: false,
    });
  });
});
