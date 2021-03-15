import {
  Tree,
  addProjectConfiguration,
  readProjectConfiguration,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { removeCypressProjectImplicitDependencies } from './remove-cypress-project-implicit-dependencies';
import { CypressProject } from '../model/cypress-project.enum';
import { getCypressProjectName } from '../utils/cypress-project';
import { getParsedDomain } from '../utils/domain';

describe('removeCypressProjectImplicitDependencies', () => {
  let appTree: Tree;
  const application = 'test-application';
  const domain = 'leaf-domain';
  const libraryTypes = [
    DomainLibraryName.DataAccess,
    DomainLibraryName.Feature,
    DomainLibraryName.Shell,
    DomainLibraryName.Ui,
    DomainLibraryName.Util,
  ];
  const projectName = getCypressProjectName(
    application,
    domain,
    CypressProject.E2E
  );

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(appTree, projectName, {
      tags: [],
      root: '',
      targets: {},
      implicitDependencies: [
        `${application}-${getParsedDomain(domain)}-${
          DomainLibraryName.DataAccess
        }`,
        `${application}-${getParsedDomain(domain)}-${
          DomainLibraryName.Feature
        }`,
        `${application}-${getParsedDomain(domain)}-${DomainLibraryName.Shell}`,
        `${application}-${getParsedDomain(domain)}-${DomainLibraryName.Ui}`,
        `${application}-${getParsedDomain(domain)}-${DomainLibraryName.Util}`,
      ],
    });
  });

  it('should remove given domain libraries as implicit dependencies', () => {
    removeCypressProjectImplicitDependencies(
      appTree,
      application,
      domain,
      libraryTypes,
      CypressProject.E2E
    );
    const projectConfig = readProjectConfiguration(appTree, projectName);
    expect(projectConfig.implicitDependencies).toEqual([]);
  });
});
