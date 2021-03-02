import { Tree } from '@nrwl/devkit';
import { overwriteInTree, readInTree } from '../../shared/utils/tree';

export const updateStorybookWebpackBasePath = (
  tree: Tree,
  application: string,
  domain: string
): void => {
  const jsFilePath = `libs/${application}/${domain}/.storybook/webpack.config.js`;
  const webpackConfigJs = readInTree(tree, jsFilePath);
  if (webpackConfigJs) {
    const webpackConfigJsString = webpackConfigJs.toString();
    const updatedWebpackConfigJs = webpackConfigJsString.replace(/\.\.\//, '');
    overwriteInTree(tree, jsFilePath, updatedWebpackConfigJs);
  } else {
    throw new Error('storybook webpack config js could not be found');
  }
};
