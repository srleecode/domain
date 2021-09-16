import {
  Tree,
  convertNxGenerator,
  addDependenciesToPackageJson,
  installPackagesTask,
} from '@nrwl/devkit';

export async function ngAddGenerator(tree: Tree) {
  const nrwlVersion = '12.9.0';
  addDependenciesToPackageJson(
    tree,
    {},
    {
      '@nrwl/angular': nrwlVersion,
      '@nrwl/cypress': nrwlVersion,
      '@jscutlery/cypress-angular': '0.5.1',
      '@jscutlery/cypress-harness': '0.3.6',
      '@angular/cdk': '12.2.3',
      'cypress-pipe': '2.0.0',
    }
  );
  return () => {
    installPackagesTask(tree);
  };
}

export default ngAddGenerator;

export const ngAddSchematic = convertNxGenerator(ngAddGenerator);
