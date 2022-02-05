import { readJson, Tree } from '@nrwl/devkit';
import { addGlobalComponentTestingOptions } from './add-global-component-testing-options/add-global-component-testing-options';
import { cypressInitGenerator } from '@nrwl/cypress';
import { ngAddGenerator } from '@jscutlery/cypress-angular/src/generators/ng-add/ng-add';
import { angularInitGenerator } from '@nrwl/angular/generators';

export const initialiseAngularWorkspace = async (tree: Tree): Promise<void> => {
  const packageJson = readJson(tree, 'package.json');
  if (isPackageAdded('@nrwl/angular', packageJson)) {
    await angularInitGenerator(tree, {
      style: 'scss',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  } else {
    throw Error(
      '@nrwl/angular is not installed. Did you run ng add @srleecode/domain?'
    );
  }
  if (isPackageAdded('@nrwl/cypress', packageJson)) {
    await cypressInitGenerator(tree, {});
  } else {
    throw Error(
      '@nrwl/cypress is not installed. Did you run ng add @srleecode/domain?'
    );
  }
  if (isPackageAdded('@jscutlery/cypress-angular', packageJson)) {
    await ngAddGenerator(tree);
  } else {
    throw Error(
      '@jscutlery/cypress-angular is not installed. Did you run ng add @srleecode/domain?'
    );
  }
  if (!tree.exists(`.component-testing/global-mount-options.constant.ts`)) {
    addGlobalComponentTestingOptions(tree);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPackageAdded = (packageToCheck: string, packageJson: any): boolean =>
  packageJson?.devDependencies?.[packageToCheck];
