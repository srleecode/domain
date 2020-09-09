import { Rule } from '@angular-devkit/schematics';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { updateJsonInTree, NxJson } from '@nrwl/workspace';
import { checkE2EProjectExists } from '../validation/check-e2e-project-exists';
import {
  getE2ECypressProjectName,
  getDependenciesWithLibrariesRemoved,
} from '../../../utils/e2e-project';

export const removeE2EImplicitDependencies = (
  application: string,
  domain: string,
  libraryTypes: DomainLibraryName[]
): Rule =>
  updateJsonInTree<NxJson>('nx.json', (json) => {
    checkE2EProjectExists(application, domain, json);
    const projectName = getE2ECypressProjectName(application, domain);
    json.projects[
      projectName
    ].implicitDependencies = getDependenciesWithLibrariesRemoved(
      application,
      domain,
      libraryTypes,
      json
    );
    return json;
  });
