import { Dispatch, StateUpdater } from 'preact/hooks'

export type Config = {
  theme: string
  language: string
  download_folder: string
  open_on_download: string
}

export const DEFAULT_FILE_NAME = 'download.mp4'
export type DOWNLOAD_COMMANDS =
  | 'download_vod'
  | 'download_clip'
  | 'download_live'
export const DEFAULT_DOWNLOAD_COMMAND: DOWNLOAD_COMMANDS = 'download_vod'

export const DEFAULT_ACTIVE_TAB = 'General'
export const DEFAULT_LANGUAGE = 'en'
export const DEFAULT_OPEN_ON_DOWNLOAD = 'dont-open'
export const DEFAULT_THEME = 'light'

export type SetConfig = Dispatch<StateUpdater<Config | null>>
