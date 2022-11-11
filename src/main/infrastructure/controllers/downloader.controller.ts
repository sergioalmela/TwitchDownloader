import {inject, injectable} from 'inversify'
import {ContainerSymbols} from '../../symbols'
import {AuthVodUseCase} from '../../application/useCases/authVod.usecase'
import {IdVodVo} from '../../domain/valueObjects/idVod.vo'
import {GetVodIdFromUrlUseCase} from '../../application/useCases/getVodIdFromUrl.usecase'
import {IdClipVo} from '../../domain/valueObjects/idClip.vo'
import {AuthClipUseCase} from '../../application/useCases/authClip.usecase'
import {GetClipIdFromUrlUseCase} from '../../application/useCases/getClipIdFromUrl.usecase'
import Credentials from "../../interfaces/Credentials";
import {DetectContentTypeUseCase} from "../../application/useCases/detectContentType.usecase";
import {ContentTypes} from "../../domain/constants/contentTypes.enum";
import {UrlVo} from "../../domain/valueObjects/url.vo";

@injectable()
export class DownloaderController {
    constructor (
        @inject(ContainerSymbols.AuthVodUseCase)
        private readonly authVodUseCase: AuthVodUseCase,
        @inject(ContainerSymbols.AuthClipUseCase)
        private readonly authClipUseCase: AuthClipUseCase,
        @inject(ContainerSymbols.GetVodIdFromUrlUseCase)
        private readonly getVodIdFromUrl: GetVodIdFromUrlUseCase,
        @inject(ContainerSymbols.GetClipIdFromUrlUseCase)
        private readonly getClipIdFromUrl: GetClipIdFromUrlUseCase,
        @inject(ContainerSymbols.DetectContentTypeUseCase)
        private readonly detectContentType: DetectContentTypeUseCase
    ) {}

    async downloadContent (url: UrlVo): Promise<void> {
        const type: ContentTypes = this.detectContentType.execute(url)

        if (type === ContentTypes.VOD) {
            const id: IdVodVo = this.getVodIdFromUrl.execute(url)

            const credentials: Credentials = await this.authVodUseCase.execute(id)

            console.log(credentials)
            process.exit()
        }

    }
}
