import { Tree, logger } from '@nx/devkit';

export const printTreeChanges = (tree: Tree): void =>
  logger.info(
    JSON.stringify(
      tree
        .listChanges()
        .map((change) => ({ path: change.path, type: change.type }))
    )
  );
