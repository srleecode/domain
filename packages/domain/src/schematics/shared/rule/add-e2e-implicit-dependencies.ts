import { Rule } from '@angular-devkit/schematics';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { updateJsonInTree, NxJson } from '@nrwl/workspace';
import { getParsedDomain } from '../../../utils/domain';
import { checkE2EProjectExists } from '../validation/check-e2e-project-exists';
import { getE2ECypressProjectName } from '../../../utils/e2e-project';

export const addE2EImplicitDependencies = (
  application: string,
  domain: string,
  libraryTypes: DomainLibraryName[]
): Rule =>
  updateJsonInTree<NxJson>('nx.json', (json) => {
    checkE2EProjectExists(application, domain, json);
    const projectName = getE2ECypressProjectName(application, domain);
    const newDependencies = libraryTypes.map(
      (type) => `${application}-${getParsedDomain(domain)}-${type}`
    );
    const existingDependencies =
      json.projects[projectName].implicitDependencies || [];
    json.projects[projectName].implicitDependencies = [
      ...existingDependencies,
      ...newDependencies,
    ];

    return json;
  });
