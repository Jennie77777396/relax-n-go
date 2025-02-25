import type { Config } from 'payload'

import type { NestedKeysStripped } from '@payloadcms/translations'

/**
 * Property 'translations' does not exist on type 'I18nOptions<{} | { authentication: {
 * account: string; accountOfCurrentUser: string; accountVerified: string; alreadyActivated: string;
 * alreadyLoggedIn: string; apiKey: string; authenticated: string;
 * ... 59 more ...; youDidNotRequestPassword: string; };
 * ... 7 more ...; version: { ...; }; }> | undefined'.ts(2339)
 */
// @ts-expect-error Property 'translations' does not exist
export const translations: Config['i18n']['translations'] = {
    en: {},
    es: {},
}

export type CustomTranslationsObject = (typeof translations)[keyof typeof translations]
export type CustomTranslationsKeys = NestedKeysStripped<CustomTranslationsObject>
