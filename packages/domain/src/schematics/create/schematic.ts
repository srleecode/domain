import {
  chain,
  Rule,
  SchematicsException,
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
import {
  getDomainLibraryDefinitions,
  getParsedLibraries,
} from '../../utils/libraries';
import { checkDomainLevels } from './validation/check-domain-levels';
import { addJestJunitReporter } from '../shared/rule/add-jest-junit-reporter';
import { addE2EProjectRules } from '../add-cypress-project/rule/add-e2e-project-rules';
import { addStorybookProjectRules } from '../add-cypress-project/rule/add-storybook-project-rules';
import { addStoryFileExclusions } from '../shared/rule/add-story-file-exclusions';
import { Linter } from '@nrwl/workspace';
import { sortProjects } from '../shared/rule/sort-projects';
import { createComponentCommand } from '../add-cypress-project/rule/create-command-component';
import { addCypressLintFiles } from '../add-cypress-project/rule/add-cypress-lint-files';

export default function (options: CreateSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    checkDomainLevels(options.domain);
    const libraries = getParsedLibraries(options.libraries);
    const {
      application,
      domain,
      addStorybookProject,
      addE2EProject,
      uiFramework,
      addComponentCommand,
    } = options;
    const lint = Linter.EsLint;
    if (libraries.length === 0) {
      throw new SchematicsException('At least one library should be provided');
    }
    _context.logger.info(
      `Creating domain ${application}-${getParsedDomain(domain)}`
    );
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
      if (!addStorybookProjectRules) {
        rules.push(addCypressLintFiles(application, domain));
      }
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
      rules.push(addCypressLintFiles(application, domain));
    }
    rules = rules.concat(sortProjects());
    if (addComponentCommand && (addE2EProject || addStorybookProject)) {
      rules = rules.concat(
        createComponentCommand(
          application,
          domain,
          '../add-cypress-project/files'
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
      options.libraries,
      options.style
    ),
  };
};
