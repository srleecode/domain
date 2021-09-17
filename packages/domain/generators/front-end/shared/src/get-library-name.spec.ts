import { getLibraryName } from './get-library-name';

describe('getLibraryName', () => {
  it('should return name and type when name is provided', () => {
    expect(
      getLibraryName({
        name: 'test-example',
        type: 'feature',
      })
    ).toBe('feature-test-example');
  });

  it('should return domain name and type when no name is provided', () => {
    expect(
      getLibraryName({
        domainName: 'ng-test-app-test-domain',
        type: 'feature',
      })
    ).toBe('feature');
  });
});
