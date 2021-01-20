import { DecoratorProperty } from './decorator-property.model';

export interface DecoratorMetadata {
  name: string;
  propertiesStart: number;
  properties: DecoratorProperty[];
}
