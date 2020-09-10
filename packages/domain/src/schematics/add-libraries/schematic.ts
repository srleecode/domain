import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { AddLibrariesSchematicSchema } from './schema';
import { NormalizedSchema } from './model/normalized-schema.model';
import { addLibrariesRules } from '../shared/rule/add-libraries';
import { getDomainLibraryDefinitions } from '../../utils/libraries';
import { checkLibrariesDontExist } from './validation/check-libraries-dont-exist';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { addMockFile } from '../shared/rule/add-mock-file';
import { addMockFileResolutionPath } from '../shared/rule/add-mock-file-resolution-path';
import { addJestJunitReporter } from '../shared/rule/add-jest-junit-reporter';
import { checkDomainExists } from '../move/validation/check-domain-exists';
import { isHavingE2ECypressProject } from '../../utils/e2e-project';
import { addE2EImplicitDependencies } from '../shared/rule/add-e2e-implicit-dependencies';

export default function (options: AddLibrariesSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const normalizedOptions = normalizeOptions(options);
    const { application, domain, libraries } = options;
    checkDomainExists(application, domain, tree);
    checkLibrariesDontExist(application, application, libraries, tree);
    const rules = addLibrariesRules(normalizedOptions.libraryDefinitions);
    if (libraries.includes(DomainLibraryName.Util)) {
      rules.push(addMockFile(application, domain));
      rules.push(addMockFileResolutionPath(application, domain));
    }
    if (!!options.addJestJunitReporter) {
      libraries.forEach((libraryType) =>
        rules.push(addJestJunitReporter(application, domain, libraryType))
      );
    }
    if (isHavingE2ECypressProject(application, domain, tree)) {
      rules.push(addE2EImplicitDependencies(application, domain, libraries));
    }
    return chain(rules);
  };
}

const normalizeOptions = (
  options: AddLibrariesSchematicSchema
): NormalizedSchema => {
  return {
    ...options,
    libraryDefinitions: getDomainLibraryDefinitions(
      options.application,
      options.domain,
      options.prefix,
      options.libraries,
      options.style
    ),
  };
};
