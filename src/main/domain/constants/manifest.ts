import { QualityVo } from '../valueObjects/quality.vo'
import Credentials from '../../infrastructure/types/Credential'

const manifestHeaders = (): string => {
  return '#EXTM3U\n #EXT-X-TWITCH-INFO:ORIGIN="s3",B="false",REGION="EU",USER-IP="",SERVING-ID="ccd9bc3e453d48fb83584725c6703ed8",CLUSTER="cloudfront_vod",USER-COUNTRY="",MANIFEST-CLUSTER="cloudfront_vod"'
}

const manifestContent = (qualities: QualityVo[], credentials: Credentials): string => {
  let content = ''
  qualities.forEach((quality: QualityVo) => {
    content += '#EXT-X-MEDIA:TYPE=VIDEO,GROUP-ID="chunked",NAME="936p60",AUTOSELECT=NO,DEFAULT=NO\n' +
            `#EXT-X-STREAM-INF:BANDWIDTH=,CODECS="${DEFAULT_VIDEO_CODEC}",RESOLUTION=${quality.value.quality},VIDEO="${quality.value.quality}",FRAME-RATE=${quality.value.frameRate} \n` +
        `${quality.value.sourceURL}?sig=${credentials.signature}&token=${encodeURIComponent(credentials.value)} \n`
  })

  return content
}

const manifestComplete = (qualities: QualityVo[], credentials: Credentials): string => {
  return manifestHeaders() + manifestContent(qualities, credentials)
}

const DEFAULT_VIDEO_CODEC = 'avc1.4D402A,mp4a.40.2'

export {
  manifestComplete
}
