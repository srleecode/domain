import { Tree, convertNxGenerator, formatFiles } from '@nrwl/devkit';
import { addSharedLintContraints } from './lib/add-shared-lint-constraints';
import { CreateDomainGroupingFolderGeneratorSchema } from './schema';
import { mkdirSync } from 'fs';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  getNormalisedPath,
  validateGroupingFolder,
} from '../../../shared/utils';

export async function createDomainGroupingFolderGenerator(
  tree: Tree,
  options: CreateDomainGroupingFolderGeneratorSchema
) {
  const { name, groupingFolder } = options;
  validateGroupingFolder(tree, groupingFolder);
  const splitGroupingFolder = getNormalisedPath(groupingFolder).split('/');
  const isSharedAppDomain =
    splitGroupingFolder.length === 2 &&
    splitGroupingFolder[1].endsWith('shared');
  if (!isSharedAppDomain) {
    addSharedLintContraints(tree, options, splitGroupingFolder[0]);
  }
  await formatFiles(tree);
  return () => {
    mkdirSync(`${groupingFolder}/${name}`);
  };
}

export default createDomainGroupingFolderGenerator;

export const createDomainGroupingFolderSchematic = convertNxGenerator(
  createDomainGroupingFolderGenerator
);
