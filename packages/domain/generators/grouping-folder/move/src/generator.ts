import {
  Tree,
  convertNxGenerator,
  logger,
  getProjects,
  ProjectConfiguration,
  getWorkspaceLayout,
} from '@nrwl/devkit';
import { MoveGeneratorSchema } from './schema';
import {
  getNormalisedPath,
  getProjectNames,
} from '@srleecode/domain/shared/utils';
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
      tree,
      projects.get(projectName),
      folder,
      destination
    );
    await nrwlmoveGenerator(tree, {
      projectName,
      destination: movedProjectRoot,
      updateImportPath: true,
    }).catch((e) => {
      logger.error(e.message);
      throw e;
    });
  }
}

const getMovedProjectRoot = (
  tree: Tree,
  project: ProjectConfiguration,
  folder: string,
  destination: string
): string => {
  const normalisedProjectRoot = getNormalisedPath(project.root);
  const workspaceLayout = getWorkspaceLayout(tree);
  return normalisedProjectRoot
    .replace(folder, destination)
    .replace(`${workspaceLayout.libsDir}/`, '');
};

export default moveGenerator;

export const removeSchematic = convertNxGenerator(moveGenerator);
