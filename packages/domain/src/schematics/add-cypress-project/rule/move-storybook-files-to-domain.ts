import { CypressProject } from '../../shared/model/cypress-project.enum';
import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { getCypressJsonPath } from '../../../utils/cypress-project';
import { updateJsonInTree } from '@nrwl/workspace';
import { deleteInTree, renameInTree } from '../../../utils/tree';
import { isTwoLevelDomain } from '../../../utils/domain';

export const moveStorybookFilesToDomain = (
  application: string,
  domain: string
) => (tree: Tree, context: SchematicContext): Rule => {
  const storybookFilesToMove = [
    'integration/app.spec.ts',
    'support/app.po.ts',
    'support/commands.ts',
    'support/index.ts',
  ];
  const storybookFilesToDelete = ['fixtures/example.json', 'plugins/index.js'];

  storybookFilesToMove.forEach((filePath) =>
    renameInTree(
      tree,
      `apps/${CypressProject.Storybook}/${application}/${domain}/src/${filePath}`,
      `libs/${application}/${domain}/.${CypressProject.Storybook}/${filePath}`
    )
  );

  storybookFilesToDelete.forEach((filePath) =>
    deleteInTree(
      tree,
      `apps/${CypressProject.Storybook}/${application}/${domain}/src/${filePath}`
    )
  );
  const libsRelativePath = isTwoLevelDomain(domain)
    ? '../../../../../libs'
    : '../../../../libs';
  return updateJsonInTree(
    getCypressJsonPath(application, domain, CypressProject.Storybook),
    (json) => {
      delete json.fixturesFolder;
      delete json.pluginsFile;
      json.integrationFolder = `${libsRelativePath}/${application}/${domain}/.${CypressProject.Storybook}/integration`;
      json.supportFile = `${libsRelativePath}/${application}/${domain}/.${CypressProject.Storybook}/support/index.ts`;
      return json;
    }
  );
};
