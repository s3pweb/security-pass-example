import { Injectable, Logger } from '@nestjs/common';
import { AccessesService } from './accesses/accesses.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AccessesService.name);

  constructor(
    private readonly accessService: AccessesService,
  ) {
  }

  async getCurrentAccesses() {
    this.logger.log('Calling getCurrentAccesses');
    return this.accessService.getAllCurrentAccesses();
  }
}
