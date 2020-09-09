import { Linter } from '@nrwl/workspace';
import { getExternalSchematic } from '../../../utils/testing';
import { NrwlCypressSchematicSchema } from '../model/nrwl-cypress-schematic-schema.model';
import { Rule } from '@angular-devkit/schematics';

export const createCypressProject = (
  application: string,
  domain: string,
  linter: Linter
): Rule =>
  getExternalSchematic(
    '@nrwl/cypress',
    'cypress-project',
    getNrwlCypressSchematicSchema(application, domain, linter)
  );

const getNrwlCypressSchematicSchema = (
  application: string,
  domain: string,
  linter: Linter
): NrwlCypressSchematicSchema => {
  let name = '';
  let directory = `e2e/${application}`;
  const splitDomain = domain.split('/');
  if (splitDomain.length === 2) {
    name = splitDomain[1];
    directory += `/${splitDomain[0]}`;
  } else {
    name = splitDomain[0];
  }
  return {
    name,
    directory,
    project: '',
    js: false,
    linter,
  };
};
