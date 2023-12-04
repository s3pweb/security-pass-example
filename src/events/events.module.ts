import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [
    EventsService,
  ],
  exports: [
    EventsService,
  ],
})
export class EventsModule {
  // -- Empty
}
