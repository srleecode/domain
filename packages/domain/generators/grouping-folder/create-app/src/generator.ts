import { Tree, convertNxGenerator } from '@nrwl/devkit';
import { CreateAppGroupingFolderGeneratorSchema } from './schema';
import { Language } from './lib/model/language.enum';
import { isAngularAppFolderExisting } from './lib/angular/is-angular-app-folder-existing';
import { initialiseAngularWorkspace } from './lib/angular/initialise-angular-workspace';
import { addSharedApplicationEslintRule } from './lib/shared/add-shared-application-eslint-rule';

export async function createAppGroupingFolderGenerator(
  tree: Tree,
  options: CreateAppGroupingFolderGeneratorSchema
): Promise<void> {
  const { language, name, baseFolder } = options;
  if (language === Language.Angular) {
    if (!isAngularAppFolderExisting(tree)) {
      await initialiseAngularWorkspace(tree);
    }
  }
  const directory = language
    ? `${baseFolder}/${language}-${name}`
    : `${baseFolder}/${name}`;
  tree.write(directory, '');
  if (name === 'shared') {
    addSharedApplicationEslintRule(tree, language);
  }
}

export default createAppGroupingFolderGenerator;

export const removeSchematic = convertNxGenerator(
  createAppGroupingFolderGenerator
);
