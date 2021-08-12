import {
  applyChangesToString,
  Tree,
  ChangeType,
  StringChange,
} from '@nrwl/devkit';
import { getModuleFilePath } from './get-module-file-path';
import { classify, dasherize } from '@nrwl/workspace/src/utils/strings';
import * as ts from 'typescript';
import { DomainLibraryName } from '../../shared/model/domain-library-name.enum';
import { readInTree } from '../../shared/utils/tree';
import { DecoratorMetadata } from '../../shared/model/decorator-metadata.model';
import { DecoratorProperty } from '../../shared/model/decorator-property.model';
import {
  getDecoratorInsertChanges,
  getDecoratorMetadata,
} from '../../shared/utils/ast';

export const addComponentToModule = (
  application: string,
  domain: string,
  componentName: string,
  libraryType: DomainLibraryName,
  isExported: boolean,
  tree: Tree
): void => {
  const moduleFilePath = getModuleFilePath(
    tree,
    application,
    domain,
    libraryType
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
  let changes: StringChange[] = [
    {
      type: ChangeType.Insert,
      index: 0,
      text: `import { ${componentClassName} } from './${dasherize(
        componentName
      )}/${dasherize(componentName)}.component';`,
    },
    getAddToDecoratorPropertyChanges(
      decoratorMetaData,
      'declarations',
      componentClassName
    ),
  ];
  if (isExported) {
    changes.push(
      getAddToDecoratorPropertyChanges(
        decoratorMetaData,
        'exports',
        componentClassName
      )
    );
  }
  changes = changes.filter((change) => !!change);
  const newContents = applyChangesToString(source.getText(), changes);
  tree.write(moduleFilePath, newContents);
};

const getAddToDecoratorPropertyChanges = (
  decoratorMetadata: DecoratorMetadata,
  propertyName: 'declarations' | 'exports',
  componentClassName: string
): StringChange => {
  const property = decoratorMetadata.properties.find(
    (prop) => prop.name === propertyName
  );
  if (!isPropertyHavingClass(property, componentClassName)) {
    return getDecoratorInsertChanges(
      decoratorMetadata,
      componentClassName,
      propertyName
    );
  }
};

const isPropertyHavingClass = (
  property: DecoratorProperty,
  className: string
): boolean =>
  property &&
  ((property.value as Array<unknown>) || []).some(
    (value) => value === className
  );
