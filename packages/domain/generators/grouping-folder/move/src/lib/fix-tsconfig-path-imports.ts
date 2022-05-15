import { visitNotIgnoredFiles, Tree } from '@nrwl/devkit';
import { getDasherizedFolderPath } from '../../../../shared/utils/src/get-dasherized-folder-path';
import { getWorkspaceLayout } from '../../../../shared/utils/src/get-workspace-layout';

// nrwl move was updating the import tsconfig paths to something like test-app-test-domain-data-access
// when it should be test-app/test-domain/data-access. This fixes the path.
export const fixTsconfigPathImports = (
  tree: Tree,
  movedProjectRoot: string
) => {
  const workspaceLayout = getWorkspaceLayout(tree);
  visitNotIgnoredFiles(
    tree,
    `${workspaceLayout.libsDir}/${movedProjectRoot}`,
    (file) => {
      let contents = tree.read(file, 'utf-8');
      const rootWithoutLibType = movedProjectRoot
        .split('/')
        .slice(0, -1)
        .join('/');
      const dashedMovedRoot = getDasherizedFolderPath(tree, rootWithoutLibType);
      const regex = new RegExp(
        `${workspaceLayout.npmScope}/${dashedMovedRoot}-`,
        'g'
      );
      contents = contents.replace(
        regex,
        `${workspaceLayout.npmScope}/${rootWithoutLibType}/`
      );
      tree.write(file, contents);
    }
  );
};
