import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { addSharedLintContraints } from './lib/add-shared-lint-constraints';
import { CreateDomainGroupingFolderGeneratorSchema } from './schema';
import { mkdirSync } from 'fs';

export async function createDomainGroupingFolderGenerator(
  tree: Tree,
  options: CreateDomainGroupingFolderGeneratorSchema
) {
  const { name, groupingFolder } = options;
  addSharedLintContraints(tree, options);
  return () => {
    mkdirSync(`${groupingFolder}/${name}`);
  };
}

export default createDomainGroupingFolderGenerator;

export const createDomainGroupingFolderSchematic = convertNxGenerator(
  createDomainGroupingFolderGenerator
);
