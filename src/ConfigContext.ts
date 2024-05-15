import { createContext } from 'preact'
import { Config } from './types.ts'
import { Dispatch, StateUpdater } from 'preact/hooks'

type ConfigContextType = {
  config: Config | null
  setConfig: Dispatch<StateUpdater<Config>> | null
}

export const ConfigContext = createContext<ConfigContextType | null>(null)
