import { getWorkspaceLayout, Tree } from '@nrwl/devkit';
import { CreateLibrarySchema } from './model/create-library-schema.model';
import { LibraryCommonOptions } from './model/library-common-options.model';
import { getDasherizedGroupingFolder } from '@srleecode/domain/shared/utils';
import { dasherize } from '@nrwl/workspace/src/utils/strings';

export const getLibraryCommonOptions = (
  tree: Tree,
  name: string,
  type: string,
  groupingFolder: string,
  createLibrarySchema: CreateLibrarySchema
): LibraryCommonOptions => {
  const { buildable, strict, enableIvy, publishable } = createLibrarySchema;
  const libraryName = name ? `${type}-${dasherize(name)}` : type;
  const domain = `${getDasherizedGroupingFolder(tree, groupingFolder)}`;
  if (tree.children(`${groupingFolder}/${libraryName}`).length > 1) {
    throw new Error(
      `project already exists in: ${groupingFolder}/${libraryName}`
    );
  }
  const workspaceLayout = getWorkspaceLayout(tree);
  const { libsDir, npmScope, standaloneAsDefault } = workspaceLayout;
  const domainImportPath = groupingFolder.replace(`${libsDir}/`, '');
  const importPath = `@${npmScope}/${domainImportPath}/${libraryName}`;
  return {
    name: libraryName,
    importPath,
    directory: domainImportPath,
    standaloneConfig: standaloneAsDefault,
    tags: [
      `app:${domainImportPath.split('/')?.[0]}`,
      `scope:${domain}`,
      `type:${type}`,
    ].join(','),
    buildable,
    strict,
    enableIvy,
    publishable,
  };
};