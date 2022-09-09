import { Module } from '@nestjs/common';
import { VodController } from './vod.controller';
import { VodService } from './vod.service';

@Module({
  imports: [],
  controllers: [VodController],
  providers: [VodService],
})
export class VodModule {}
