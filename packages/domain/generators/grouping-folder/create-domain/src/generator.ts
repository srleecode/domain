import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { addSharedDomainEslintRule } from './lib/add-shared-domain-eslint-rule';
import { CreateDomainGroupingFolderGeneratorSchema } from './schema';

export async function createDomainGroupingFolderGenerator(
  tree: Tree,
  options: CreateDomainGroupingFolderGeneratorSchema
): Promise<void> {
  const { name, baseFolder } = options;
  if (name === 'shared') {
    addSharedDomainEslintRule(tree, baseFolder);
  }
  tree.write(`${baseFolder}/${name}`, '');
}

export default createDomainGroupingFolderGenerator;

export const createDomainGroupingFolderSchematic = convertNxGenerator(
  createDomainGroupingFolderGenerator
);
