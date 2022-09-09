import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VodModule } from './vod/vod.module';

@Module({
  imports: [
    VodModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
