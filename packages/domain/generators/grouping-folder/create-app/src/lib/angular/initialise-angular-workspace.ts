import { logger, readJson, Tree } from '@nx/devkit';
import { cypressInitGenerator } from '@nx/cypress';
import { angularInitGenerator } from '@nx/angular/generators';

export const initialiseAngularWorkspace = async (tree: Tree): Promise<void> => {
  const packageJson = readJson(tree, 'package.json');
  if (isPackageAdded('@nx/angular', packageJson)) {
    await angularInitGenerator(tree, {
      style: 'scss',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  } else {
    logger.warn(
      '@nx/angular is not installed. It is used by this library so should be installed'
    );
  }
  if (isPackageAdded('@nx/cypress', packageJson)) {
    await cypressInitGenerator(tree, {});
  } else {
    logger.warn(
      '@nx/angular is not installed. It is used by this library so should be installed'
    );
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPackageAdded = (packageToCheck: string, packageJson: any): boolean =>
  packageJson?.devDependencies?.[packageToCheck];
