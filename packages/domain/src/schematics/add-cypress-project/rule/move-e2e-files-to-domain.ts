import { CypressProject } from '../../shared/model/cypress-project.enum';
import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { getCypressJsonPath } from '../../../utils/cypress-project';
import { updateJsonInTree } from '@nrwl/workspace';
import { renameInTree } from '../../../utils/tree';
import { isTwoLevelDomain } from '../../../utils/domain';

export const moveE2EFilesToDomain = (application: string, domain: string) => (
  tree: Tree,
  context: SchematicContext
): Rule => {
  const e2eFilesToMove = [
    'fixtures/example.json',
    'integration/app.spec.ts',
    'plugins/index.js',
    'support/app.po.ts',
    'support/commands.ts',
    'support/index.ts',
  ];

  e2eFilesToMove.forEach((filePath) =>
    renameInTree(
      tree,
      `apps/${CypressProject.E2E}/${application}/${domain}/src/${filePath}`,
      `libs/${application}/${domain}/.${CypressProject.E2E}/${filePath}`
    )
  );

  const libsRelativePath = isTwoLevelDomain(domain)
    ? '../../../../../libs'
    : '../../../../libs';
  return updateJsonInTree(
    getCypressJsonPath(application, domain, CypressProject.E2E),
    (json) => ({
      ...json,
      fixturesFolder: `${libsRelativePath}/${application}/${domain}/.${CypressProject.E2E}/fixtures`,
      integrationFolder: `${libsRelativePath}/${application}/${domain}/.${CypressProject.E2E}/integration`,
      pluginsFile: `${libsRelativePath}/${application}/${domain}/.${CypressProject.E2E}/plugins/index`,
      supportFile: `${libsRelativePath}/${application}/${domain}/.${CypressProject.E2E}/support/index.ts`,
    })
  );
};
