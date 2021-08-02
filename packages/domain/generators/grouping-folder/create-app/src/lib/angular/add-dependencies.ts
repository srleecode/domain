import {
  addDependenciesToPackageJson,
  GeneratorCallback,
  Tree,
} from '@nrwl/devkit';

export const addDependencies = (tree: Tree): GeneratorCallback => {
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      '@jscutlery/cypress-angular': 'latest',
      '@jscutlery/cypress-harness': 'latest',
      '@angular/cdk': 'latest',
      'cypress-pipe': 'latest',
    }
  );
};
