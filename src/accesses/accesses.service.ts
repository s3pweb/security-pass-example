import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessesService {
  private readonly logger = new Logger(AccessesService.name);
  private readonly apiUrl;
  private readonly token;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiUrl = this.configService.get<string>('API_URL');
    this.token = this.configService.get<string>('TOKEN');
  }

  async getAllCurrentAccesses(): Promise<any[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<any[]>(
        `${this.apiUrl}/customers/v2/api/accesses?current=true`,
        {
          headers: {
            token: this.token,
          },
        },
      ),
    );
    return data;
  }
}
