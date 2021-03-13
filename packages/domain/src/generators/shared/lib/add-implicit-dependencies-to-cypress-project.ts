import { DomainLibraryName } from '../model/domain-library-name.enum';
import { CypressProject } from '../model/cypress-project.enum';
import {
  Tree,
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { getParsedDomain } from '../utils/domain';
import { getCypressProjectName } from '../utils/cypress-project';

export const addImplicitDependenciesToCypressProject = (
  tree: Tree,
  application: string,
  domain: string,
  libraryTypes: DomainLibraryName[],
  projectType: CypressProject
): void => {
  const projectName = getCypressProjectName(application, domain, projectType);
  const projectConfig = readProjectConfiguration(tree, projectName);
  const newDependencies = libraryTypes.map(
    (type) => `scope:${application}-${getParsedDomain(domain)}-${type}`
  );
  const existingDependencies = (
    projectConfig.implicitDependencies || []
  ).filter((dependency) => !!dependency);
  projectConfig.implicitDependencies = [
    ...existingDependencies,
    ...newDependencies,
  ];
  updateProjectConfiguration(tree, projectName, projectConfig);
};
