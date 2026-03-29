import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import i18next from 'i18next'
import type { ComponentChildren } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { initReactI18next } from 'react-i18next'
import { ConfigContext } from './ConfigContext.ts'
import deTranslations from './locales/de.json'
import enTranslations from './locales/en.json'
import esTranslations from './locales/es.json'
import frTranslations from './locales/fr.json'
import itTranslations from './locales/it.json'
import ptTranslations from './locales/pt.json'
import { type Config, DEFAULT_LANGUAGE } from './types.ts'

export const ConfigProvider = ({
  children,
}: {
  children: ComponentChildren
}) => {
  const [config, setConfig] = useState<Config | null>(null)

  i18next.use(initReactI18next).init({
    resources: {
      de: {
        translation: deTranslations,
      },
      en: {
        translation: enTranslations,
      },
      es: {
        translation: esTranslations,
      },
      fr: {
        translation: frTranslations,
      },
      it: {
        translation: itTranslations,
      },
      pt: {
        translation: ptTranslations,
      },
    },
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
  })

  useEffect(() => {
    if (config) {
      i18next.changeLanguage(config.language)

      if (config.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [config])

  useEffect(() => {
    const fetchConfig = async () => {
      const fetchedConfig = await invoke('get_preferences')
      setConfig(fetchedConfig as Config)
    }

    fetchConfig()

    const unlisten = listen('preferences-updated', () => {
      fetchConfig()
    })

    return () => {
      unlisten.then((fn) => fn())
    }
  }, [])

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}
