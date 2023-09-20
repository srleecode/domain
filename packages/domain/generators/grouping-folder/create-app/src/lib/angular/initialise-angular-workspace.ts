import { Tree } from '@nx/devkit';
import { cypressInitGenerator } from '@nx/cypress';
import { angularInitGenerator } from '@nx/angular/generators';

export const initialiseAngularWorkspace = async (tree: Tree): Promise<void> => {
  await angularInitGenerator(tree, {
    style: 'scss',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  await cypressInitGenerator(tree, {});
};
