import {
  Tree,
  convertNxGenerator,
  formatFiles,
  logger,
  readProjectConfiguration,
} from '@nx/devkit';
import { RemoveGeneratorSchema } from './schema';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  getDasherizedFolderPath,
  getDomainPath,
  getNpmScope,
  getProcessedGroupingFolder,
  getProjectNames,
  isHavingDepContraint,
  isHavingMockFile,
  removeDepConstraint,
  validateGroupingFolder,
} from '../../../shared/utils';
import { removeGenerator as nrwlRemoveGenerator } from '@nx/workspace';
import { removeMockFileResolutionPath } from './lib/remove-mock-file-resolution-path';
import { removeImportPath } from './lib/remove-import-path';

export async function removeGenerator(
  tree: Tree,
  options: RemoveGeneratorSchema,
): Promise<void> {
  let { groupingFolder } = options;
  groupingFolder = getProcessedGroupingFolder(groupingFolder);
  validateGroupingFolder(tree, groupingFolder);
  const projectNames = getProjectNames(tree, groupingFolder);
  for (const projectName of projectNames) {
    const project = readProjectConfiguration(tree, projectName);
    if (isHavingMockFile(tree, project.root)) {
      removeMockFileResolutionPath(tree, project.root);
    }
    const npmScope = getNpmScope(tree);
    const importPath = `${npmScope}/${getDomainPath(tree, project.root)}`;
    removeImportPath(tree, importPath);
    await nrwlRemoveGenerator(tree, {
      projectName,
      skipFormat: false,
      forceRemove: true,
      importPath,
    }).catch((e: Error) => {
      logger.error(e.message);
      logger.error(e.stack);
      throw e;
    });
    const folder = project.root.split('/').slice(0, -1).join('/');
    const sourceTag = `scope:${getDasherizedFolderPath(tree, folder)}`;
    if (isHavingDepContraint(tree, sourceTag)) {
      removeDepConstraint(tree, sourceTag);
    }
  }
  tree.delete(groupingFolder);
  await formatFiles(tree);
}

export default removeGenerator;

export const removeSchematic = convertNxGenerator(removeGenerator);
