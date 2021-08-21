import { Tree, convertNxGenerator, logger } from '@nrwl/devkit';
import { CreateDirectiveGeneratorSchema } from './schema';
import {
  ApplicationType,
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
import { addDomainLibrary } from '@srleecode/domain/front-end/shared';

export async function createDirectiveGenerator(
  tree: Tree,
  options: CreateDirectiveGeneratorSchema
): Promise<void> {
  const { name, groupingFolder, prefix, mountType } = options;
  await addDomainLibrary(
    tree,
    name,
    'directive',
    groupingFolder,
    ApplicationType.Angular,
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
