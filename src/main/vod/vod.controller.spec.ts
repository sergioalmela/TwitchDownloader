import { Test, TestingModule } from '@nestjs/testing';
import { VodController } from './vod.controller';
import { VodService } from './vod.service';

describe('VodController', () => {
  let vodController: VodController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [VodController],
      providers: [VodService],
    }).compile();

    vodController = app.get<VodController>(VodController);
  });

  describe('root', () => {
    it('should return "Got VOD"', () => {
      expect(vodController.getVod()).toBe('Got VOD');
    });
  });
});
