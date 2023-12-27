import { Tree } from '@nx/devkit';
import { getNpmScope as nxGetNpmScope } from '@nx/js/src/utils/package-json/get-npm-scope';

export const getNpmScope = (tree: Tree): string => {
  const npmScope = nxGetNpmScope(tree);
  return (npmScope || '').startsWith('@') ? npmScope : `@${npmScope}`;
};
