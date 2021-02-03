import { NrwlCypressSchematicSchema } from '../model/nrwl-cypress-schematic-schema.model';
import { Rule } from '@angular-devkit/schematics';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { Linter } from '../../shared/model/linter.enum';
import { cypressProjectSchematic } from '@nrwl/cypress/src/generators/cypress-project/cypress-project';

export const createCypressProject = (
  application: string,
  domain: string,
  lint: Linter,
  projectType: CypressProject
): Rule =>
  cypressProjectSchematic(
    getNrwlCypressSchematicSchema(application, domain, lint, projectType)
  );

const getNrwlCypressSchematicSchema = (
  application: string,
  domain: string,
  lint: Linter,
  projectType: CypressProject
): NrwlCypressSchematicSchema => {
  let name = '';
  let directory = `${projectType}/${application}`;
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
    linter: lint,
  };
};
