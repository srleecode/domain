import { DomainLibraryName } from '../model/domain-library-name.enum';
import { Tree } from '@nrwl/devkit';
import { CypressProject } from '../model/cypress-project.enum';
import {
  getCypressProjectName,
  getDependenciesWithLibrariesRemoved,
} from '../utils/cypress-project';
import {
  readProjectConfiguration,
  updateProjectConfiguration,
} from '../utils/project-configuration';

export const removeCypressProjectImplicitDependencies = (
  tree: Tree,
  application: string,
  domain: string,
  libraryTypes: DomainLibraryName[],
  projectType: CypressProject
): void => {
  const projectName = getCypressProjectName(application, domain, projectType);
  const projectConfig = readProjectConfiguration(tree, projectName);
  projectConfig.implicitDependencies = getDependenciesWithLibrariesRemoved(
    tree,
    application,
    domain,
    libraryTypes,
    projectType
  );
  updateProjectConfiguration(tree, projectName, projectConfig);
};
