import { Tree, convertNxGenerator, logger } from '@nrwl/devkit';
import { removeLibrariesGenerator } from '../remove-libraries/generator';
import { RemoveLibrariesGeneratorSchema } from '../remove-libraries/schema';
import { getProjects } from '../shared/utils/domain';
import { RemoveGeneratorSchema } from './schema';

// eslint-disable-next-line require-await
export async function removeGenerator(
  tree: Tree,
  options: RemoveGeneratorSchema
): Promise<void> {
  const { application, domain } = options;
  const projects = getProjects(application, domain, tree);
  const libraries = projects.map((project) => project.type);
  const schema: RemoveLibrariesGeneratorSchema = {
    application,
    domain,
    libraries,
  };
  await removeLibrariesGenerator(tree, schema).catch((e) => {
    logger.error(e.message);
    throw e;
  });
}

export default removeGenerator;

export const removeSchematic = convertNxGenerator(removeGenerator);
