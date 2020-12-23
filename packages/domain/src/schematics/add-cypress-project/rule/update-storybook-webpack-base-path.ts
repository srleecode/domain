import {
  Tree,
  SchematicContext,
  SchematicsException,
} from '@angular-devkit/schematics';
import { overwriteInTree, readInTree } from '../../../utils/tree';

export const updateStorybookWebpackBasePath = (
  application: string,
  domain: string
) => (tree: Tree, _context: SchematicContext): Tree => {
  const jsFilePath = `libs/${application}/${domain}/.storybook/webpack.config.js`;
  const webpackConfigJs = readInTree(tree, jsFilePath);
  if (webpackConfigJs) {
    const webpackConfigJsString = webpackConfigJs.toString();
    const updatedWebpackConfigJs = webpackConfigJsString.replace(/\.\.\//, '');
    overwriteInTree(tree, jsFilePath, updatedWebpackConfigJs);
  } else {
    throw new SchematicsException(
      'storybook webpack config js could not be found'
    );
  }

  return tree;
};
