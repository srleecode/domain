import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { CreateAppGroupingFolderGeneratorSchema } from './schema';
import { FrontendFramework } from './lib/model/framework.enum';
import { isFeAppFolderExisting } from './lib/fe-app/is-fe-app-folder-existing';
import { initialiseFeAppWorkspace } from './lib/fe-app/initialise-fe-app-workspace';
import { addSharedApplicationEslintRule } from './lib/shared/add-shared-application-eslint-rule';

export async function createAppGroupingFolderGenerator(
  tree: Tree,
  options: CreateAppGroupingFolderGeneratorSchema
): Promise<void> {
  const { framework, name, baseFolder } = options;
  if (framework === FrontendFramework.Angular) {
    if (!isFeAppFolderExisting(framework, tree)) {
      await initialiseFeAppWorkspace(framework, tree);
    }
  }
  const directory = framework
    ? `${baseFolder}/${framework}-${name}`
    : `${baseFolder}/${name}`;
  tree.write(directory, '');
  if (name === 'shared') {
    addSharedApplicationEslintRule(tree, framework);
  }
}

export default createAppGroupingFolderGenerator;

export const removeSchematic = convertNxGenerator(
  createAppGroupingFolderGenerator
);
