import { DomainLibraryName } from '../model/domain-library-name.enum';
import { Tree, updateJson } from '@nrwl/devkit';

export const addStoryFileExclusions = (
  tree: Tree,
  application: string,
  domain: string,
  libraryTypes: DomainLibraryName[]
): void =>
  libraryTypes
    .filter(
      (libraryType) =>
        libraryType === DomainLibraryName.Feature ||
        libraryType === DomainLibraryName.Ui
    )
    .forEach((libraryType) =>
      updateJson(
        tree,
        `libs/${application}/${domain}/${libraryType}/tsconfig.lib.json`,
        (json) => {
          json.exclude = json.exclude.concat([
            '**/*.stories.ts',
            '**/*.stories.js',
          ]);
          return json;
        }
      )
    );
