import { Module } from '@nestjs/common';
import { AccessesService } from './accesses.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
  ],
  providers: [
    AccessesService,
  ],
  exports: [
    AccessesService,
  ],
})
export class AccessesModule {
  // -- Empty
}
