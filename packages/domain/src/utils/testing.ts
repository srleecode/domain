import { join } from 'path';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { externalSchematic } from '@angular-devkit/schematics';

export const testRunner = new SchematicTestRunner(
  '@srleecode/domain',
  join(__dirname, '../../collection.json')
);

export const emptyRule = (options: any): Rule => (
  tree: Tree,
  _context: SchematicContext
) => tree;

export const getExternalSchematic = (
  plugin: string,
  schematic: string,
  options: any
): Rule => externalSchematic(plugin, schematic, options);
