import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessesModule } from './accesses/accesses.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    AccessesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // -- Empty
}
