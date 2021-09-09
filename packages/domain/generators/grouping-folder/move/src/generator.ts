import {
  Tree,
  convertNxGenerator,
  logger,
  getProjects,
  ProjectConfiguration,
  getWorkspaceLayout,
} from '@nrwl/devkit';
import { MoveGeneratorSchema } from './schema';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { getNormalisedPath, getProjectNames } from '../../../shared/utils';
import { moveGenerator as nrwlMoveGenerator } from '@nrwl/workspace';
import { moveDomainTestProject } from './lib/move-domain-test-project';

export async function moveGenerator(
  tree: Tree,
  options: MoveGeneratorSchema
): Promise<void> {
  const { groupingFolder, destination } = options;
  const projectNames = getProjectNames(tree, groupingFolder);
  const projects = getProjects(tree);
  for (const projectName of projectNames) {
    const movedProjectRoot = getMovedProjectRoot(
      tree,
      projects.get(projectName),
      groupingFolder,
      destination
    );
    if (projectName.startsWith('e2e')) {
      await moveDomainTestProject(tree, projectName, movedProjectRoot).catch(
        (e) => {
          logger.error(e.message);
          throw e;
        }
      );
    } else {
      await nrwlMoveGenerator(tree, {
        projectName,
        destination: movedProjectRoot,
        updateImportPath: true,
      }).catch((e) => {
        logger.error(e.message);
        throw e;
      });
    }
  }
  tree.delete(groupingFolder);
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

export const moveSchematic = convertNxGenerator(moveGenerator);
