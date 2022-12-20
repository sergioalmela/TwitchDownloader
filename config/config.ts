import path from 'path'
import { app } from 'electron'

const preferencesPath = path.resolve(app.getPath('userData'), 'preferences.json')

export {
  preferencesPath
}
