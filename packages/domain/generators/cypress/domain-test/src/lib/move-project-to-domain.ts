import { logger, Tree, updateJson } from '@nrwl/devkit';
import { moveGenerator } from '@nrwl/workspace';
import { DomainTest } from './model/domain-test.type';

export const moveProjectToDomain = async (
  tree: Tree,
  projectName: string,
  domainPath: string,
  dasherisedFolderPath: string,
  npmScope: string,
  type: DomainTest
): Promise<void> => {
  addDummyTsConfigPath(tree, domainPath, dasherisedFolderPath, npmScope, type);
  await moveGenerator(tree, {
    projectName,
    destination: `${domainPath}/.${type}`,
    updateImportPath: true,
  }).catch((e: Error) => {
    logger.error(e.message);
    logger.error(e.stack);
    throw e;
  });
  removeDummyTsConfigPath(tree, dasherisedFolderPath, npmScope, type);
};

// a cypress project doesn't have a tsconfig path, but one is required by the move generator
// this creates a dummy tsconfig path that will be removed after the move generator runs
const addDummyTsConfigPath = (
  tree: Tree,
  domainPath: string,
  dasherisedFolderPath: string,
  npmScope: string,
  type: DomainTest
) => {
  updateJson(tree, 'tsconfig.base.json', (json) => {
    if (!json.compilerOptions) {
      json.compilerOptions = {};
      if (!json.compilerOptions.paths) {
        json.compilerOptions.paths = {};
      }
    }
    json.compilerOptions.paths[
      `${npmScope}/${domainPath}/${type}-${dasherisedFolderPath}`
    ] = [];
    return json;
  });
};

const removeDummyTsConfigPath = (
  tree: Tree,
  dasherisedFolderPath: string,
  npmScope: string,
  type: DomainTest
): void => {
  updateJson(tree, 'tsconfig.base.json', (json) => {
    delete json.compilerOptions.paths[
      `${npmScope}/${dasherisedFolderPath}-.${type}`
    ];
    return json;
  });
};
