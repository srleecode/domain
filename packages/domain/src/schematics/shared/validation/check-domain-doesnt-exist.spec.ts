import { checkDomainDoesntExist } from './check-domain-doesnt-exist';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import * as domainUtils from '../../../utils/domain';

describe('checkDomainDoesntExist', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'test-domain';

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
  });

  it('should throw SchematicException when domain exists', () => {
    jest.spyOn(domainUtils, 'isDomainExisting').mockReturnValue(true);
    expect(() =>
      checkDomainDoesntExist(application, domain, appTree)
    ).toThrowError(
      new SchematicsException(`${application}/${domain} already exists`)
    );
  });
  it('should not throw SchematicException when domain does not exist', () => {
    jest.spyOn(domainUtils, 'isDomainExisting').mockReturnValue(false);
    expect(() =>
      checkDomainDoesntExist(application, domain, appTree)
    ).not.toThrowError();
  });
});
