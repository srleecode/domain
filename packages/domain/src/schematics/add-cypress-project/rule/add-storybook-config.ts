import { getExternalSchematic } from '../../../utils/testing';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { Rule, Tree, SchematicContext } from '@angular-devkit/schematics';
import { getDirInTree } from '../../../utils/tree';
import { getParsedDomain } from '../../../utils/domain';
import { updateJsonInTree } from '@nrwl/workspace';
import { updateStorybookTargets } from './update-storybook-targets';

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
    }),
    moveStorybookConfig(application, domain, libraries[0]),
    updatePathInConfigJs(application, domain),
    updateTsConfig(application, domain),
    updateStorybookTargets(application, domain, libraryName),
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

const updatePathInConfigJs = (application: string, domain: string): Rule => {
  return (tree: Tree, _context: SchematicContext) => {
    const configJs = tree.read(
      `libs/${application}/${domain}/.storybook/config.js`
    );
    const configJsString = configJs.toString();
    const updatedConfigJs = configJsString.replace(
      /configure\(.*;/,
      `configure([require.context('../feature', true, /\.stories\.js$/), require.context('../ui', true, /\.stories\.js$/)], module);`
    );
    tree.overwrite(
      `libs/${application}/${domain}/.storybook/config.js`,
      updatedConfigJs
    );
    return tree;
  };
};

const updateTsConfig = (application: string, domain: string): Rule =>
  updateJsonInTree(
    `libs/${application}/${domain}/.storybook/tsconfig.json`,
    (json) => {
      const componentFolders = ['feature', 'ui'];
      json.exclude = componentFolders.map(
        (folder) => `../${folder}/**/*.spec.ts`
      );
      json.include = componentFolders.map((folder) => `../${folder}/src/**/*`);
      return json;
    }
  );
