import { Rule, Tree } from '@angular-devkit/schematics';
import { getProjectNames } from '../../../utils/libraries';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { removeSchematic } from '@nrwl/workspace/src/generators/remove/remove';

export const removeLibrariesRules = (
  application: string,
  domain: string,
  libraries: DomainLibraryName[]
): Rule[] => {
  const projectNames = getProjectNames(application, domain, libraries);
  return projectNames.map((projectName) =>
    removeSchematic({
      projectName,
      skipFormat: false,
      forceRemove: false,
    })
  );
};
