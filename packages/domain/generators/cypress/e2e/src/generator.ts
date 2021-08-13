import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { cypressProjectGenerator } from '@nrwl/cypress';
import { getDasherizedFolderPath } from '@srleecode/domain/shared/utils';
import { CreateE2EGeneratorSchema } from './schema';

export async function cypressE2EGenerator(
  tree: Tree,
  options: CreateE2EGeneratorSchema
) {
  const dasherisedFolderPath = getDasherizedFolderPath(
    tree,
    options.baseFolder
  );
  return cypressProjectGenerator(tree, { name: `e2e-${dasherisedFolderPath}` });
}

export default cypressProjectGenerator;

export const reactAddSchematic = convertNxGenerator(cypressProjectGenerator);
