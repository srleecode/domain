import { Tree } from '@nrwl/devkit';

export const removeUneededCypressProjectFiles = (
  tree: Tree,
  projectPath: string
): void => {
  tree.delete(`${projectPath}/src/support/app.po.ts`);
  tree.delete(`${projectPath}/src/support/commands.ts`);
  tree.write(`${projectPath}/src/support/index.ts`, '');
};
