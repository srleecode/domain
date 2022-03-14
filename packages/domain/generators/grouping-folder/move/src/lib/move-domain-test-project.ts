import {
  logger,
  Tree,
  updateJson,
  readProjectConfiguration,
  removeProjectConfiguration,
  addProjectConfiguration,
} from '@nrwl/devkit';
import { moveGenerator } from '@nrwl/workspace';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  getDasherizedFolderPath,
  getDomainPath,
  getWorkspaceLayout,
} from '../../../../shared/utils';

export const moveDomainTestProject = async (
  tree: Tree,
  projectName: string,
  destination: string
): Promise<void> => {
  const { npmScope } = getWorkspaceLayout(tree);
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
  removeProjectConfiguration(tree, projectName);
  addProjectConfiguration(tree, projectName.replace(`.`, ''), projectConfig);
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
