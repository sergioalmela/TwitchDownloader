import { createContext } from 'preact'
import { Config, SetConfig } from './types.ts'

export type ConfigContextType = {
  config: Config | null
  setConfig: SetConfig | null
}

export const ConfigContext = createContext<ConfigContextType | null>(null)
