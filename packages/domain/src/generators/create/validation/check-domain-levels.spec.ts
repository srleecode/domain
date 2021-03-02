import { checkDomainLevels } from './check-domain-levels';

describe('checkDomainLevels', () => {
  const parentDomain = 'parent-domain/shared';
  const childDomain = 'parent-domain/child-domain';
  const leafDomain = 'leaf-domain';
  const invalidDomain = 'parent-domain/shared/child-domain';

  it('should not throw exception when domain is parent', () => {
    expect(() => checkDomainLevels(parentDomain)).not.toThrowError();
  });
  it('should not throw exception when domain is child', () => {
    expect(() => checkDomainLevels(childDomain)).not.toThrowError();
  });
  it('should not throw exception when domain is leaf', () => {
    expect(() => checkDomainLevels(leafDomain)).not.toThrowError();
  });
  it('should throw exception when domain has more than two levels', () => {
    expect(() => checkDomainLevels(invalidDomain)).toThrowError(
      new Error(`Domain has more than two levels, i.e. "/": ${invalidDomain}`)
    );
  });
});
