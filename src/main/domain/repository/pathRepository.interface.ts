import { FileVo } from '../valueObjects/file.vo'
import { ExtensionVo } from '../valueObjects/extension.vo'
import { PlaylistVo } from '../valueObjects/playlist.vo'

export interface IPathRepository {
  getFileName: (path: string) => FileVo
  getExtension: (playlist: PlaylistVo) => ExtensionVo
}
