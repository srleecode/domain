import {
  chain,
  Rule,
  SchematicsException,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { CreateSchematicSchema } from './schema';
import { CreateNormalizedSchema } from './model/normalized-schema.model';
import { addParentDomainDependencyRule } from './rule/add-parent-domain-dependency';
import { addLibrariesRules } from '../shared/rule/add-libraries';
import {
  isChildDomain,
  getParsedDomain,
  getTopLevelDomain,
} from '../../utils/domain';
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
import { sortProjects } from '../shared/rule/sort-projects';
import { createComponentCommand } from '../add-cypress-project/rule/create-command-component';
import { addCypressLintFiles } from '../add-cypress-project/rule/add-cypress-lint-files';
import { addDomainConfigProject } from './rule/add-domain-config-project';
import { isHavingEsLintRcJson } from '../../utils/cypress-project';
import { Linter } from '../shared/model/linter.enum';
import { checkDomainFolderIsEmpty } from './validation/check-domain-folder-is-empty';

export default function (options: CreateSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    checkDomainLevels(options.domain);
    const libraries = getParsedLibraries(options.libraries);
    const {
      application,
      domain,
      addStorybookProject,
      addE2EProject,
      addComponentCommand,
      routing,
      enableIvy,
      publishable,
    } = options;
    const lint = Linter.EsLint;
    if (libraries.length === 0) {
      throw new SchematicsException('At least one library should be provided');
    }
    if (routing && !libraries.includes(DomainLibraryName.Shell)) {
      throw new SchematicsException(
        'A shell library should be included if you are using the routing option'
      );
    }
    if (enableIvy && publishable) {
      _context.logger.warn(
        'It is not recommended to make libraries publishable when ivy is enabled'
      );
    }
    _context.logger.info(
      `Creating domain ${application}-${getParsedDomain(domain)}`
    );
    const normalizedOptions = normalizeOptions(options);
    let rules = addLibrariesRules(tree, normalizedOptions, true);

    if (isChildDomain(options.domain)) {
      const parentDomain = getTopLevelDomain(domain);
      const parsedDomain = getParsedDomain(domain).replace('-shared', '');
      rules.push(
        addParentDomainDependencyRule(application, parentDomain, parsedDomain)
      );
    } else {
      checkDomainFolderIsEmpty(application, domain, tree);
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
      if (
        !addStorybookProjectRules &&
        isHavingEsLintRcJson(application, domain, tree)
      ) {
        rules.push(addCypressLintFiles(application, domain));
      }
    }
    if (addStorybookProject) {
      rules = rules.concat(
        addStorybookProjectRules(application, domain, lint, libraries)
      );
      rules.concat(addStoryFileExclusions(application, application, libraries));
      if (isHavingEsLintRcJson(application, domain, tree)) {
        rules.push(addCypressLintFiles(application, domain));
      }
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
    rules.push(addDomainConfigProject(application, domain, normalizedOptions));
    return chain(rules);
  };
}

const normalizeOptions = (
  options: CreateSchematicSchema
): CreateNormalizedSchema => {
  return {
    ...options,
    libraryDefinitions: getDomainLibraryDefinitions(
      options.application,
      options.domain,
      options.libraries
    ),
  };
};
