import { Tree } from '@nrwl/devkit';
import { CypressProject } from '../model/cypress-project.enum';
import { getCypressProjectName } from '../utils/cypress-project';
import { readProjectConfiguration } from '../utils/project-configuration';

export const checkCypressProjectExists = (
  tree: Tree,
  application: string,
  domain: string,
  projectType: CypressProject
): void => {
  const projectName = getCypressProjectName(application, domain, projectType);
  try {
    readProjectConfiguration(tree, projectName);
  } catch (e) {
    throw new Error(`Project does not exist ${projectName}`);
  }
};
