import {
  Tree,
  convertNxGenerator,
  addDependenciesToPackageJson,
  installPackagesTask,
} from '@nrwl/devkit';

export async function ngAddGenerator(tree: Tree) {
  const nrwlVersion = '13.1.3';
  addDependenciesToPackageJson(
    tree,
    {},
    {
      '@nrwl/angular': nrwlVersion,
      '@nrwl/cypress': nrwlVersion,
      '@jscutlery/cypress-angular': '0.8.4',
      '@jscutlery/cypress-harness': '0.3.9',
      '@angular/cdk': '12.2.6',
      'cypress-pipe': '2.0.0',
    }
  );
  return () => {
    installPackagesTask(tree);
  };
}

export default ngAddGenerator;

export const ngAddSchematic = convertNxGenerator(ngAddGenerator);
