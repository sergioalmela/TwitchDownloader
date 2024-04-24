import ThemeProvider from './components/ThemeProvider'
import Form from './components/Form.tsx'

import i18next from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import enTranslations from './locales/en.json'
import esTranslations from './locales/es.json'

i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations
    },
    es: {
      translation: esTranslations
    }
  },
  lng: 'es',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
})

function App() {
  return (
    <I18nextProvider i18n={i18next}>
      <ThemeProvider>
        <div className="bg-white flex flex-col items-center justify-center h-full">
          <div>
            <img
              src="/logo.png"
              className="h-[10em] p-[1.5em] transition-[0.75s] will-change-filter"
              alt="Twitch Downloader Logo"
            />
          </div>

          <Form />
        </div>
      </ThemeProvider>
    </I18nextProvider>
  )
}

export default App
