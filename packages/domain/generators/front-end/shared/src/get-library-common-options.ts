import { LibraryCommonOptions } from './model/library-common-options.model';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  getDasherizedFolderPath,
  getDomainPath,
  getNormalisedPath,
  getNpmScope,
} from '../../../shared/utils';
import { dasherize } from '@nx/workspace/src/utils/strings';
import { AngularCreateLibrarySchema } from './model/angular-create-library-schema.model';
import { Tree } from '@nx/devkit';

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
  const npmScope = getNpmScope(tree);
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
