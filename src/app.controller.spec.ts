import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AccessesService } from './accesses/accesses.service';

describe(AppController.name, () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          cache: true,
          isGlobal: true,
        }),
        HttpModule,
      ],
      controllers: [AppController],
      providers: [
        AccessesService,
        AppService,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return', () => {
      expect(appController.getCurrentAccesses()).resolves.toBeDefined();
    });
  });
});
