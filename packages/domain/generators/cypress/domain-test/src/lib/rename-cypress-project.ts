import {
  addProjectConfiguration,
  readProjectConfiguration,
  removeProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { DomainTest } from './model/domain-test.type';

// By default, the project name is set to the directory path, e.g. `test-app-test-domain-e2e`
// This updates the format to `e2e-test-app-test-domain`
export const renameCypressProject = (
  tree: Tree,
  dasherisedFolderPath: string,
  standaloneAsDefault: boolean,
  type: DomainTest
): void => {
  const projectName = `${dasherisedFolderPath}-_${type}`;
  const movedProjectConfig = readProjectConfiguration(tree, projectName);
  removeProjectConfiguration(tree, projectName);
  const newProjectName = `${type}-${dasherisedFolderPath}`;
  addProjectConfiguration(
    tree,
    newProjectName,
    { ...movedProjectConfig, name: newProjectName },
    standaloneAsDefault
  );
};
