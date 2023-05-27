import { Tree, updateJson } from '@nx/devkit';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { getDomainPath, getNpmScope } from '../../../../shared/utils';

export const moveLibraryResolutionPath = (
  tree: Tree,
  newLibraryFolder: string
): void => {
  const tsConfigPath = 'tsconfig.base.json';
  if (tree.exists(tsConfigPath)) {
    const npmScope = getNpmScope(tree);
    updateJson(tree, tsConfigPath, (json) => {
      if (!!json.compilerOptions && !!json.compilerOptions?.paths) {
        const projectName = `${npmScope}/${newLibraryFolder}`;
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
