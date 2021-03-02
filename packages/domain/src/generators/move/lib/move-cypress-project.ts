import { CypressProject } from '../../shared/model/cypress-project.enum';
import { getCypressProjectName } from '../../shared/utils/cypress-project';
import { Tree } from '@nrwl/devkit';
import {
  addProjectConfiguration,
  readProjectConfiguration,
  removeProjectConfiguration,
} from '../../shared/utils/project-configuration';

export const moveCypressProject = (
  tree: Tree,
  application: string,
  domain: string,
  newDomain: string,
  projectType: CypressProject
): void => {
  const projectName = getCypressProjectName(application, domain, projectType);
  const newProjectName = getCypressProjectName(
    application,
    newDomain,
    projectType
  );
  const projectConfiguration = readProjectConfiguration(tree, projectName);
  const domainReplacedConfigString = JSON.stringify(
    projectConfiguration
  ).replace(domain, newDomain);
  addProjectConfiguration(
    tree,
    newProjectName,
    JSON.parse(domainReplacedConfigString)
  );
  removeProjectConfiguration(tree, projectName);
};
