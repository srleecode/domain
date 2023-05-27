import { logger, Tree } from '@nx/devkit';
import { Schema } from '@nx/angular/src/generators/library/schema';
import { getLibraryCommonOptions } from './get-library-common-options';
import { libraryGenerator } from '@nx/angular/generators';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  ApplicationType,
  getDasherizedFolderPath,
} from '../../../shared/utils';
import { isProjectExisting } from './is-project-existing';
import { addImplicitDependency } from './add-implicit-dependency';
import { removeLintOverrideRules } from './remove-lint-override-rules';
import { getLibraryName } from './get-library-name';
import { addJestJunitReporterConfig } from './add-jest-junit-reporter-config';
import { removeGlobalJestConfig } from './remove-global-jest-config';

export const addDomainLibrary = async (
  tree: Tree,
  name: string,
  type: string,
  groupingFolderPath: string,
  appGroupingFolder: string,
  applicationType: ApplicationType,
  removeLintOverrides: boolean,
  schema?: Partial<Schema> & { addJestJunitReporter?: boolean }
): Promise<void> => {
  const libraryCommonOptions = getLibraryCommonOptions(
    tree,
    name,
    type,
    groupingFolderPath,
    schema
  );
  if (applicationType === ApplicationType.Angular) {
    await libraryGenerator(tree, {
      ...(schema || {}),
      ...libraryCommonOptions,
      prefix: schema.prefix || appGroupingFolder,
    }).catch((e: Error) => {
      logger.error(e.message);
      logger.error(e.stack);
      throw e;
    });
  }
  const dasherisedGroupingFolder = getDasherizedFolderPath(
    tree,
    groupingFolderPath
  );
  const e2eProjectName = `e2e-${dasherisedGroupingFolder}`;
  const projectName = `${dasherisedGroupingFolder}-${libraryCommonOptions.name}`;
  if (isProjectExisting(tree, e2eProjectName)) {
    addImplicitDependency(tree, e2eProjectName, projectName);
  }
  if (removeLintOverrides) {
    removeLintOverrideRules(tree, projectName);
  }
  const libraryName = getLibraryName({
    name,
    type,
  });
  const libraryPath = `${groupingFolderPath}/${libraryName}`;
  if (schema.addJestJunitReporter) {
    addJestJunitReporterConfig(tree, libraryPath);
  }
  removeGlobalJestConfig(tree, libraryPath);
};
