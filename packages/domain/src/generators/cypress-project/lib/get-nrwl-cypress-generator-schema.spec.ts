import { getNrwlCypressSchematicSchema } from './get-nrwl-cypress-generator-schema';
import { CypressProject } from '../../shared/model/cypress-project.enum';
import { Linter } from '../../shared/model/linter.enum';

describe('createCypressProject', () => {
  const application = 'test-application';
  const leafDomain = 'leaf-domain';
  const parentDomain = 'parent-domain/shared';
  const childDomain = 'parent-domain/child-domain';

  it('should generate cypress project with correct directory and name for leaf domain', () => {
    expect(
      getNrwlCypressSchematicSchema(
        application,
        leafDomain,
        Linter.EsLint,
        CypressProject.E2E
      )
    ).toEqual({
      directory: `${CypressProject.E2E}/${application}`,
      js: false,
      linter: Linter.EsLint,
      name: 'leaf-domain',
      project: '',
    });
  });
  it('should generate cypress project with correct directory and name for parent domain', () => {
    expect(
      getNrwlCypressSchematicSchema(
        application,
        parentDomain,
        Linter.EsLint,
        CypressProject.E2E
      )
    ).toEqual({
      directory: `${CypressProject.E2E}/${application}/parent-domain`,
      js: false,
      linter: Linter.EsLint,
      name: 'shared',
      project: '',
    });
  });
  it('should generate cypress project with correct directory and name for child domain', () => {
    expect(
      getNrwlCypressSchematicSchema(
        application,
        childDomain,
        Linter.EsLint,
        CypressProject.E2E
      )
    ).toEqual({
      directory: `${CypressProject.E2E}/${application}/parent-domain`,
      js: false,
      linter: Linter.EsLint,
      name: 'child-domain',
      project: '',
    });
  });
});
