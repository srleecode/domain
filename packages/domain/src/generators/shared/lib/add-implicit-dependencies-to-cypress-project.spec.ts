import {
  Tree,
  addProjectConfiguration,
  readProjectConfiguration,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { addImplicitDependenciesToCypressProject } from './add-implicit-dependencies-to-cypress-project';
import { CypressProject } from '../model/cypress-project.enum';
import { getParsedDomain } from '../utils/domain';

describe('addImplicitDependenciesToCypressProject', () => {
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
  const projectName = `${CypressProject.E2E}-${application}-${getParsedDomain(
    domain
  )}`;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
    addProjectConfiguration(appTree, projectName, {
      targets: {},
      root: 'test',
      tags: [],
    });
  });

  it('should add domain libraries as implicit dependencies', () => {
    addImplicitDependenciesToCypressProject(
      appTree,
      application,
      domain,
      libraryTypes,
      CypressProject.E2E
    );
    const projectConfig = readProjectConfiguration(appTree, projectName);
    expect(projectConfig.implicitDependencies).toEqual([
      `scope:${application}-${getParsedDomain(domain)}-${
        DomainLibraryName.DataAccess
      }`,
      `scope:${application}-${getParsedDomain(domain)}-${
        DomainLibraryName.Feature
      }`,
      `scope:${application}-${getParsedDomain(domain)}-${
        DomainLibraryName.Shell
      }`,
      `scope:${application}-${getParsedDomain(domain)}-${DomainLibraryName.Ui}`,
      `scope:${application}-${getParsedDomain(domain)}-${
        DomainLibraryName.Util
      }`,
    ]);
  });
});
