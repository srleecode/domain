import { SchematicContext, Rule, Tree } from '@angular-devkit/schematics';
import { readInTree } from '../../../utils/tree';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { getModuleFilePath } from './get-module-file-path';
import { InsertChange } from '@nrwl/workspace';
import { classify, dasherize } from '@nrwl/workspace/src/utils/strings';
import * as ts from 'typescript';
import {
  getDecoratorInsertChanges,
  getDecoratorMetadata,
} from '../../../utils/ast';
import { DecoratorProperty } from '../../shared/model/decorator-property.model';
import { DecoratorMetadata } from '../../shared/model/decorator-metadata.model';

export const addComponentToModule = (
  application: string,
  domain: string,
  componentName: string,
  libraryType: DomainLibraryName,
  isExported: boolean
): Rule => (tree: Tree, context: SchematicContext): Tree => {
  const moduleFilePath = getModuleFilePath(
    application,
    domain,
    libraryType,
    tree,
    context.logger
  );
  const componentClassName = `${classify(componentName)}Component`;
  const moduleFile = readInTree(tree, moduleFilePath);
  const source = ts.createSourceFile(
    moduleFilePath,
    moduleFile.toString('utf-8'),
    ts.ScriptTarget.Latest,
    true
  );
  const decoratorMetaData = getDecoratorMetadata(source);

  let changes = [
    new InsertChange(
      moduleFilePath,
      0,
      `import { ${componentClassName} } from './${dasherize(
        componentName
      )}/${dasherize(componentName)}.component';`
    ),
    getAddToDecoratorPropertyChanges(
      decoratorMetaData,
      'declarations',
      componentClassName,
      moduleFilePath
    ),
  ];
  if (isExported) {
    changes.push(
      getAddToDecoratorPropertyChanges(
        decoratorMetaData,
        'exports',
        componentClassName,
        moduleFilePath
      )
    );
  }
  changes = changes.filter((change) => !!change);
  const updateRecorder = tree.beginUpdate(moduleFilePath);
  changes.forEach((change) => {
    if (change instanceof InsertChange) {
      updateRecorder.insertLeft(change.pos, change.toAdd);
    }
  });

  tree.commitUpdate(updateRecorder);

  return tree;
};

const getAddToDecoratorPropertyChanges = (
  decoratorMetadata: DecoratorMetadata,
  propertyName: 'declarations' | 'exports',
  componentClassName: string,
  moduleFilePath: string
): InsertChange => {
  const property = decoratorMetadata.properties.find(
    (prop) => prop.name === propertyName
  );
  if (!isPropertyHavingClass(property, componentClassName)) {
    return getDecoratorInsertChanges(
      decoratorMetadata,
      moduleFilePath,
      componentClassName,
      propertyName
    );
  }
};

const isPropertyHavingClass = (
  property: DecoratorProperty,
  className: string
): boolean =>
  property && (property.value || []).some((value) => value === className);
