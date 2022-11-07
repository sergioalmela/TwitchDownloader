const fs = require('fs')
const m3u8stream = require('m3u8stream')

const download = () => {
  m3u8stream('http://somesite.com/link/to/the/playlist.m3u8')
    .pipe(fs.createWriteStream('videofile.mp4'))
}

export {
  download
}
