import { ValueObject } from './valueObject'
import { VOFormatException } from '../errors/voFormatException'
import Playlist from '../../infrastructure/types/Playlist'

export class PlaylistVo extends ValueObject<Playlist> {
  public equals (valueObject: PlaylistVo): boolean {
    return this.value === valueObject.value
  }

  protected assertIsValid (value: Playlist): void {
    if (Object.keys(value).length === 0) {
      throw new VOFormatException(PlaylistVo.name, value)
    }
  }

  public setVideo (video: string): void {
    this.value.video = video === 'chunked' ? 'Original' : video
  }
}
