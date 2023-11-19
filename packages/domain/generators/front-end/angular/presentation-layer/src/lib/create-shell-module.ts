import { Tree } from '@nx/devkit';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  getDasherizedFolderPath,
  getDomainPath,
} from '../../../../../shared/utils';
import { classify } from '@angular-devkit/core/src/utils/strings';

export const createShellModule = (
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
  tree.write(
    `${groupingFolder}/${libraryName}/src/lib/${dasherisedGroupingFolder}-shell.module.ts`,
    `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
})
export class Ng${classifiedDomain}ShellModule {}`
  );
  updateModuleReference(
    tree,
    groupingFolder,
    libraryName,
    dasherisedGroupingFolder
  );
};

const updateModuleReference = (
  tree: Tree,
  groupingFolder: string,
  libraryName: string,
  dasherisedGroupingFolder: string
) => {
  const indexPath = `${groupingFolder}/${libraryName}/src/index.ts`;
  tree.write(
    indexPath,
    tree.read(indexPath).toString() +
      `export * from './lib/${dasherisedGroupingFolder}-shell.module.ts';`
  );
};
