import { Injectable } from '@nestjs/common';

@Injectable()
export class VodService {
  getVod(): string {
    return 'Got VOD';
  }
}
