import { Rule } from '@angular-devkit/schematics';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { updateJsonInTree, NxJson } from '@nrwl/workspace';
import { getParsedDomain } from '../../../utils/domain';
import { checkCypressProjectExists } from '../validation/check-cypress-project-exists';
import { getCypressProjectName } from '../../../utils/cypress-project';
import { CypressProject } from '../model/cypress-project.enum';

export const addImplicitDependenciesToCypressProject = (
  application: string,
  domain: string,
  libraryTypes: DomainLibraryName[],
  projectType: CypressProject
): Rule =>
  updateJsonInTree<NxJson>('nx.json', (json) => {
    checkCypressProjectExists(application, domain, projectType, json);
    const projectName = getCypressProjectName(application, domain, projectType);
    const newDependencies = libraryTypes.map(
      (type) => `${application}-${getParsedDomain(domain)}-${type}`
    );
    const existingDependencies = (
      json.projects[projectName].implicitDependencies || []
    ).filter((dependency) => !!dependency);
    json.projects[projectName].implicitDependencies = [
      ...existingDependencies,
      ...newDependencies,
    ];

    return json;
  });
