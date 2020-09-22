import { CypressProject } from '../../shared/model/cypress-project.enum';
import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { getCypressJsonPath } from '../../../utils/cypress-project';
import { updateJsonInTree } from '@nrwl/workspace';
import { renameInTree } from '../../../utils/tree';

export const moveE2EFilesToDomain = (
  application: string,
  domain: string,
  projectType: CypressProject
) => (tree: Tree, context: SchematicContext): Rule => {
  const e2eFilesToMove = ['fixtures/example.json', 'integration/app.spec.ts'];
  const cypressFilesToMove = [
    'plugins/index.js',
    'support/app.po.ts',
    'support/commands.ts',
    'support/index.ts',
  ];
  e2eFilesToMove.forEach((filePath) =>
    renameInTree(
      tree,
      `apps/${projectType}/${application}/${domain}/src/${filePath}`,
      `libs/${application}/${domain}/.e2e/${filePath}`
    )
  );
  cypressFilesToMove.forEach((filePath) =>
    renameInTree(
      tree,
      `apps/${projectType}/${application}/${domain}/src/${filePath}`,
      `libs/${application}/${domain}/.cypress/${filePath}`
    )
  );

  return updateJsonInTree(
    getCypressJsonPath(application, domain, projectType),
    (json) => ({
      ...json,
      fixturesFolder: `/libs/${application}/${domain}/.e2e/fixtures`,
      integrationFolder: `/libs/${application}/${domain}/.e2e/integration`,
      pluginsFile: `/libs/${application}/${domain}/.cypress/plugins/index`,
      supportFile: `/libs/${application}/${domain}/.cypress/support/index.ts`,
    })
  );
};
