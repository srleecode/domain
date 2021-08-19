import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { addMockFile } from './lib/add-mock-file';
import { addMockFileResolutionPath } from './lib/add-mock-file-resolution-path';
import { CreateMockFileSchema } from './schema';

export async function createMockFileGenerator(
  tree: Tree,
  options: CreateMockFileSchema
): Promise<void> {
  const { projectName, mockFileName } = options;
  addMockFile(tree, projectName, mockFileName);
  addMockFileResolutionPath(tree, projectName);
}

export default createMockFileGenerator;

export const createMockFileSchematic = convertNxGenerator(
  createMockFileGenerator
);
