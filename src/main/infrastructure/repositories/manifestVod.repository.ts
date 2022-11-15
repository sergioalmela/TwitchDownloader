import { injectable } from 'inversify'
import { ManifestVo } from '../../domain/valueObjects/manifest.vo'
import axios from 'axios'
import { IdVo } from '../../domain/valueObjects/id.vo'
import { IManifestRepository } from '../../domain/repository/manifestRepository.interface'
import Credentials from '../types/Credential'
import {FetchFeedErrorException} from "../errors/fetchFeedError.exception";
import {restrictedHeaders} from "../../domain/constants/restrictedHeaders";
import {QualityVo} from "../../domain/valueObjects/quality.vo";
import {manifestComplete} from "../../domain/constants/manifest";
import {al} from "vitest/dist/types-f302dae9";

@injectable()
export class ManifestVodRepository implements IManifestRepository {
  async getManifest (id: IdVo, credentials: Credentials): Promise<ManifestVo> {
    let response = ''
    try {
      const result = await axios.get(`https://usher.ttvnw.net/vod/${id.value}.m3u8?sig=${credentials.signature}&token=${credentials.value}&allow_source=true&player=twitchweb&allow_spectre=true&allow_audio_only=true`)
      response = result.data
    } catch (error) {
      if (error.response.status === 403) {
        // Restricted content, we can fetch
        try {
          const responseFromRestricted = await axios.get(`https://api.twitch.tv/kraken/videos/${id.value}`, restrictedHeaders())
          response = this.getRestrictedManifest(responseFromRestricted, id, credentials)
        } catch (error) {
          throw new FetchFeedErrorException()
        }
      } else {
        throw new FetchFeedErrorException()
      }
    }

    return new ManifestVo(response)
  }

  getRestrictedManifest (responseFromRestricted: any, id: IdVo, credentials: Credentials): string {
    const baseUrlRaw: string = responseFromRestricted.data.seek_previews_url
    // Get content from baseUrlRaw until second slash (excluding https://)
    const baseUrl: string = baseUrlRaw.split('/').slice(0, 4).join('/')

    const urlType: string = responseFromRestricted.data.broadcast_type === 'highlight' ? `highlight-${id.value}` : 'index-dvr'

    // Add manually the restricted feed options
    const resolutions = responseFromRestricted.data.resolutions
    const framerates = responseFromRestricted.data.fps

    let qualities: QualityVo[] = []
    let response: string = ''
    for (const alias in resolutions) {
      const resolution = resolutions[alias]
      const framerate = framerates[alias]

      const quality = new QualityVo({
        frameRate: framerate,
        quality: alias,
        sourceURL: `${baseUrl}/${alias}/${urlType}.m3u8`
      })
      qualities.push(quality)
    }

    return manifestComplete(qualities, credentials)
  }
}
