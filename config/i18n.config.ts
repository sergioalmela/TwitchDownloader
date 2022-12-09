import { I18n } from 'i18n'
import path from 'path'
import fs from 'fs'

// Import locales to compile them
/* eslint-disable @typescript-eslint/no-unused-vars */
import settings from './user.config.json'
import en from '../locales/en.json'
import es from '../locales/es.json'
/* eslint-enable @typescript-eslint/no-unused-vars */

const i18n = new I18n({
  locales: ['en', 'es'],
  defaultLocale: settings.language,
  directory: path.join('./', 'locales')
})

const setLocale = (locale: string): void => {
  settings.language = locale
  fs.writeFileSync(path.join(__dirname, 'user.config.json'), JSON.stringify(settings))
}

export { i18n, setLocale }
