import { LibraryDefinition } from '../model/library-definition.model';
import { Rule } from '@angular-devkit/schematics';
import { getExternalSchematic } from '../../../utils/testing';

export const addLibrariesRules = (
  libraryDefinitions: LibraryDefinition[]
): Rule[] =>
  libraryDefinitions.map((definition) =>
    getExternalSchematic('@nrwl/angular', 'lib', {
      name: definition.projectName,
      directory: definition.directory,
      tags: definition.tags.join(','),
      linter: 'eslint',
      style: definition.style,
      prefix: definition.prefix,
    })
  );
