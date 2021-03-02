import { Tree, updateJson, generateFiles } from '@nrwl/devkit';
import { names } from '@nrwl/workspace';
import { getParsedDomain } from '../../shared/utils/domain';
import {
  createInTree,
  deleteInTree,
  existsInTree,
  overwriteInTree,
} from '../../shared/utils/tree';
import { getTsConfigPath } from '../../shared/utils/tsconfig';
import * as path from 'path';

export const createComponentCommand = (
  tree: Tree,
  application: string,
  domain: string,
  filesPath: string
): void => {
  createComponentCommandFile(tree, application, domain, filesPath);
  createPublicApiTs(tree, application, domain);
  updateTsConfig(tree, application, domain);
  deleteCommandFile(tree, application, domain);
  updateIndexFile(tree, application, domain);
};

export const createComponentCommandFile = (
  tree: Tree,
  application: string,
  domain: string,
  filesPath: string
): void => {
  const name = `${application}-${getParsedDomain(domain)}`;
  const target = `libs/${application}/${domain}/.cypress/src/support`;
  const templateOptions = {
    ...names(name),
    tmpl: '',
  };
  generateFiles(tree, path.join(__dirname, filesPath), target, templateOptions);
};

export const createPublicApiTs = (
  tree: Tree,
  application: string,
  domain: string
): void => {
  const publicApiFilePath = `libs/${application}/${domain}/.cypress/src/public-api.ts`;
  if (!existsInTree(tree, publicApiFilePath))
    createInTree(
      tree,
      publicApiFilePath,
      `import './support/component-command';
export * from './support/component-command';`
    );
};

export const updateTsConfig = (
  tree: Tree,
  application: string,
  domain: string
): void =>
  updateJson(tree, getTsConfigPath(tree), (json) => {
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

const deleteCommandFile = (tree: Tree, application: string, domain: string) =>
  deleteInTree(
    tree,
    `libs/${application}/${domain}/.cypress/src/support/commands.ts`
  );

const updateIndexFile = (tree: Tree, application: string, domain: string) =>
  overwriteInTree(
    tree,
    `libs/${application}/${domain}/.cypress/src/support/index.ts`,
    `import './component-command';
import '@srleecode/component-command-utils';`
  );
