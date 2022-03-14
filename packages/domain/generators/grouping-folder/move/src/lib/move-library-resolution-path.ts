import { Tree, updateJson } from '@nrwl/devkit';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  getDasherizedFolderPath,
  getDomainPath,
  getWorkspaceLayout,
} from '../../../../shared/utils';

export const moveLibraryResolutionPath = (
  tree: Tree,
  newLibraryFolder: string
): void => {
  const tsConfigPath = 'tsconfig.base.json';
  if (tree.exists(tsConfigPath)) {
    const { npmScope } = getWorkspaceLayout(tree);
    updateJson(tree, tsConfigPath, (json) => {
      if (!!json.compilerOptions && !!json.compilerOptions?.paths) {
        const projectName = `${npmScope}/${getDasherizedFolderPath(
          tree,
          newLibraryFolder
        )}`;
        const projectReference = json.compilerOptions.paths[projectName];
        delete json.compilerOptions.paths[projectName];
        const newProjectName = `${npmScope}/${getDomainPath(
          tree,
          newLibraryFolder
        )}`;
        json.compilerOptions.paths[newProjectName] = projectReference;
      }
      return json;
    });
  }
};
