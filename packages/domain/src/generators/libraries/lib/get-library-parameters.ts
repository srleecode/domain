import { Linter } from '../../shared/model/linter.enum';
import { NxLibraryParamters } from '../../shared/model/nx-library-parameters.model';
import { Tree } from '@nrwl/devkit';
import { LibrariesNormalizedSchema } from '../model/libraries-normalized-schema.model';
import { getNpmScope } from '../../shared/utils/nx-json';

export const getLibraryParameters = (
  tree: Tree,
  schema: LibrariesNormalizedSchema
): NxLibraryParamters[] => {
  return schema.libraryDefinitions.map((definition) => {
    const parameters: NxLibraryParamters = {
      name: definition.projectName,
      directory: definition.directory,
      tags: definition.tags.join(','),
      linter: Linter.EsLint,
      style: schema.style,
      prefix: schema.prefix,
      buildable: schema.buildable,
      strict: schema.strict,
      enableIvy: schema.enableIvy,
      publishable: schema.publishable,
    };
    if (schema.routing !== undefined) {
      parameters.routing = schema.routing;
      parameters.lazy = schema.routing;
    }
    if (parameters.publishable) {
      parameters.importPath = `@${getNpmScope(tree)}/${schema.application}/${
        schema.domain
      }/${definition.type}`;
    }
    return parameters;
  });
};
