import { Rule } from '@angular-devkit/schematics';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { updateJsonInTree, NxJson } from '@nrwl/workspace';
import { checkCypressProjectExists } from '../validation/check-cypress-project-exists';
import {
  getCypressProjectName,
  getDependenciesWithLibrariesRemoved,
} from '../../../utils/cypress-project';
import { CypressProject } from '../model/cypress-project.enum';

export const removeCypressProjectImplicitDependencies = (
  application: string,
  domain: string,
  libraryTypes: DomainLibraryName[],
  projectType: CypressProject
): Rule =>
  updateJsonInTree<NxJson>('nx.json', (json) => {
    checkCypressProjectExists(application, domain, projectType, json);
    const projectName = getCypressProjectName(application, domain, projectType);
    json.projects[
      projectName
    ].implicitDependencies = getDependenciesWithLibrariesRemoved(
      application,
      domain,
      libraryTypes,
      projectType,
      json
    );
    return json;
  });
