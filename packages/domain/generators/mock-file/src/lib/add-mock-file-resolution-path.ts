import {
  getWorkspaceLayout,
  readProjectConfiguration,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { getDomainPath } from '@srleecode/domain/shared/utils';

export const addMockFileResolutionPath = (
  tree: Tree,
  projectName: string
): void => {
  const projectConfig = readProjectConfiguration(tree, projectName);
  const domainPath = getDomainPath(tree, projectConfig.root);
  updateJson(tree, 'tsconfig.base.json', (json) => {
    const workspaceLayout = getWorkspaceLayout(tree);
    if (!json.compilerOptions) {
      json.compilerOptions = {};
      if (!json.compilerOptions.paths) {
        json.compilerOptions.paths = {};
      }
    }
    json.compilerOptions.paths[
      `@${workspaceLayout.npmScope}/${domainPath}/testing`
    ] = [`${projectConfig.sourceRoot}/testing.ts`];
    return json;
  });
};
