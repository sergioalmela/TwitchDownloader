import { PlaylistVo } from '../valueObjects/playlist.vo'

export class PlaylistModel {
  constructor (
    public readonly playlist: PlaylistVo
  ) {
  }

  public static toArray (playlists: PlaylistVo[]): PlaylistModel[] {
    return playlists.map((playlist: PlaylistVo): PlaylistModel => {
      return new PlaylistModel(
        playlist
      )
    })
  }
}
