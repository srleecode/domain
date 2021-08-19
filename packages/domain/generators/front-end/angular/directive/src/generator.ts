import { Tree, convertNxGenerator, logger } from '@nrwl/devkit';
import { CreateDirectiveGeneratorSchema } from './schema';
import { libraryGenerator } from '@nrwl/angular/src/generators/library/library';
import { getLibraryCommonOptions } from '@srleecode/domain/angular/shared';
import {
  ElementType,
  getDasherizedFolderPath,
} from '@srleecode/domain/shared/utils';
import {
  camelize,
  classify,
  dasherize,
} from '@nrwl/workspace/src/utils/strings';
import { addDirectiveFiles } from './lib/add-directive-files/add-directive-files';
import { setupComponentTestGenerator } from '@srleecode/domain/cypress/component-test/angular';

export async function createDirectiveGenerator(
  tree: Tree,
  options: CreateDirectiveGeneratorSchema
): Promise<void> {
  const { name, groupingFolder, prefix, mountType } = options;
  const libraryCommonOptions = getLibraryCommonOptions(
    tree,
    name,
    'directive',
    groupingFolder,
    options
  );
  const dasherisedGroupingFolder = `${getDasherizedFolderPath(
    tree,
    groupingFolder
  )}`;
  const libraryName = `directive-${dasherize(name)}`;
  const projectName = `${dasherisedGroupingFolder}-${dasherize(libraryName)}`;
  const selector = prefix
    ? `${prefix}${classify(projectName)}`
    : `${camelize(projectName)}`;
  await libraryGenerator(tree, {
    prefix,
    ...libraryCommonOptions,
  }).catch((e) => {
    logger.error(e.message);
    throw e;
  });
  addDirectiveFiles(
    tree,
    options,
    dasherisedGroupingFolder,
    libraryName,
    selector
  );
  await setupComponentTestGenerator(tree, {
    projectName,
    name,
    mountType,
    selector,
    type: ElementType.Component,
  }).catch((e) => {
    logger.error(e.message);
    throw e;
  });
}

export default createDirectiveGenerator;

export const createDirectiveSchematic = convertNxGenerator(
  createDirectiveGenerator
);
