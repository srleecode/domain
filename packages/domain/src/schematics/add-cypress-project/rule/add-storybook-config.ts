import { getExternalSchematic } from '../../../utils/testing';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import {
  createInTree,
  deleteInTree,
  getDirInTree,
  readInTree,
} from '../../../utils/tree';
import { getParsedDomain, isTwoLevelDomain } from '../../../utils/domain';
import { updateJsonInTree } from '@nrwl/workspace';
import { updateStorybookTargets } from './update-storybook-targets';
import { updateStorybookAddonsBasePath } from './update-storybook-addons-base-path';
import { updateStorybookCypressBaseUrl } from './add-storybook-cypress-base-url';
import { getTsConfigPath } from '../../../utils/tsconfig';
import { updateStorybookWebpackBasePath } from './update-storybook-webpack-base-path';
import { UiFrameworkType } from '../../shared/model/ui-framework.type';
import { updatePathInStorybookConfig } from '../../shared/rule/update-path-in-storybook-config';
import { getCypressJsonPath } from '../../../utils/cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { addStoryFileExclusions } from '../../shared/rule/add-story-file-exclusions';
import { Linter } from '../../shared/model/linter.enum';

export const addStorybookConfig = (
  application: string,
  domain: string,
  lint: Linter,
  libraries: DomainLibraryName[],
  uiFramework: UiFrameworkType
): Rule[] => {
  const libraryName = `${application}-${getParsedDomain(domain)}-${
    (libraries || [])[0]
  }`;
  return [
    getExternalSchematic('@nrwl/storybook', 'configuration', {
      name: libraryName,
      uiFramework,
      configureCypress: false,
      linter: lint,
    }),
    moveStorybookConfig(application, domain, (libraries || [])[0]),
    updateCypressJsonReferencesFolders(application, domain),
    updatePathInStorybookConfig(application, domain),
    updateTsConfig(application, domain),
    removeLibraryTsConfigPath(application, domain, (libraries || [])[0]),
    updateStorybookTargets(application, domain, libraryName, uiFramework),
    updateStorybookAddonsBasePath(application, domain),
    updateStorybookCypressBaseUrl(application, domain),
    removeAddedStoryFilesExclusions(application, domain, (libraries || [])[0]),
    ...addStoryFileExclusions(application, domain, libraries),
    updateStorybookWebpackBasePath(application, domain),
  ];
};

const moveStorybookConfig = (
  application: string,
  domain: string,
  libraryType: DomainLibraryName
): Rule => (tree: Tree, context: SchematicContext): Tree => {
  const cypressFolder = getDirInTree(
    tree,
    `libs/${application}/${domain}/${libraryType}/.storybook`
  );
  cypressFolder.visit((file) => {
    const newPath = file.replace(
      cypressFolder.path,
      `libs/${application}/${domain}/.storybook`
    );
    createInTree(tree, newPath, readInTree(tree, file));
  });
  const originalStorybookPath = `libs/${application}/${domain}/${libraryType}/.storybook`;
  tree
    .getDir(originalStorybookPath)
    .subfiles.forEach((file) =>
      deleteInTree(tree, `${originalStorybookPath}/${file}`)
    );
  return tree;
};

const removeLibraryTsConfigPath = (
  application: string,
  domain: string,
  libraryType: DomainLibraryName
): Rule =>
  updateJsonInTree(
    `libs/${application}/${domain}/${libraryType}/tsconfig.json`,
    (json) => {
      if (json.references) {
        json.references = (json.references || []).filter(
          (ref) => ref.path !== './.storybook/tsconfig.json'
        );
      }
      return json;
    }
  );

const updateCypressJsonReferencesFolders = (
  application: string,
  domain: string
): Rule =>
  updateJsonInTree(
    getCypressJsonPath(application, domain, CypressProject.Storybook),
    (json) => {
      delete json.fixturesFolder;
      delete json.pluginsFile;
      json['integrationFolder'] = json['integrationFolder'].replace(
        '/integration',
        '/integration/storybook'
      );
      return json;
    }
  );

const updateTsConfig = (application: string, domain: string): Rule => (
  tree: Tree,
  _context: SchematicContext
) =>
  updateJsonInTree(
    `libs/${application}/${domain}/.storybook/tsconfig.json`,
    (json) => {
      const componentFolders = ['feature', 'ui'];
      const baseRelativePath = isTwoLevelDomain(domain)
        ? '../../../../../'
        : '../../../../';
      json.extends = `${baseRelativePath}${getTsConfigPath(tree)}`;
      json.exclude = componentFolders.map(
        (folder) => `../${folder}/**/*.spec.ts`
      );
      json.compilerOptions = {
        ...json.compilerOptions,
        types: ['node'],
        sourceMap: true,
      };
      json.include = componentFolders.map((folder) => `../${folder}/src/**/*`);
      return json;
    }
  );

export const removeAddedStoryFilesExclusions = (
  application: string,
  domain: string,
  libraryType: DomainLibraryName
): Rule =>
  updateJsonInTree(
    `libs/${application}/${domain}/${libraryType}/tsconfig.lib.json`,
    (json) => {
      json.exclude = (json.exclude || []).filter(
        (excludePath) => !excludePath.includes('stories')
      );
      return json;
    }
  );
