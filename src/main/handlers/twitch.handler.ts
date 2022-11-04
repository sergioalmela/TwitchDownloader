// TODO: getAuth method from vod should be placed here

function parseUrl (url: string): string {
  const regex = /(?<=videos\/)(\d+)/g
  const id = url.match(regex)
  return id[0].toString()
}

exports.parseUrl = parseUrl
