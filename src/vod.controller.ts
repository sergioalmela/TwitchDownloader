const vodService = require('./vod.service').VodService

export class VodController {
    getVod(): string {
        const VodService = new vodService();
        return VodService.getVod();
    }
  }
  