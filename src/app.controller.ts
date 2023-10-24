import { Controller, Get, HttpStatus } from '@nestjs/common';
import { HealthCheckResponse, Response } from 'src/responses';

@Controller('health-check')
export class AppController {
  @Get()
  healthCheck() {
    return new Response<HealthCheckResponse>({
      status: HttpStatus.OK,
      data: { status: 'ok', timestamp: new Date().toISOString() },
    });
  }
}
