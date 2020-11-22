import { toPascalCase } from './text';

const strings = {
  camel: 'thisIsAString',
  dash: 'this-is-a-string',
  pascal: 'ThisIsAString',
};

describe('toPascalCase', function () {
  for (const key in strings) {
    it('should convert ' + key + ' case', function () {
      expect(toPascalCase(strings[key])).toBe('ThisIsAString');
    });
  }
});
