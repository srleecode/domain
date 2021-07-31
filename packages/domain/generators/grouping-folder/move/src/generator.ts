import {
  Tree,
  convertNxGenerator,
  logger,
  getProjects,
  ProjectConfiguration,
} from '@nrwl/devkit';
import { MoveGeneratorSchema } from './schema';
import { getNormalisedPath, getProjectNames } from '@srleecode/domain/shared';
import { moveGenerator as nrwlmoveGenerator } from '@nrwl/workspace';

export async function moveGenerator(
  tree: Tree,
  options: MoveGeneratorSchema
): Promise<void> {
  const { folder, destination } = options;
  const projectNames = getProjectNames(tree, folder);
  const projects = getProjects(tree);
  for (const projectName of projectNames) {
    const movedProjectRoot = getMovedProjectRoot(
      projects.get(projectName),
      folder,
      destination
    );
    await nrwlmoveGenerator(tree, {
      projectName,
      destination: movedProjectRoot,
      updateImportPath: false,
    }).catch((e) => {
      logger.error(e.message);
      throw e;
    });
  }
}

const getMovedProjectRoot = (
  project: ProjectConfiguration,
  folder: string,
  destination: string
): string => {
  const normalisedProjectRoot = getNormalisedPath(project.root);
  return normalisedProjectRoot
    .replace(folder, destination)
    .replace('libs/', '');
};

export default moveGenerator;

export const removeSchematic = convertNxGenerator(moveGenerator);
