import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { addIndexFile } from './lib/add-index-file';
import { addResolutionPath } from './lib/add-resolution-path';
import { PrivateApiGeneratorSchema } from './schema';

// eslint-disable-next-line require-await
export async function privateApiGenerator(
  tree: Tree,
  options: PrivateApiGeneratorSchema
): Promise<void> {
  const { application, domain, library } = options;
  addIndexFile(application, domain, library, tree);
  addResolutionPath(application, domain, library, tree);
}

export default privateApiGenerator;

export const privateApiSchematic = convertNxGenerator(privateApiGenerator);
