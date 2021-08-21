import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { CreateUtilGeneratorSchema } from './schema';
import { addDomainLibrary } from '@srleecode/domain/front-end/shared';
import { ApplicationType } from '@srleecode/domain/shared/utils';

export async function createUtilGenerator(
  tree: Tree,
  options: CreateUtilGeneratorSchema
): Promise<void> {
  const { groupingFolder } = options;
  await addDomainLibrary(
    tree,
    '',
    'util',
    groupingFolder,
    ApplicationType.Angular,
    options
  );
}

export default createUtilGenerator;

export const createUtilSchematic = convertNxGenerator(createUtilGenerator);
