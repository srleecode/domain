import { logger, Tree } from '@nrwl/devkit';
import { Schema } from '@nrwl/angular/src/generators/library/schema';
import { getLibraryCommonOptions } from './get-library-common-options';
import { libraryGenerator } from '@nrwl/angular/src/generators/library/library';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  ApplicationType,
  getDasherizedFolderPath,
} from '../../../shared/utils';
import { isProjectExisting } from './is-project-existing';
import { addImplicitDependency } from './add-implicit-dependency';

export const addDomainLibrary = async (
  tree: Tree,
  name: string,
  type: string,
  groupingFolder: string,
  applicationType: ApplicationType,
  schema?: Partial<Schema>
): Promise<void> => {
  const libraryCommonOptions = getLibraryCommonOptions(
    tree,
    name,
    type,
    groupingFolder,
    schema
  );
  if (applicationType === ApplicationType.Angular) {
    await libraryGenerator(tree, {
      ...(schema || {}),
      ...libraryCommonOptions,
    }).catch((e) => {
      logger.error(e.message);
      throw e;
    });
  }
  const dasherisedGroupingFolder = getDasherizedFolderPath(
    tree,
    groupingFolder
  );
  const e2eProjectName = `e2e-${dasherisedGroupingFolder}`;
  if (isProjectExisting(tree, e2eProjectName)) {
    addImplicitDependency(
      tree,
      e2eProjectName,
      `${dasherisedGroupingFolder}-${libraryCommonOptions.name}`
    );
  }
};
