export default interface Playlist {
  video: string
  quality: string | null
  url: string
  framerate: number | null
  bandwidth: number
  codecs: string
}
