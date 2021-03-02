import { moveE2EFilesToDomain } from './move-e2e-files-to-domain';
import { Tree, updateJson } from '@nrwl/devkit';

export const moveE2EProjectToDomainFolder = (
  tree: Tree,
  application: string,
  domain: string
): void => {
  moveE2EFilesToDomain(tree, application, domain);
  changeIntegrationFolder(tree, application, domain);
};

const changeIntegrationFolder = (
  tree: Tree,
  application: string,
  domain: string
) =>
  updateJson(
    tree,
    `libs/${application}/${domain}/.cypress/cypress.json`,
    (json) => {
      json['integrationFolder'] = json['integrationFolder'].replace(
        '/integration',
        '/integration/e2e'
      );
      return json;
    }
  );
