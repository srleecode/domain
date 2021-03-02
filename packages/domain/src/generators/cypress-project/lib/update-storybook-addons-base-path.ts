import { Tree } from '@nrwl/devkit';
import { isTwoLevelDomain } from '../../shared/utils/domain';
import { overwriteInTree, readInTree } from '../../shared/utils/tree';

export const updateStorybookAddonsBasePath = (
  tree: Tree,
  application: string,
  domain: string
): void => {
  const jsFilePath = `libs/${application}/${domain}/.storybook/addons.js`;
  const addonsJs = readInTree(tree, jsFilePath);

  if (addonsJs) {
    const addonsJsString = addonsJs.toString();
    const updatedAddonsJs = addonsJsString.replace(/\.\.\//, '');
    overwriteInTree(tree, jsFilePath, updatedAddonsJs);
  } else {
    const mainJsFilePath = `libs/${application}/${domain}/.storybook/main.js`;
    const mainJs = readInTree(tree, mainJsFilePath);
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
};
