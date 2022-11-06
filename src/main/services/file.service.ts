const fs = require('fs')
const m3u8stream = require('m3u8stream')

const download = async (url: string, path: string) => {
  m3u8stream(url)
    .pipe(fs.createWriteStream(path))
}

export {
  download
}
