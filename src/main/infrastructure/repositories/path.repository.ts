import { injectable } from 'inversify'
import { IPathRepository } from '../../domain/repository/pathRepository.interface'
import { FileVo } from '../../domain/valueObjects/file.vo'
import { ExtensionVo } from '../../domain/valueObjects/extension.vo'
import { PlaylistVo } from '../../domain/valueObjects/playlist.vo'
import { FileExtensions } from '../../domain/constants/fileExtensions.enum'

@injectable()
export class PathRepository implements IPathRepository {
  getFileName (path: string): FileVo {
    // Return file name from system path
    return new FileVo(path.split('/').pop() || '')
  }

  getExtension (playlist: PlaylistVo): ExtensionVo {
    return new ExtensionVo(playlist.value.url === 'audio_only' || playlist.value.codecs.startsWith('mp4a') ? FileExtensions.MP3 : FileExtensions.MP4)
  }
}
