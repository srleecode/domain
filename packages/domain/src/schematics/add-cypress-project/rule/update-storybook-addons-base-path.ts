import { Tree, SchematicContext } from '@angular-devkit/schematics';

export const updateStorybookAddonsBasePath = (
  application: string,
  domain: string
) => (tree: Tree, _context: SchematicContext): Tree => {
  const jsFilePath = `libs/${application}/${domain}/.storybook/addons.js`;
  const addonsJs = tree.read(jsFilePath);
  const addonsJsString = addonsJs.toString();
  const updatedAddonsJs = addonsJsString.replace(/\.\.\//, '');
  tree.overwrite(jsFilePath, updatedAddonsJs);
  return tree;
};
