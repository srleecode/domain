import { updateJsonInTree } from '@nrwl/workspace';
import { Rule, Tree } from '@angular-devkit/schematics';
import { getCypressJsonPath } from '../../../utils/cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';

export const updateStorybookCypressBaseUrl = (
  application: string,
  domain: string
): Rule =>
  updateJsonInTree(
    getCypressJsonPath(application, domain, CypressProject.Storybook),
    (json) => {
      json.baseUrl = 'http://localhost:4400';
      return json;
    }
  );
