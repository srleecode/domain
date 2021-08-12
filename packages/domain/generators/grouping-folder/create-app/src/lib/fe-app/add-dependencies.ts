import {
  addDependenciesToPackageJson,
  GeneratorCallback,
  Tree,
} from '@nrwl/devkit';
import { FrontendFramework } from '../model/framework.enum';

const frameworkDependencyMap = {
  angular: {
    '@jscutlery/cypress-angular': 'latest',
    '@jscutlery/cypress-harness': 'latest',
    '@angular/cdk': 'latest',
    'cypress-pipe': 'latest',
  },
  react: {},
};

export const addDependencies = (
  framework: FrontendFramework,
  tree: Tree
): GeneratorCallback => {
  return addDependenciesToPackageJson(
    tree,
    {},
    frameworkDependencyMap[framework]
  );
};
