import {injectable} from 'inversify'
import {IdVodVo} from '../../domain/valueObjects/idVod.vo'
import {IFeedRepository} from "../../domain/repository/feedRepository.interface";
import {ManifestVo} from "../../domain/valueObjects/manifest.vo";
import axios from "axios";
import Credentials from "../../interfaces/Credentials";

@injectable()
export class FeedRepository implements IFeedRepository {
  async getVodManifest(id: IdVodVo, credentials: Credentials): Promise<ManifestVo> {
    return await axios.get(`https://usher.ttvnw.net/vod/${id}.m3u8?sig=${credentials.signature}&token=${credentials.value}&allow_source=true&player=twitchweb&allow_spectre=true&allow_audio_only=true`)
  }

}
