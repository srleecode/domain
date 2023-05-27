import { SchematicsException } from '@angular-devkit/schematics';
import { Tree } from '@nx/devkit';
import { createSourceFile, ScriptTarget, SourceFile } from 'typescript';

export const getTsSourceFile = (host: Tree, path: string): SourceFile => {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`Could not read TS file (${path}).`);
  }
  const content = buffer.toString();
  const source = createSourceFile(path, content, ScriptTarget.Latest, true);
  return source;
};
