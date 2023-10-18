import {
  logger,
  Tree,
  updateJson,
  readProjectConfiguration,
  removeProjectConfiguration,
  addProjectConfiguration,
} from '@nx/devkit';
import { moveGenerator } from '@nx/workspace';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  getDasherizedFolderPath,
  getDomainPath,
  getNpmScope,
} from '../../../../shared/utils';

export const moveDomainTestProject = async (
  tree: Tree,
  projectName: string,
  destination: string
): Promise<void> => {
  const npmScope = getNpmScope(tree);
  const projectConfig = readProjectConfiguration(tree, projectName);
  const tsConfigPath = `${npmScope}/${getDomainPath(tree, projectConfig.root)}`;
  addDummyTsConfigPath(tree, tsConfigPath);
  await moveGenerator(tree, {
    projectName,
    destination,
    updateImportPath: true,
  }).catch((e: Error) => {
    logger.error(e.message);
    logger.error(e.stack);
    throw e;
  });
  removeDummyTsConfigPath(tree, tsConfigPath);
  renameToCommonFormat(tree, getDasherizedFolderPath(tree, destination));
};

const renameToCommonFormat = (tree: Tree, projectName: string): void => {
  const projectConfig = readProjectConfiguration(tree, projectName);
  const splitProjectName = projectName.split('-');
  const type = splitProjectName[splitProjectName.length - 1];
  const newProjectName = `${type}-${splitProjectName.slice(0, -1).join('-')}`;
  removeProjectConfiguration(tree, projectName);
  projectConfig.name = newProjectName;
  addProjectConfiguration(tree, newProjectName, projectConfig);
};
// a cypress project doesn't have a tsconfig path, but one is required by the move generator
// this creates a dummy tsconfig path that will be removed after the move generator runs
const addDummyTsConfigPath = (tree: Tree, tsConfigPath: string) => {
  updateJson(tree, 'tsconfig.base.json', (json) => {
    if (!json.compilerOptions) {
      json.compilerOptions = {};
      if (!json.compilerOptions.paths) {
        json.compilerOptions.paths = {};
      }
    }
    json.compilerOptions.paths[tsConfigPath] = [];
    return json;
  });
};

const removeDummyTsConfigPath = (tree: Tree, tsConfigPath: string): void => {
  updateJson(tree, 'tsconfig.base.json', (json) => {
    delete json.compilerOptions.paths[tsConfigPath];
    return json;
  });
};
