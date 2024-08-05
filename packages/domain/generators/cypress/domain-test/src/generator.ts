import {
  Tree,
  addProjectConfiguration,
  convertNxGenerator,
  formatFiles,
  logger,
} from '@nx/devkit';
import { configurationGenerator } from '@nx/cypress';
import { removeUneededCypressProjectFiles } from './lib/remove-uneeded-cypress-project-files';
import { getImplicitDependencies } from './lib/get-implicit-dependencies';
import { SetupDomainTestGeneratorSchema } from './schema';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  getDasherizedFolderPath,
  getProcessedGroupingFolder,
  validateGroupingFolder,
} from '../../../shared/utils';
import { getTags } from './lib/get-domain-test-eslint-tags';
import { convertE2ETargetToCt } from './lib/convert-e2e-target-to-ct';
import { ProjectType } from '@nx/workspace';

export async function setupDomainTestGenerator(
  tree: Tree,
  options: SetupDomainTestGeneratorSchema,
) {
  let { groupingFolder } = options;
  const { type } = options;
  validateGroupingFolder(tree, groupingFolder);
  groupingFolder = getProcessedGroupingFolder(groupingFolder);
  const dasherisedFolderPath = getDasherizedFolderPath(tree, groupingFolder);
  const projectName = `${type}-${dasherisedFolderPath}`;
  const directory = `${groupingFolder}/.${type}`;
  addProjectConfiguration(
    tree,
    projectName,
    {
      name: projectName,
      root: directory,
      projectType: ProjectType.Library,
      implicitDependencies: getImplicitDependencies(
        tree,
        groupingFolder,
        dasherisedFolderPath,
      ),
      targets: {},
      tags: getTags(tree, groupingFolder, type),
    },
    true,
  );

  await configurationGenerator(tree, {
    baseUrl: './',
    project: projectName,
  }).catch((e: Error) => {
    logger.error(e.message);
    logger.error(e.stack);
    throw e;
  });
  if (type === 'ct') {
    convertE2ETargetToCt(tree, projectName);
  }
  removeUneededCypressProjectFiles(tree, directory);
  await formatFiles(tree);
}

export default setupDomainTestGenerator;

export const setupDomainTestSchematic = convertNxGenerator(
  setupDomainTestGenerator,
);
