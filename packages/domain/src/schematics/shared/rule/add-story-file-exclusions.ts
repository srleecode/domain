import { Rule } from '@angular-devkit/schematics';
import { DomainLibraryName } from '../model/domain-library-name.enum';
import { updateJsonInTree } from '@nrwl/workspace';

export const addStoryFileExclusions = (
  application: string,
  domain: string,
  libraryTypes: DomainLibraryName[]
): Rule[] =>
  libraryTypes
    .filter(
      (libraryType) =>
        libraryType === DomainLibraryName.Feature ||
        libraryType === DomainLibraryName.Ui
    )
    .map((libraryType) =>
      updateJsonInTree(
        `libs/${application}/${domain}/${libraryType}/tsconfig.lib.json`,
        (json) => {
          json.exclude.push(['**/*.stories.ts', '**/*.stories.js']);
          return json;
        }
      )
    );
