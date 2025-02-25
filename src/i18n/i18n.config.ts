import type { Config, Option } from 'payload'
import { isRtlLang } from 'rtl-detect'

import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'
import { fr } from '@payloadcms/translations/languages/fr'
import { he } from '@payloadcms/translations/languages/he'

import { translations } from '@/i18n/custom-translations'

// To add a language
// 1. Add the language to the LOCALES array
// 2. Add the language to the LocaleLabels object
// 3. Add the imported language to the localeTranslations object
// 4. Run the pnpm payload generate:types command
// 5. Add the locale code to the middleware.ts file in the matcher array
// 6. Add the translations to the messages folder

export const LOCALES = ['en', 'es', 'fr', 'he'] as const
export type Locale = (typeof LOCALES)[number]

export const LocaleLabels: Record<Locale, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    he: 'עִברִית',
}
const localeTranslations = {
    en,
    es,
    fr,
    he,
} as const

export const defaultLocale = 'en' as const satisfies Locale

export const payloadLocalizationConfig: Config['localization'] = {
    defaultLocale,
    fallback: true,
    locales: Object.entries(LocaleLabels).map(([code, label]) => ({
        label,
        code,
        rtl: isRtlLang(code),
    })),
}

export const payloadI18nConfig: Config['i18n'] = {
    supportedLanguages: localeTranslations,
    fallbackLanguage: defaultLocale,
    translations,
}

export const nextIntlConfig = {
    defaultLocale,
    locales: LOCALES,
}

export const userLanguageSelect: { options: Option[]; defaultValue: Option } = {
    options: payloadLocalizationConfig.locales.map((locale) => ({
        label: locale.label,
        value: locale.code,
    })),
    defaultValue: defaultLocale,
}
