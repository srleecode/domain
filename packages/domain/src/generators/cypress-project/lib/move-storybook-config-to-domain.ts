import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { updateStorybookTargets } from './update-storybook-targets';
import { updateStorybookAddonsBasePath } from './update-storybook-addons-base-path';
import { updateStorybookCypressBaseUrl } from './add-storybook-cypress-base-url';
import { updateStorybookWebpackBasePath } from './update-storybook-webpack-base-path';
import { UiFrameworkType } from '../../shared/model/ui-framework.type';
import { Tree, updateJson } from '@nrwl/devkit';
import { isTwoLevelDomain } from '../../shared/utils/domain';
import { moveDirectory } from '../../shared/utils/tree';
import { getCypressJsonPath } from '../../shared/utils/cypress-project';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { getTsConfigPath } from '../../shared/utils/tsconfig';
import { updatePathInStorybookConfig } from '../../shared/lib/update-path-in-storybook-config';
import { addStoryFileExclusions } from '../../shared/lib/add-story-file-exclusions';
import { removeLibraryStorybookLintReference } from './remove-library-storybook-lint-reference';

export const moveStorybookConfigToDomain = (
  tree: Tree,
  application: string,
  domain: string,
  libraryName: string,
  libraries: DomainLibraryName[],
  uiFramework: UiFrameworkType
): void => {
  const firstLibrary = (libraries || [])[0];
  moveStorybookConfig(tree, application, domain, firstLibrary);
  updateCypressJsonReferencesFolders(tree, application, domain);
  updatePathInStorybookConfig(tree, application, domain);
  updateTsConfig(tree, application, domain);
  removeLibraryTsConfigPath(tree, application, domain, firstLibrary);
  updateStorybookTargets(tree, application, domain, libraryName, uiFramework);
  updateStorybookAddonsBasePath(tree, application, domain);
  updateStorybookCypressBaseUrl(tree, application, domain);
  removeAddedStoryFilesExclusions(tree, application, domain, firstLibrary);
  addStoryFileExclusions(tree, application, domain, libraries);
  updateStorybookWebpackBasePath(tree, application, domain);
  removeLibraryStorybookLintReference(tree, application, domain, firstLibrary);
};

const moveStorybookConfig = (
  tree: Tree,
  application: string,
  domain: string,
  libraryType: DomainLibraryName
) => {
  const folderPath = `libs/${application}/${domain}/${libraryType}/.storybook`;
  moveDirectory(tree, folderPath, `libs/${application}/${domain}/.storybook`);
};

const removeLibraryTsConfigPath = (
  tree: Tree,
  application: string,
  domain: string,
  libraryType: DomainLibraryName
) =>
  updateJson(
    tree,
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
  tree: Tree,
  application: string,
  domain: string
) =>
  updateJson(
    tree,
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

const updateTsConfig = (tree: Tree, application: string, domain: string) =>
  updateJson(
    tree,
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
  tree: Tree,
  application: string,
  domain: string,
  libraryType: DomainLibraryName
): void =>
  updateJson(
    tree,
    `libs/${application}/${domain}/${libraryType}/tsconfig.lib.json`,
    (json) => {
      json.exclude = (json.exclude || []).filter(
        (excludePath) => !excludePath.includes('stories')
      );
      return json;
    }
  );
