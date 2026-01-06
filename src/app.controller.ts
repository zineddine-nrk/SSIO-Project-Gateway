import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('metrics')
  getMetrics(@Res() res: Response) {
    res.setHeader('Content-Type', register.contentType);
    res.send(register.metrics());
  }
  
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
