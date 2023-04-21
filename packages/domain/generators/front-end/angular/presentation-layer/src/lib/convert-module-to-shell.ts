import { Tree } from '@nrwl/devkit';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  getDasherizedFolderPath,
  getDomainPath,
} from '../../../../../shared/utils';
import { classify } from '@nrwl/workspace/src/utils/strings';

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
};
