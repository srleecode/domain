import { logger, readJson, Tree } from '@nrwl/devkit';
import { cypressInitGenerator } from '@nrwl/cypress';
import { angularInitGenerator } from '@nrwl/angular/generators';

export const initialiseAngularWorkspace = async (tree: Tree): Promise<void> => {
  const packageJson = readJson(tree, 'package.json');
  if (isPackageAdded('@nrwl/angular', packageJson)) {
    await angularInitGenerator(tree, {
      style: 'scss',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  } else {
    logger.warn(
      '@nrwl/angular is not installed. It is used by this library so should be installed'
    );
  }
  if (isPackageAdded('@nrwl/cypress', packageJson)) {
    await cypressInitGenerator(tree, {});
  } else {
    logger.warn(
      '@nrwl/angular is not installed. It is used by this library so should be installed'
    );
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPackageAdded = (packageToCheck: string, packageJson: any): boolean =>
  packageJson?.devDependencies?.[packageToCheck];
