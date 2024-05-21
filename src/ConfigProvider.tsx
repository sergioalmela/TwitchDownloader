import { ComponentChildren } from 'preact'
import { Config, DEFAULT_LANGUAGE } from './types.ts'
import { invoke } from '@tauri-apps/api/tauri'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import deTranslations from './locales/de.json'
import enTranslations from './locales/en.json'
import esTranslations from './locales/es.json'
import frTranslations from './locales/fr.json'
import itTranslations from './locales/it.json'
import { useEffect, useState } from 'preact/hooks'
import { ConfigContext } from './ConfigContext.ts'

export const ConfigProvider = ({
  children
}: {
  children: ComponentChildren
}) => {
  const [config, setConfig] = useState<Config | null>(null)

  i18next.use(initReactI18next).init({
    resources: {
      de: {
        translation: deTranslations
      },
      en: {
        translation: enTranslations
      },
      es: {
        translation: esTranslations
      },
      fr: {
        translation: frTranslations
      },
      it: {
        translation: itTranslations
      }
    },
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false
    }
  })

  useEffect(() => {
    if (config) {
      i18next.changeLanguage(config.language)
    }
  }, [config])

  useEffect(() => {
    const fetchConfig = async () => {
      const fetchedConfig = await invoke('get_preferences')
      setConfig(fetchedConfig as Config)
    }

    fetchConfig()
  }, [])

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}
