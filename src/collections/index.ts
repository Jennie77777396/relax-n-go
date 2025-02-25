import * as relax from './relax'
import * as payload from './payload'
import { CollectionConfig } from 'payload'
import { Users } from './Users'
import { Media } from './Media'
import * as auth from './auth'
export { Users }

export const collections: CollectionConfig[] = Object.values({
  ...relax,
  ...payload,
  ...auth,
  Media,
  Users,
}) as unknown as CollectionConfig[]
