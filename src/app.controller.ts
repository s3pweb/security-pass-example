import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get('accesses')
  getCurrentAccesses() {
    return this.appService.getCurrentAccesses();
  }
}
