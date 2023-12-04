import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AccessesService } from './accesses/accesses.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventsService } from './events/events.service';
import { AccessAndDatesDto } from './dto/accessAndDates.dto';
import dayjs from 'dayjs';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  private accessesAndDates = new Map<string, AccessAndDatesDto>();

  constructor(
    private readonly accessService: AccessesService,
    private readonly eventsService: EventsService,
  ) {
    // -- Empty
  }

  async onModuleInit() {
    await this.getCurrentAccesses();
  }

  @Cron(CronExpression.EVERY_HOUR, { name: 'getCurrentAccessesCron', timeZone: 'Europe/Paris' })
  async reloadAccesses() {
    await this.getCurrentAccesses();
  }

  @Cron(CronExpression.EVERY_5_MINUTES, { name: 'getEvents', timeZone: 'Europe/Paris' })
  async getEvents() {
    await this.getEventsForAccesses();
  }

  async getCurrentAccesses() {
    this.logger.log('Calling getCurrentAccesses');
    // Get all current accesses
    const accesses = await this.accessService.getAllCurrentAccesses();
    this.logger.verbose(`Got ${accesses?.length} accesses.`);
    const newAccessesAndDates = new Map<string, AccessAndDatesDto>();

    for (const access of accesses) {
      const existingAccess = this.accessesAndDates.get(access.orderId);
      // Create new access and dates
      newAccessesAndDates.set(access.orderId, {
        orderId: access.orderId,
        from: existingAccess ? existingAccess.from : new Date(access.loadingTsMin),
        to: dayjs().add(1, 'hour').toDate(),
      });
    }

    this.accessesAndDates = newAccessesAndDates;
  }

  async getEventsForAccesses() {
    this.logger.log('Calling getEventsForAccesses');
    let eventsCount = 0;
    // Get events for all accesses
    const results = await this.eventsService.getEventsForAccesses(Array.from(this.accessesAndDates.values()));

    for (const eventsForAccess of results) {
      if (eventsForAccess.events.length > 0) {
        eventsCount += eventsForAccess.events.length;
        await this.eventsService.processEvents(eventsForAccess);

        const aad = this.accessesAndDates.get(eventsForAccess.orderId);
        const lastEventTs = new Date(eventsForAccess.events[eventsForAccess.events.length - 1].ts);

        if (aad && aad.from.getTime() < lastEventTs.getTime()) {
          // Update the "from" Date to the last event TS + 1 second
          this.logger.verbose(`Previous from: ${aad.from.toISOString()} New from ${lastEventTs.toISOString()}`);
          aad.from = dayjs(lastEventTs).add(1, 'second').toDate();
        }
      }
    }
    this.logger.log(`Got ${eventsCount} events.`);
  }
}
