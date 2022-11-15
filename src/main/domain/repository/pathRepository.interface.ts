import { FileVo } from '../valueObjects/file.vo'
import { ExtensionVo } from '../valueObjects/extension.vo'
import { PlaylistVo } from '../valueObjects/playlist.vo'
import { PathVo } from '../valueObjects/path.vo'

export interface IPathRepository {
  getFileName: (path: PathVo) => FileVo
  getExtension: (playlist: PlaylistVo) => ExtensionVo
}
