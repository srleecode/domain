import { Tree, updateJson } from '@nx/devkit';

export const removeImportPath = (tree: Tree, importPath: string): void => {
  const tsConfigPath = 'tsconfig.base.json';
  if (tree.exists(tsConfigPath)) {
    updateJson(tree, tsConfigPath, (json) => {
      if (!!json.compilerOptions && !!json.compilerOptions.paths) {
        delete json.compilerOptions.paths[importPath];
      }
      return json;
    });
  }
};
