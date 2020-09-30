import { Rule, Tree } from '@angular-devkit/schematics';
import { getExternalSchematic } from '../../../utils/testing';
import { getProjectNames } from '../../../utils/libraries';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';

export const removeLibrariesRules = (
  application: string,
  domain: string,
  libraries: DomainLibraryName[]
): Rule[] => {
  const projectNames = getProjectNames(application, domain, libraries);
  return projectNames.map((projectName) =>
    getExternalSchematic('@nrwl/workspace', 'remove', {
      projectName,
    })
  );
};
