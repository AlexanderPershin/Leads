import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Controller('/api/leads')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getLeads(@Query() query: any): Promise<any> {
    return this.appService.getLeads(query);
  }
}
