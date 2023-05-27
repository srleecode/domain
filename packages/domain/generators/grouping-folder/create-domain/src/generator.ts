import { Tree, convertNxGenerator } from '@nx/devkit';
import { addSharedLintContraints } from './lib/add-shared-lint-constraints';
import { CreateDomainGroupingFolderGeneratorSchema } from './schema';
import { mkdirSync } from 'fs';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { getNormalisedPath } from '../../../shared/utils';

export async function createDomainGroupingFolderGenerator(
  tree: Tree,
  options: CreateDomainGroupingFolderGeneratorSchema
) {
  const { name, groupingFolder } = options;
  const splitGroupingFolder = getNormalisedPath(groupingFolder).split('/');
  const isSharedAppDomain =
    splitGroupingFolder.length === 2 &&
    splitGroupingFolder[1].endsWith('shared');
  if (!isSharedAppDomain) {
    addSharedLintContraints(tree, options);
  }
  return () => {
    mkdirSync(`${groupingFolder}/${name}`);
  };
}

export default createDomainGroupingFolderGenerator;

export const createDomainGroupingFolderSchematic = convertNxGenerator(
  createDomainGroupingFolderGenerator
);
