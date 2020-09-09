import {
  chain,
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { CreateSchematicSchema } from './schema';
import { NormalizedSchema } from './model/normalized-schema.model';
import { addParentDomainDependencyRule } from './rule/add-parent-domain-dependency';
import { addLibrariesRules } from '../shared/rule/add-libraries';
import {
  isChildDomain,
  getParsedDomain,
  getTopLevelDomain,
} from '../../utils/domain';
import { checkParentDomainExists } from '../shared/validation/check-parent-domain-exists';
import { DomainLibraryName } from '../shared/model/domain-library-name.enum';
import { addMockFileResolutionPath } from '../shared/rule/add-mock-file-resolution-path';
import { addMockFile } from '../shared/rule/add-mock-file';
import { getDomainLibraryDefinitions } from '../../utils/libraries';
import { checkDomainLevels } from './validation/check-domain-levels';
import { addJestJunitReporter } from '../shared/rule/add-jest-junit-reporter';
import { addE2EProjectRules } from '../add-e2e-project/rule/add-e2e-project-rules';

export default function (options: CreateSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    checkDomainLevels(options.domain);
    const normalizedOptions = normalizeOptions(options);
    let rules = addLibrariesRules(normalizedOptions.libraryDefinitions);
    if (isChildDomain(options.domain)) {
      const parentDomain = getTopLevelDomain(options.domain);
      const parsedDomain = getParsedDomain(options.domain).replace(
        '-shared',
        ''
      );
      checkParentDomainExists(options.application, parentDomain, tree);
      rules.push(
        addParentDomainDependencyRule(
          options.application,
          parentDomain,
          parsedDomain
        )
      );
    }
    if (options.includedLibraryTypes.includes(DomainLibraryName.Util)) {
      rules.push(addMockFile(options.application, options.domain));
      rules.push(
        addMockFileResolutionPath(options.application, options.domain)
      );
    }
    if (!!options.addJestJunitReporter) {
      options.includedLibraryTypes.forEach((libraryType) =>
        rules.push(
          addJestJunitReporter(options.application, options.domain, libraryType)
        )
      );
    }
    if (!!options.addCypressProject) {
      rules = rules.concat(
        addE2EProjectRules(
          options.application,
          options.domain,
          options.includedLibraryTypes,
          options.linter,
          tree
        )
      );
    }
    return chain(rules);
  };
}

const normalizeOptions = (options: CreateSchematicSchema): NormalizedSchema => {
  return {
    ...options,
    libraryDefinitions: getDomainLibraryDefinitions(
      options.application,
      options.domain,
      options.prefix,
      options.includedLibraryTypes,
      options.style
    ),
  };
};
