import {
  Rule,
  Tree,
  SchematicContext,
  SchematicsException,
} from '@angular-devkit/schematics';
import { deleteInTree, getDirInTree } from '../../../utils/tree';
import { getParsedDomain } from '../../../utils/domain';
import { CypressProject } from '../model/cypress-project.enum';

export const deleteLibraryCypressFolders = (
  application: string,
  domain: string,
  projectType: CypressProject
): Rule => (tree: Tree, context: SchematicContext) => {
  const otherCypressProjectType =
    projectType === CypressProject.E2E
      ? CypressProject.Storybook
      : CypressProject.E2E;
  const domainFolder = getDirInTree(tree, `libs/${application}/${domain}`);
  const isHavingOtherCypressProjectType = isHavingSubDir(
    domainFolder,
    `.${otherCypressProjectType}`
  );
  const cypressFolders = [`.${projectType}`];
  if (!isHavingOtherCypressProjectType) {
    cypressFolders.push('.cypress');
  }
  cypressFolders.forEach((folder) => {
    if (isHavingSubDir(domainFolder, folder)) {
      deleteInTree(tree, `libs/${application}/${domain}/${folder}`);
    }
  });
  return tree;
};

const isHavingSubDir = (domainFolder: any, subFolder: string): boolean =>
  domainFolder.subdirs.some((subDir) => subDir.toString() === subFolder);
