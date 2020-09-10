import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { Tree, SchematicsException } from '@angular-devkit/schematics';
import { UnitTestTree } from '@angular-devkit/schematics/testing';
import * as domainUtils from '../../../utils/domain';
import { checkDomainExists } from './check-domain-exists';

describe('checkDomainExists', () => {
  let appTree: UnitTestTree;
  const application = 'test-application';
  const domain = 'test-domain';

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty()) as UnitTestTree;
  });

  it('should throw SchematicException when domain does not exist', () => {
    jest.spyOn(domainUtils, 'isDomainExisting').mockReturnValue(false);
    expect(() => checkDomainExists(application, domain, appTree)).toThrowError(
      new SchematicsException(`${application}/${domain} does not exist`)
    );
  });
  it('should not throw SchematicException when domain exists', () => {
    jest.spyOn(domainUtils, 'isDomainExisting').mockReturnValue(true);
    expect(() =>
      checkDomainExists(application, domain, appTree)
    ).not.toThrowError();
  });
});
