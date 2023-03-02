import { getLibraryName } from './get-library-name';

describe('getLibraryName', () => {
  it('should return name and type', () => {
    expect(
      getLibraryName({
        name: 'test-example',
        type: 'feature',
      })
    ).toBe('feature-test-example');
  });
});
