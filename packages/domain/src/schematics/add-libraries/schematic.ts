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
import { isHavingCypressProject } from '../../utils/cypress-project';
import { addImplicitDependenciesToCypressProject } from '../shared/rule/add-implicit-dependencies-to-cypress-project';
import { checkDomainExists } from '../shared/validation/check-domain-exists';
import { CypressProject } from '../shared/model/cypress-project.enum';
import { addStoryFileExclusions } from '../shared/rule/add-story-file-exclusions';
import { updatePathInStorybookConfig } from '../shared/rule/update-path-in-storybook-config';

export default function (options: AddLibrariesSchematicSchema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const normalizedOptions = normalizeOptions(options);
    const { application, domain, libraries } = options;
    checkDomainExists(application, domain, tree);
    checkLibrariesDontExist(application, domain, libraries, tree);
    let rules = addLibrariesRules(normalizedOptions.libraryDefinitions);
    rules.concat(addStoryFileExclusions(application, domain, libraries));
    if (libraries.includes(DomainLibraryName.Util)) {
      rules.push(addMockFile(application, domain));
      rules.push(addMockFileResolutionPath(application, domain));
    }
    if (!!options.addJestJunitReporter) {
      libraries.forEach((libraryType) =>
        rules.push(addJestJunitReporter(application, domain, libraryType))
      );
    }
    if (isHavingCypressProject(application, domain, CypressProject.E2E, tree)) {
      rules.push(
        addImplicitDependenciesToCypressProject(
          application,
          domain,
          libraries,
          CypressProject.E2E
        )
      );
    }
    if (
      isHavingCypressProject(
        application,
        domain,
        CypressProject.Storybook,
        tree
      )
    ) {
      rules.push(
        addImplicitDependenciesToCypressProject(
          application,
          domain,
          libraries,
          CypressProject.Storybook
        )
      );
      rules.push(updatePathInStorybookConfig(application, domain));
      rules = rules.concat(
        addStoryFileExclusions(application, domain, libraries)
      );
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
