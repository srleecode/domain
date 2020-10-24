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
import { addE2EProjectRules } from '../add-cypress-project/rule/add-e2e-project-rules';
import { CypressProject } from '../shared/model/cypress-project.enum';
import { addStorybookProjectRules } from '../add-cypress-project/rule/add-storybook-project-rules';
import { addStoryFileExclusions } from '../shared/rule/add-story-file-exclusions';
import { Linter } from '@nrwl/workspace';

export default function (options: CreateSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    checkDomainLevels(options.domain);
    const {
      application,
      domain,
      libraries,
      addStorybookProject,
      addE2EProject,
      uiFramework,
    } = options;
    const lint = Linter.EsLint;
    const normalizedOptions = normalizeOptions(options);
    let rules = addLibrariesRules(normalizedOptions.libraryDefinitions);

    if (isChildDomain(options.domain)) {
      const parentDomain = getTopLevelDomain(domain);
      const parsedDomain = getParsedDomain(domain).replace('-shared', '');
      checkParentDomainExists(application, parentDomain, tree);
      rules.push(
        addParentDomainDependencyRule(application, parentDomain, parsedDomain)
      );
    }
    if (libraries.includes(DomainLibraryName.Util)) {
      rules.push(addMockFile(application, domain));
      rules.push(addMockFileResolutionPath(application, domain));
    }
    if (options.addJestJunitReporter) {
      libraries.forEach((libraryType) =>
        rules.push(addJestJunitReporter(application, domain, libraryType))
      );
    }
    if (addE2EProject) {
      rules = rules.concat(
        addE2EProjectRules(application, domain, lint, libraries)
      );
    }
    if (addStorybookProject) {
      rules = rules.concat(
        addStorybookProjectRules(
          application,
          domain,
          lint,
          libraries,
          uiFramework
        )
      );
      rules.concat(addStoryFileExclusions(application, application, libraries));
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
      options.libraries,
      options.style
    ),
  };
};
