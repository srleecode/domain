import { Tree } from '@nrwl/devkit';

export const addBaseComponentToTemplate = (
  tree: Tree,
  componentFilePath: string,
  selector: string
) => {
  const templateFilePath = componentFilePath.replace('.ts', '.html');
  const file = tree.read(templateFilePath).toString();
  const newFile = `<${selector}-base>${file}</${selector}-base>`;
  tree.write(templateFilePath, newFile);
};
