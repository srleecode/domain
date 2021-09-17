import { readJson, Tree, writeJson } from '@nrwl/devkit';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  getDasherizedFolderPath,
  getLintFilePath,
} from '../../../../shared/utils';

export const moveEslintReference = (
  tree: Tree,
  oldGroupingFolder: string,
  newGroupingFolder: string
): void => {
  const oldScope = `scope:${getDasherizedFolderPath(tree, oldGroupingFolder)}`;
  const newScope = `scope:${getDasherizedFolderPath(tree, newGroupingFolder)}`;
  const filePath = getLintFilePath(tree);
  const json = readJson(tree, filePath);
  if (json) {
    let jsonString = JSON.stringify(json);
    const regExp = new RegExp(oldScope, 'g');
    jsonString = jsonString.replace(regExp, newScope);
    writeJson(tree, filePath, JSON.parse(jsonString));
  }
};
