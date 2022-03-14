import {
  addProjectConfiguration,
  readProjectConfiguration,
  removeProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { DomainTest } from './model/domain-test.type';

// By default, the project name is set to the directory path, e.g. `test-app-test-domain-.e2e`
// This updates the format to `e2e-test-app-test-domain`
export const renameCypressProject = (
  tree: Tree,
  dasherisedFolderPath: string,
  standaloneAsDefault: boolean,
  type: DomainTest
): void => {
  const projectName = `${dasherisedFolderPath}-.${type}`;
  const movedProjectConfig = readProjectConfiguration(tree, projectName);
  removeProjectConfiguration(tree, projectName);
  addProjectConfiguration(
    tree,
    `${type}-${dasherisedFolderPath}`,
    movedProjectConfig,
    standaloneAsDefault
  );
};
