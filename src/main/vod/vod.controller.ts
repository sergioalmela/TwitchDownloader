import { Controller, Get } from '@nestjs/common';
import { VodService } from './vod.service';

@Controller()
export class VodController {
  constructor(private readonly vodService: VodService) {}

  getVod(): string {
    return this.vodService.getVod();
  }
}
