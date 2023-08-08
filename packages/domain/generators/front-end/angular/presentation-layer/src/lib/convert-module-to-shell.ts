import { Tree } from '@nx/devkit';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  getDasherizedFolderPath,
  getDomainPath,
} from '../../../../../shared/utils';
import { classify } from '@nx/workspace/src/utils/strings';

export const convertModuleToShell = (
  tree: Tree,
  groupingFolder: string,
  libraryName: string
) => {
  const dasherisedGroupingFolder = getDasherizedFolderPath(
    tree,
    groupingFolder
  );
  const classifiedDomain = classify(
    getDomainPath(tree, groupingFolder).replace('/', '-')
  );
  const modulePath = `${groupingFolder}/${libraryName}/src/lib/${dasherisedGroupingFolder}-${libraryName}.module.ts`;
  tree.write(
    modulePath,
    tree
      .read(modulePath)
      .toString()
      .replace(`${classifiedDomain}Presentation`, `${classifiedDomain}Shell`)
  );
  tree.rename(
    modulePath,
    `${groupingFolder}/${libraryName}/src/lib/${dasherisedGroupingFolder}-shell.module.ts`
  );
  updateModuleReference(tree, groupingFolder, libraryName);
};

const updateModuleReference = (
  tree: Tree,
  groupingFolder: string,
  libraryName: string
) => {
  const indexPath = `${groupingFolder}/${libraryName}/src/index.ts`;
  tree.write(
    indexPath,
    tree.read(indexPath).toString().replace(`presentation`, `shell`)
  );
};
