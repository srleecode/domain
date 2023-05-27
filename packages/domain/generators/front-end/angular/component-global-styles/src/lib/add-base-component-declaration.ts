import { Tree } from '@nx/devkit';

export const addBaseComponentDeclaration = (
  tree: Tree,
  componentFilePath: string,
  componentClassName: string
) => {
  const file = tree.read(componentFilePath).toString();
  const newFile = file.includes('imports')
    ? file.replace(/imports:.*\[/i, `imports: [${componentClassName}, `)
    : file.replace('})', `imports: [${componentClassName}] })`);
  tree.write(componentFilePath, newFile);
};
