import { Tree, SchematicContext } from '@angular-devkit/schematics';

export const updateStorybookWebpackBasePath = (
  application: string,
  domain: string
) => (tree: Tree, _context: SchematicContext): Tree => {
  const jsFilePath = `libs/${application}/${domain}/.storybook/webpack.config.js`;
  const webpackConfigJs = tree.read(jsFilePath);
  const webpackConfigJsString = webpackConfigJs.toString();
  const updatedWebpackConfigJs = webpackConfigJsString.replace(/\.\.\//, '');
  tree.overwrite(jsFilePath, updatedWebpackConfigJs);
  return tree;
};
