import {
  Tree,
  convertNxGenerator,
  addDependenciesToPackageJson,
  installPackagesTask,
} from '@nrwl/devkit';

export async function ngAddGenerator(tree: Tree) {
  const nrwlVersion = '13.8.8';
  addDependenciesToPackageJson(
    tree,
    {},
    {
      '@nrwl/angular': nrwlVersion,
      '@nrwl/cypress': nrwlVersion,
    }
  );
  return () => {
    installPackagesTask(tree);
  };
}

export default ngAddGenerator;

export const ngAddSchematic = convertNxGenerator(ngAddGenerator);
