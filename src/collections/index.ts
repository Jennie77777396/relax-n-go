import * as relax from './relax'
import * as payload from './payload'
import { CollectionConfig } from 'payload'
import { Users } from './Users'
import { Media } from './Media'
export { Users }
export const collections: CollectionConfig[] = Object.values({
  ...relax,
  ...payload,
  Media,
  Users,
}) as unknown as CollectionConfig[]
