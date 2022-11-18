export default interface Playlist {
  video: string
  quality: object | null
  url: string
  framerate: number | null
  bandwidth: number
  codecs: string
}
