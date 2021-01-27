import { Rule, Tree, SchematicsException } from '@angular-devkit/schematics';
import { getExternalSchematic } from '../../../utils/testing';
import { AddLibrariesNormalizedSchema } from '../../add-libraries/model/normalized-schema.model';
import { CreateNormalizedSchema } from '../../create/model/normalized-schema.model';
import { Linter } from '@nrwl/workspace';
import { NxLibraryParamters } from '../model/nx-library-parameters.model';
import { getDomainProjectConfig } from '../../../utils/domain-config';
import { getNpmScope } from '../../../utils/nx-json';

export const addLibrariesRules = (
  tree: Tree,
  schema: AddLibrariesNormalizedSchema | CreateNormalizedSchema,
  isForNewDomain: boolean
): Rule[] =>
  schema.libraryDefinitions.map((definition) => {
    const parameters: NxLibraryParamters = {
      name: definition.projectName,
      directory: definition.directory,
      tags: definition.tags.join(','),
      linter: Linter.EsLint,
      style: schema.style,
      prefix: schema.prefix,
    };
    if (schema.routing !== undefined) {
      parameters.routing = schema.routing;
      parameters.lazy = schema.routing;
    }
    if (isForNewDomain) {
      const createSchema = schema as CreateNormalizedSchema;
      if (createSchema.buildable !== undefined) {
        parameters.buildable = createSchema.buildable;
      }
      if (createSchema.strict !== undefined) {
        parameters.strict = createSchema.strict;
      }
      if (createSchema.enableIvy !== undefined) {
        parameters.enableIvy = createSchema.enableIvy;
      }
      if (createSchema.publishable !== undefined) {
        parameters.publishable = createSchema.publishable;
      }
    } else {
      const projectConfig = getDomainProjectConfig(
        tree,
        schema.application,
        schema.domain
      );
      parameters.buildable = projectConfig.buildable;
      parameters.strict = projectConfig.strict;
      parameters.enableIvy = projectConfig.enableIvy;
      parameters.publishable = projectConfig.publishable;
    }
    if (parameters.publishable) {
      parameters.importPath = `@${getNpmScope(tree)}/${schema.application}/${
        schema.domain
      }/${definition.type}`;
    }

    return getExternalSchematic('@nrwl/angular', 'lib', parameters);
  });
