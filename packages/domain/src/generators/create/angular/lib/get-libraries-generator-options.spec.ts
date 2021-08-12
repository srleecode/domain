import { CreateGeneratorSchema } from '../schema';
import { StyleType } from '../../../shared/model/style-type.enum';
import { getLibrariesGneratorSchema } from './get-libraries-generator-options';
import { DomainLibraryName } from '../../../shared/model/domain-library-name.enum';

describe('getLibrariesGneratorSchema', () => {
  const options: CreateGeneratorSchema = {
    application: 'test-application',
    domain: 'test-domain',
    prefix: 'test',
    libraries: [DomainLibraryName.DataAccess, DomainLibraryName.Feature],
    style: StyleType.Scss,
    routing: true,
    buildable: true,
    enableIvy: true,
    publishable: false,
    strict: false,
  };

  it('should return schema for libraries generator', () => {
    expect(getLibrariesGneratorSchema(options)).toEqual({
      application: 'test-application',
      domain: 'test-domain',
      libraries: [DomainLibraryName.DataAccess, DomainLibraryName.Feature],
      prefix: 'test',
      routing: true,
      style: 'scss',
    });
  });
});
