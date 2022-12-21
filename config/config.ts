import path from 'path'
import { app } from 'electron'

const preferencesPath = path.resolve(app.getPath('userData'), 'preferences.json')

// List of supported languages, with their locale file in /locales
const languages = {
  en: {
    name: 'English',
    iso2: 'en'
  },
  fr: {
    name: 'French',
    iso2: 'fr'
  },
  it: {
    name: 'Italian',
    iso2: 'it'
  },
  de: {
    name: 'German',
    iso2: 'de'
  },
  es: {
    name: 'Spanish',
    iso2: 'es'
  }
}

export {
  preferencesPath,
  languages
}
