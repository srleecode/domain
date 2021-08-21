import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { addSharedLintContraints } from './lib/add-shared-lint-constraints';
import { createDomainGroupingFolder } from './lib/create-domain-grouping-folder';
import { CreateDomainGroupingFolderGeneratorSchema } from './schema';

export async function createDomainGroupingFolderGenerator(
  tree: Tree,
  options: CreateDomainGroupingFolderGeneratorSchema
): Promise<void> {
  const { name, baseFolder } = options;
  addSharedLintContraints(tree, options);
  createDomainGroupingFolder(tree, `${baseFolder}/${name}`);
}

export default createDomainGroupingFolderGenerator;

export const createDomainGroupingFolderSchematic = convertNxGenerator(
  createDomainGroupingFolderGenerator
);
