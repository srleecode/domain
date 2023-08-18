import { logger, Tree, updateJson } from '@nx/devkit';
import { moveGenerator } from '@nx/workspace';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { getWorkspaceLayout } from '../../../../shared/utils';
import { DomainTest } from './model/domain-test.type';

export const moveProjectToDomain = async (
  tree: Tree,
  projectName: string,
  domainPath: string,
  dasherisedFolderPath: string,
  npmScope: string,
  type: DomainTest
): Promise<void> => {
  const workspaceLayout = getWorkspaceLayout(tree);
  const dummyPaths = [
    `${getImportPath(
      npmScope,
      domainPath.replace(/^\/|\\/, '')
    )}/${type}-${dasherisedFolderPath}`.replace('@@', '@'),
    `${getImportPath(
      npmScope,
      domainPath.slice(workspaceLayout.libsDir.length).replace(/^\/|\\/, '')
    )}/${type}-${dasherisedFolderPath}`.replace('@@', '@'),
  ];
  addDummyTsConfigPaths(tree, dummyPaths);
  await moveGenerator(tree, {
    projectName,
    destination: `${domainPath}/_${type}`,
    updateImportPath: true,
  }).catch((e: Error) => {
    logger.error(e.message);
    logger.error(e.stack);
    throw e;
  });
  removeDummyTsConfigPaths(tree, dummyPaths);
};

const getImportPath = (npmScope: string, projectDirectory: string): string =>
  npmScope
    ? `${npmScope === '@' ? '' : '@'}${npmScope}/${projectDirectory}`
    : projectDirectory;

// a cypress project doesn't have a tsconfig path, but one is required by the move generator
// this creates a dummy tsconfig path that will be removed after the move generator runs
const addDummyTsConfigPaths = (tree: Tree, dummyPaths: string[]) => {
  updateJson(tree, 'tsconfig.base.json', (json) => {
    if (!json.compilerOptions) {
      json.compilerOptions = {};
      if (!json.compilerOptions.paths) {
        json.compilerOptions.paths = {};
      }
    }
    dummyPaths.forEach((path) => {
      json.compilerOptions.paths[path] = [];
    });
    return json;
  });
};

const removeDummyTsConfigPaths = (tree: Tree, dummyPaths: string[]) => {
  updateJson(tree, 'tsconfig.base.json', (json) => {
    dummyPaths.forEach((path) => {
      if (json.compilerOptions.paths[path]) {
        delete json.compilerOptions.paths[path];
      }
    });
    return json;
  });
};
