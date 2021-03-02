import { Tree, updateJson } from '@nrwl/devkit';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { getCypressJsonPath } from '../../shared/utils/cypress-project';

export const updateStorybookCypressBaseUrl = (
  tree: Tree,
  application: string,
  domain: string
): void =>
  updateJson(
    tree,
    getCypressJsonPath(application, domain, CypressProject.Storybook),
    (json) => {
      json.baseUrl = 'http://localhost:4400';
      return json;
    }
  );
