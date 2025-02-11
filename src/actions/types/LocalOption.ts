import { Where, TypedLocale, JoinQuery, FindArgs } from 'payload'

export interface LocalOption<TData, TSelect> {
  collction: string
  data?: Partial<TData>

  context?: RequestContext
  currentDepth?: number
  depth?: number
  disableErrors?: boolean
  draft?: boolean
  fallbackLocale?: false | TypedLocale
  includeLockStatus?: boolean
  joins?: JoinQuery<TSlug>
  limit?: number
  locale?: 'all' | TypedLocale
  overrideAccess?: boolean
  page?: number
  pagination?: boolean
  populate?: PopulateType
  req?: Partial<PayloadRequest>
  select?: TSelect
  showHiddenFields?: boolean
  sort?: Sort
  user?: Document
  where?: Where
}
