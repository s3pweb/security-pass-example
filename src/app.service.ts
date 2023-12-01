import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AccessesService } from './accesses/accesses.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AccessRequest } from './dto/accessRequest.model';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AccessesService.name);
  private accesses: AccessRequest[] = [];

  constructor(
    private readonly accessService: AccessesService,
  ) {
  }

  async onModuleInit() {
    this.accesses = await this.getCurrentAccesses();
  }

  @Cron(CronExpression.EVERY_HOUR, { name: 'getCurrentAccessesCron', timeZone: 'Europe/Paris' })
  async reloadAccesses() {
    this.accesses = await this.getCurrentAccesses();
  }

  async getCurrentAccesses() {
    this.logger.debug('Calling getCurrentAccesses');
    return this.accessService.getAllCurrentAccesses();
  }
}
