import {ManifestVo} from "../valueObjects/manifest.vo";
import {IdVodVo} from "../valueObjects/idVod.vo";
import Credentials from "../../interfaces/Credentials";

export interface IFeedRepository {
  getVodManifest: (id: IdVodVo, credentials: Credentials) => Promise<ManifestVo>
}
