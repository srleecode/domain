import { logger, Tree, updateJson } from '@nrwl/devkit';
import { moveGenerator } from '@nrwl/workspace';

export const moveProjectToDomain = async (
  tree: Tree,
  projectName: string,
  domainPath: string,
  dasherisedFolderPath: string,
  npmScope: string
): Promise<void> => {
  addDummyTsConfigPath(tree, domainPath, dasherisedFolderPath, npmScope);
  await moveGenerator(tree, {
    projectName: projectName,
    destination: `${domainPath}/.e2e`,
    updateImportPath: true,
  }).catch((e: Error) => {
    logger.error(e.message);
    logger.error(e.stack);
    throw e;
  });
  removeDummyTsConfigPath(tree, dasherisedFolderPath, npmScope);
};

// a cypress project doesn't have a tsconfig path, but one is required by the move generator
// this creates a dummy tsconfig path that will be removed after the move generator runs
const addDummyTsConfigPath = (
  tree: Tree,
  domainPath: string,
  dasherisedFolderPath: string,
  npmScope: string
) => {
  updateJson(tree, 'tsconfig.base.json', (json) => {
    if (!json.compilerOptions) {
      json.compilerOptions = {};
      if (!json.compilerOptions.paths) {
        json.compilerOptions.paths = {};
      }
    }
    json.compilerOptions.paths[
      `@${npmScope}/${domainPath}/e2e-${dasherisedFolderPath}`
    ] = [];
    return json;
  });
};

const removeDummyTsConfigPath = (
  tree: Tree,
  dasherisedFolderPath: string,
  npmScope: string
): void => {
  updateJson(tree, 'tsconfig.base.json', (json) => {
    delete json.compilerOptions.paths[
      `@${npmScope}/${dasherisedFolderPath}-.e2e`
    ];
    return json;
  });
};
