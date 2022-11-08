import { downloadFromFeed } from '../services/file.service'
import Playlist from '../interfaces/Playlist'

const download = (selectedFeed: Playlist, path: string): void => {
  downloadFromFeed(selectedFeed, path)
}

export {
  download
}
