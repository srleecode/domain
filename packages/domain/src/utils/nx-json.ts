import { readJsonInTree, NxJson } from '@nrwl/workspace';
import { Tree } from '@angular-devkit/schematics';

export const getNxJson = (tree: Tree): NxJson =>
  readJsonInTree<NxJson>(tree, 'nx.json');

export const getNpmScope = (tree: Tree): string => getNxJson(tree).npmScope;
