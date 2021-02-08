import { Tree, readJson } from '@nrwl/devkit';
import { NxJson } from '@nrwl/workspace';

export const getNxJson = (tree: Tree): NxJson =>
  readJson<NxJson>(tree, 'nx.json');

export const getNpmScope = (tree: Tree): string => getNxJson(tree).npmScope;
