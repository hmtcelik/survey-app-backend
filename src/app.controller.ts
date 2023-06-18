import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { BaseInterceptor } from './app.interceptor';

@UseInterceptors(BaseInterceptor)
@Controller()
export class AppController {
  constructor() {}

  @Get()
  base() {
    return "hello world";
  }
}
