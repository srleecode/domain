import { LibraryCommonOptions } from './model/library-common-options.model';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  getDasherizedFolderPath,
  getDomainPath,
  getNormalisedPath,
  getWorkspaceLayout,
} from '../../../shared/utils';
import { dasherize } from '@nrwl/workspace/src/utils/strings';
import { AngularCreateLibrarySchema } from './model/angular-create-library-schema.model';
import { Tree } from '@nrwl/devkit';

export const getLibraryCommonOptions = (
  tree: Tree,
  name: string,
  type: string,
  groupingFolder: string,
  createLibrarySchema: AngularCreateLibrarySchema
): LibraryCommonOptions => {
  const { buildable, strict, enableIvy, publishable } = createLibrarySchema;
  const libraryName = name ? `${type}-${dasherize(name)}` : type;
  const domain = `${getDasherizedFolderPath(tree, groupingFolder)}`;
  if (tree.children(`${groupingFolder}/${libraryName}`).length > 1) {
    throw new Error(
      `project already exists in: ${groupingFolder}/${libraryName}`
    );
  }
  const { npmScope } = getWorkspaceLayout(tree);
  const domainPath = getDomainPath(tree, groupingFolder);
  const importPath = `${npmScope}/${domainPath}/${libraryName}`;
  return {
    name: libraryName,
    importPath,
    directory: getNormalisedPath(groupingFolder),
    tags: [
      `app:${domainPath.split('/')?.[0]}`,
      `scope:${domain}`,
      `type:${type}`,
    ].join(','),
    buildable,
    strict,
    enableIvy,
    publishable,
  };
};
