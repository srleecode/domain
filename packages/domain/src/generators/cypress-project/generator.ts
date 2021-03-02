import { Tree, logger, convertNxGenerator } from '@nrwl/devkit';
import { sortProjects } from '../shared/lib/sort-projects';
import { CypressProject } from '../shared/model/cypress-project.enum';
import { Linter } from '../shared/model/linter.enum';
import {
  isHavingComponentCommand,
  isHavingEsLintRcJson,
} from '../shared/utils/cypress-project';
import { getLibraryTypes, getParsedDomain } from '../shared/utils/domain';
import { checkDomainExists } from '../shared/validation/check-domain-exists';
import { addCypressLintFiles } from './lib/add-cypress-lint-files';
import { moveE2EProjectToDomainFolder } from './lib/move-e2e-project-to-domain-folder';
import { createComponentCommand } from './lib/create-command-component';
import { getNrwlCypressSchematicSchema } from './lib/get-nrwl-cypress-generator-schema';
import { cypressProjectGenerator as nrwlCypressProjectGenerator } from '@nrwl/cypress';
import { AddCypressProjectGeneratorSchema } from './schema';
import { renameCypressProjectInJson } from './lib/rename-cypress-project-in-json';
import { addImplicitDependenciesToCypressProject } from '../shared/lib/add-implicit-dependencies-to-cypress-project';
import { addSourceMapFalse } from './lib/add-source-map-false';
import { addProjectToJestConfig } from './lib/add-project-to-jest-config';
import { moveCypressFilesToDomain } from './lib/move-cypress-files-to-domain';
import { moveStorybookConfigToDomain } from './lib/move-storybook-config-to-domain';
import { configurationGenerator } from '@nrwl/storybook';

export async function cypressProjectGenerator(
  tree: Tree,
  options: AddCypressProjectGeneratorSchema
): Promise<void> {
  const { application, domain, projectType, addComponentCommand } = options;
  const lint = Linter.EsLint;
  checkDomainExists(application, domain, tree);
  logger.info(
    `Adding ${projectType} project to ${application}-${getParsedDomain(domain)}`
  );
  let existingProjectLibraryTypes = getLibraryTypes(application, domain, tree);
  if (existingProjectLibraryTypes.length === 0) {
    existingProjectLibraryTypes = options.domainLibraries;
  }
  if (projectType === CypressProject.E2E) {
    const schema = getNrwlCypressSchematicSchema(
      application,
      domain,
      lint,
      CypressProject.E2E
    );
    await nrwlCypressProjectGenerator(tree, schema).catch((e) => {
      logger.error(e.message);
      throw e;
    });
    renameCypressProjectInJson(tree, application, domain, projectType);
    addImplicitDependenciesToCypressProject(
      tree,
      application,
      domain,
      existingProjectLibraryTypes,
      projectType
    );
    moveE2EProjectToDomainFolder(tree, application, domain);
    addSourceMapFalse(tree, application, domain);
    addProjectToJestConfig(tree, application, domain, '.cypress');
  } else {
    const schema = getNrwlCypressSchematicSchema(
      application,
      domain,
      lint,
      CypressProject.Storybook
    );
    await nrwlCypressProjectGenerator(tree, schema).catch((e) => {
      logger.error(e.message);
      throw e;
    });
    renameCypressProjectInJson(tree, application, domain, projectType);
    addImplicitDependenciesToCypressProject(
      tree,
      application,
      domain,
      existingProjectLibraryTypes,
      projectType
    );
    moveCypressFilesToDomain(tree, application, domain);
    addSourceMapFalse(tree, application, domain);
    addProjectToJestConfig(tree, application, domain, '.cypress');
    const libraryName = `${application}-${getParsedDomain(domain)}-${
      (existingProjectLibraryTypes || [])[0]
    }`;
    const uiFramework = '@storybook/angular';
    await configurationGenerator(tree, {
      name: libraryName,
      uiFramework,
      configureCypress: false,
      linter: lint,
    }).catch((e) => {
      logger.error('configurationGenerator' + e.message);
      throw Error(e);
    });
    moveStorybookConfigToDomain(
      tree,
      application,
      domain,
      libraryName,
      existingProjectLibraryTypes,
      uiFramework
    );
  }
  sortProjects(tree);
  if (
    addComponentCommand &&
    !isHavingComponentCommand(tree, application, domain)
  ) {
    createComponentCommand(tree, application, domain, '../files');
  }
  if (isHavingEsLintRcJson(tree, application, domain)) {
    addCypressLintFiles(tree, application, domain);
  }
}

export default cypressProjectGenerator;

export const cypressProjectSchematic = convertNxGenerator(
  cypressProjectGenerator
);
