import {
  Rule,
  Tree,
  SchematicContext,
  apply,
  url,
  move,
  mergeWith,
  template,
  forEach,
  FileEntry,
} from '@angular-devkit/schematics';
import { strings, normalize } from '@angular-devkit/core';
import { toPascalCase } from '../../../../src/utils/text';
import { getParsedDomain } from '../../../../src/utils/domain';
import { updateJsonInTree } from '@nrwl/workspace';
import { getTsConfigPath } from '../../../../src/utils/tsconfig';
import {
  createInTree,
  deleteInTree,
  existsInTree,
  overwriteInTree,
} from '../../../utils/tree';

export const createComponentCommand = (
  application: string,
  domain: string,
  filesPath: string
): Rule[] => {
  return [
    createComponentCommandFile(application, domain, filesPath),
    createPublicApiTs(application, domain),
    updateTsConfig(application, domain),
    deleteCommandFile(application, domain),
    updateIndexFile(application, domain),
  ];
};

export const createComponentCommandFile = (
  application: string,
  domain: string,
  filesPath: string
): Rule => (tree: Tree, _context: SchematicContext) => {
  const rule = mergeWith(
    apply(url(filesPath), [
      template({
        camelize: strings.camelize,
        classify: strings.classify,
        dasherize: strings.dasherize,
        name: toPascalCase(`${application}-${getParsedDomain(domain)}`),
      }),
      move(normalize(`libs/${application}/${domain}/.cypress/src/support`)),
      forEach((fileEntry: FileEntry) => {
        const pathWithoutTemplateSuffix = fileEntry.path.replace(
          '.template',
          ''
        );
        if (!existsInTree(tree, pathWithoutTemplateSuffix)) {
          createInTree(tree, pathWithoutTemplateSuffix, fileEntry.content);
        }
        return null;
      }),
    ])
  );

  return rule(tree, _context);
};

export const createPublicApiTs = (
  application: string,
  domain: string
): Rule => (tree: Tree, _context: SchematicContext): Tree => {
  const publicApiFilePath = `libs/${application}/${domain}/.cypress/src/public-api.ts`;
  if (!existsInTree(tree, publicApiFilePath))
    createInTree(
      tree,
      publicApiFilePath,
      `import './support/component-command';
export * from './support/component-command';`
    );
  return tree;
};

export const updateTsConfig = (application: string, domain: string): Rule => (
  tree: Tree,
  _context: SchematicContext
): Rule =>
  updateJsonInTree(getTsConfigPath(tree), (json) => {
    if (!json.compilerOptions) {
      json.compilerOptions = {};
      if (!json.compilerOptions.paths) {
        json.compilerOptions.paths = {};
      }
    }
    json.compilerOptions.paths[`@cypress/${application}/${domain}`] = [
      `libs/${application}/${domain}/.cypress/src/public-api.ts`,
    ];
    return json;
  });

const deleteCommandFile = (application: string, domain: string): Rule => (
  tree: Tree,
  _context: SchematicContext
) => {
  deleteInTree(
    tree,
    `libs/${application}/${domain}/.cypress/src/support/commands.ts`
  );
  return tree;
};

const updateIndexFile = (application: string, domain: string): Rule => (
  tree: Tree,
  _context: SchematicContext
) =>
  overwriteInTree(
    tree,
    `libs/${application}/${domain}/.cypress/src/support/index.ts`,
    `import './component-command';
import '@srleecode/component-command-utils';`
  );
