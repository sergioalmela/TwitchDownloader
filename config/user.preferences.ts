import path from 'path'
import fs from 'fs'
import { app, Menu } from 'electron'
import ElectronPreferences from 'electron-preferences'
import { i18n } from './i18n.config'
import { preferencesPath, languages } from './config'

let defaultLanguage = 'en'
try {
  const settings = fs.readFileSync(preferencesPath, 'utf8')
  const settingsJson = JSON.parse(settings)
  defaultLanguage = settingsJson?.global?.language !== undefined ? settingsJson.global.language : 'en'
} catch (ignored) {}

// We don't have the preferences yet, so we need to set the default language
i18n.configure({
  directory: path.join(__dirname, '..', 'locales'),
  defaultLocale: defaultLanguage
})

const preferences = new ElectronPreferences({
  /**
   * Where should preferences be saved?
   */
  dataStore: path.resolve(app.getPath('userData'), 'preferences.json'),
  /**
   * Default values.
   */
  defaults: {
    global: {
      language: 'en'
    },
    downloader: {
      defaultDownloadFolder: '',
      openFolderOnDownload: false
    }
  },
  /**
   * The preferences window is divided into sections. Each section has a label, an icon, and one or
   * more fields associated with it. Each section should also be given a unique ID.
   */
  sections: [
    {
      id: 'global',
      label: i18n.__('General'),
      /**
       * See the list of available icons below.
       */
      icon: 'home-52',
      form: {
        groups: [
          {
            /**
             * Group heading is optional.
             */
            fields: [
              {
                label: i18n.__('Language'),
                key: 'language',
                type: 'dropdown',
                options: [
                  // Iterate languages object and set label and value
                  ...Object.keys(languages).map((key) => {
                    return {
                      label: i18n.__(languages[key].name),
                      value: languages[key].iso2
                    }
                  })
                ]
              },
              {
                label: i18n.__('Restart'),
                key: 'resetButton',
                type: 'button',
                buttonLabel: i18n.__('Click to restart'),
                help: i18n.__('Restart is required to apply the changes'),
                hideLabel: false
              }
            ]
          }
        ]
      }
    },
    {
      id: 'downloader',
      label: i18n.__('Downloads'),
      icon: 'square-download',
      form: {
        groups: [
          {
            fields: [
              {
                label: i18n.__('Default download folder'),
                key: 'defaultDownloadFolder',
                type: 'directory',
                help: i18n.__('The location where your downloads will be saved'),
                multiSelections: false,
                noResolveAliases: false,
                treatPackageAsDirectory: false,
                dontAddToRecent: true
              },
              {
                label: i18n.__('Open folder on download'),
                key: 'openFolderOnDownload',
                type: 'dropdown',
                options: [
                  { label: i18n.__('Open folder'), value: true },
                  { label: i18n.__('Dont open folder'), value: false }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      id: 'ui',
      label: i18n.__('Appearance'),
      /**
       * See the list of available icons below.
       */
      icon: 'brightness-6',
      form: {
        groups: [
          {
            /**
             * Group heading is optional.
             */
            fields: [
              {
                label: i18n.__('Theme'),
                key: 'darkMode',
                type: 'radio',
                options: [
                  { label: i18n.__('Light'), value: false },
                  { label: i18n.__('Dark'), value: true }
                ]
              }
            ]
          }
        ]
      }
    }
  ],
  /**
   * These parameters on the preference window settings can be overwritten
   */
  browserWindowOpts: {
    title: i18n.__('Twitch Downloader Preferences'),
    width: 900,
    maxWidth: 1000,
    height: 700,
    maxHeight: 1000,
    resizable: true,
    maximizable: false
    // ...
  },
  /**
   * These parameters create an optional menu bar
   */
  menu: Menu.buildFromTemplate([
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }
      ]
    }
  ])
})

preferences.on('click', (key) => {
  if (key === 'resetButton') {
    app.relaunch()
    app.exit()
  }
})

export default preferences
