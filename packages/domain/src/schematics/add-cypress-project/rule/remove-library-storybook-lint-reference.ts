import { updateJsonInTree } from '@nrwl/workspace';
import { Rule } from '@angular-devkit/schematics';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';

export const removeLibraryStorybookLintReference = (
  application: string,
  domain: string,
  library: DomainLibraryName
): Rule =>
  updateJsonInTree(
    `libs/${application}/${domain}/${library}/.eslintrc.json`,
    (json) => {
      json.overrides[0].parserOptions.project.splice(-1, 1);
      return json;
    }
  );
