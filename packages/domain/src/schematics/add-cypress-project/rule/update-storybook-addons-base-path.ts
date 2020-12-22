import {
  Tree,
  SchematicContext,
  SchematicsException,
} from '@angular-devkit/schematics';
import { isTwoLevelDomain } from '../../../utils/domain';
import { overwriteInTree } from '../../../utils/tree';

export const updateStorybookAddonsBasePath = (
  application: string,
  domain: string
) => (tree: Tree, _context: SchematicContext): Tree => {
  const jsFilePath = `libs/${application}/${domain}/.storybook/addons.js`;
  const addonsJs = tree.read(jsFilePath);

  if (addonsJs) {
    const addonsJsString = addonsJs.toString();
    const updatedAddonsJs = addonsJsString.replace(/\.\.\//, '');
    tree.overwrite(jsFilePath, updatedAddonsJs);
  } else {
    const mainJsFilePath = `libs/${application}/${domain}/.storybook/main.js`;
    const mainJs = tree.read(mainJsFilePath);
    const mainJsString = mainJs.toString();
    const rootAddOns = isTwoLevelDomain(domain)
      ? '../../../../../.storybook/main.js'
      : '../../../../.storybook/main.js';
    const updatedMainJs = mainJsString.replace(
      /\/\/ rootMain.addons.push\(''\);/,
      `// rootMain.addons.push('${rootAddOns}');`
    );
    overwriteInTree(tree, mainJsFilePath, updatedMainJs);
  }

  return tree;
};
