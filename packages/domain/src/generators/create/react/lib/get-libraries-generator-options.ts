import { LibrariesGeneratorSchema } from '../../../libraries/schema';
import { CreateGeneratorSchema } from '../schema';

export const getLibrariesGneratorSchema = (
  schema: CreateGeneratorSchema
): LibrariesGeneratorSchema => ({
  application: schema.application,
  domain: schema.domain,
  prefix: schema.prefix,
  libraries: schema.libraries,
  style: schema.style,
  routing: schema.routing,
});
