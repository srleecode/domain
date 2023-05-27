import { Tree, generateFiles } from '@nx/devkit';
import { join } from 'path';

export const addFiles = (
  tree: Tree,
  basePath: string,
  componentClassName: string,
  selector: string
): void => {
  const templateOptions = {
    selector,
    componentClassName,
    tmpl: '',
  };
  generateFiles(tree, join(__dirname, './files'), basePath, templateOptions);
};
