import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AccessAndDatesDto } from '../dto/accessAndDates.dto';
import { EventsForAccessDto } from '../dto/eventsForAccess.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  private readonly apiUrl;
  private readonly token;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiUrl = this.configService.get<string>('API_URL');
    this.token = this.configService.get<string>('TOKEN');
  }

  async getEventsForAccesses(dto: AccessAndDatesDto[]): Promise<EventsForAccessDto[]> {
    const { data } = await firstValueFrom(
      this.httpService.post<EventsForAccessDto[]>(
        `${this.apiUrl}/customers/v2/api/events?temperaturesAsArray=true`,
        dto,
        {
          headers: {
            token: this.token,
          },
        },
      ),
    );
    return data;
  }

  async processEvents(eventsForAccess: EventsForAccessDto) {
    this.logger.debug(`Processing orderId: ${eventsForAccess.orderId} and ${eventsForAccess.events.length} events.`);
    // TODO Process received events
  }
}
