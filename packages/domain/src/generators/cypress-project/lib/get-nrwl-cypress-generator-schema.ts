import { CypressProject } from '../../shared/model/cypress-project.enum';
import { Linter } from '../../shared/model/linter.enum';
import { NrwlCypressSchematicSchema } from '../model/nrwl-cypress-schematic-schema.model';

export const getNrwlCypressSchematicSchema = (
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
