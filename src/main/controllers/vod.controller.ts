import { downloadFromFeed } from '../services/file.service'
import Playlist from '../interfaces/Playlist'

const download = async (selectedFeed: Playlist, path: string): Promise<boolean> => {
  return await downloadFromFeed(selectedFeed, path)
}

export {
  download
}
