import { Tree } from '@nrwl/devkit';

export const addBaseComponentDeclaration = (
  tree: Tree,
  componentFilePath: string,
  componentClassName: string
) => {
  const file = tree.read(componentFilePath).toString();
  const newFile = file.replace(
    /declarations:.*\[/i,
    `declarations: [${componentClassName}, `
  );
  tree.write(componentFilePath, newFile);
};
