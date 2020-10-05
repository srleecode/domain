import { getExternalSchematic } from '../../../utils/testing';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { getDirInTree } from '../../../utils/tree';
import { getParsedDomain, isTwoLevelDomain } from '../../../utils/domain';
import { Linter, updateJsonInTree } from '@nrwl/workspace';
import { updateStorybookTargets } from './update-storybook-targets';
import { updateStorybookAddonsBasePath } from './update-storybook-addons-base-path';
import { updateStorybookCypressBaseUrl } from './add-storybook-cypress-base-url';
import { getTsConfigPath } from '../../../utils/tsconfig';
import { updateStorybookWebpackBasePath } from './update-storybook-webpack-base-path';

export const addStorybookConfig = (
  application: string,
  domain: string,
  libraries: DomainLibraryName[]
): Rule[] => {
  const libraryName = `${application}-${getParsedDomain(domain)}-${
    libraries[0]
  }`;
  return [
    getExternalSchematic('@nrwl/storybook', 'configuration', {
      name: libraryName,
      uiFramework: '@storybook/angular',
      configureCypress: false,
      linter: Linter.EsLint,
    }),
    moveStorybookConfig(application, domain, libraries[0]),
    updatePathInConfigJs(application, domain),
    updateTsConfig(application, domain),
    updateStorybookTargets(application, domain, libraryName),
    updateStorybookAddonsBasePath(application, domain),
    updateStorybookCypressBaseUrl(application, domain),
    removeAddedStoryFilesExclusions(application, domain, libraries[0]),
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
    tree.create(newPath, tree.read(file));
  });
  const originalStorybookPath = `libs/${application}/${domain}/${libraryType}/.storybook`;
  tree
    .getDir(originalStorybookPath)
    .subfiles.forEach((file) =>
      tree.delete(`${originalStorybookPath}/${file}`)
    );
  return tree;
};

const updatePathInConfigJs = (application: string, domain: string): Rule => (
  tree: Tree,
  _context: SchematicContext
) => {
  const configJsFilePath = `libs/${application}/${domain}/.storybook/config.js`;
  const configJs = tree.read(configJsFilePath);
  const configJsString = configJs.toString();
  const updatedConfigJs = configJsString.replace(
    /configure\(.*;/,
    `configure([require.context('../feature/src/lib', true, /\.stories\.ts$/), require.context('../ui/src/lib', true, /\.stories\.ts$/)], module);`
  );
  tree.overwrite(configJsFilePath, updatedConfigJs);
  return tree;
};

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
        types: [],
        sourceMap: false,
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
      if (
        libraryType === DomainLibraryName.Feature ||
        libraryType === DomainLibraryName.Ui
      ) {
        json.exclude.push(['**/*.stories.ts', '**/*.stories.js']);
      }

      return json;
    }
  );
