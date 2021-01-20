import { InsertChange } from '@nrwl/workspace';
import {
  SourceFile,
  Node,
  SyntaxKind,
  Decorator,
  PropertyAssignment,
  isArrayLiteralExpression,
  CallExpression,
} from 'typescript';
import { DecoratorMetadata } from '../schematics/shared/model/decorator-metadata.model';
import { DecoratorProperty } from '../schematics/shared/model/decorator-property.model';
// useful tool to view ast is https://ts-ast-viewer.com/

export const getDecoratorMetadata = (source: SourceFile): DecoratorMetadata => {
  // Get decorator info.
  const decoratorNodes = findNodes(source as Node, SyntaxKind.Decorator);
  const decoratorCallExpression = (decoratorNodes[0] as Decorator)
    .expression as CallExpression;
  const name = decoratorCallExpression.expression.getText();
  const propertiesStart = decoratorCallExpression.arguments[0].pos + 1;
  const properties = findNodes(
    decoratorNodes[0],
    SyntaxKind.PropertyAssignment
  ).map((node: PropertyAssignment) => {
    const decoratorProperty: DecoratorProperty = {
      name: node.name.getText(),
      value: undefined,
      insertStartPosition: node.initializer.getStart(),
    };
    if (isArrayLiteralExpression(node.initializer)) {
      decoratorProperty.insertStartPosition += 1;
      node.initializer.elements.forEach((element) => {
        if (!decoratorProperty.value) {
          decoratorProperty.value = [];
        }
        decoratorProperty.value.push(element.getText());
      });
    } else {
      decoratorProperty.value = node.initializer.getText();
    }
    return decoratorProperty;
  });

  return {
    name,
    propertiesStart,
    properties,
  };
};

export const getDecoratorInsertChanges = (
  decoratorMetadata: DecoratorMetadata,
  moduleFilePath: string,
  className: string,
  property: 'declarations' | 'imports' | 'exports' | 'bootstrap' | 'providers'
): InsertChange => {
  const metaDataProperty = decoratorMetadata.properties.find(
    (prop) => prop.name === property
  );
  if (metaDataProperty) {
    const isClassInProperty = (metaDataProperty.value || []).some(
      (item) => item === className
    );
    if (!isClassInProperty) {
      let textToAdd = className;
      if (metaDataProperty.value) {
        textToAdd += ',';
      }
      return new InsertChange(
        moduleFilePath,
        metaDataProperty.insertStartPosition,
        textToAdd
      );
    }
  } else {
    const textToAdd = `${property}: [${className}],`;
    return new InsertChange(
      moduleFilePath,
      decoratorMetadata.propertiesStart,
      textToAdd
    );
  }
};

const findNodes = (node: Node, kind: SyntaxKind | SyntaxKind[]): Node[] => {
  if (!node) {
    return [];
  }

  const foundNodes: Node[] = [];
  const hasMatch = Array.isArray(kind)
    ? kind.includes(node.kind)
    : node.kind === kind;
  if (hasMatch) {
    foundNodes.push(node);
  }

  for (const child of node.getChildren()) {
    findNodes(child, kind).forEach((node) => {
      foundNodes.push(node);
    });
  }

  return foundNodes;
};
