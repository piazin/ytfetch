import { Controller, Get } from '@nestjs/common';
import { EventsGateway } from './events/events.gateway';

@Controller('health-check')
export class AppController {
  constructor(private eventsGateway: EventsGateway) {}

  @Get()
  healthCheck() {
    const userId = '123';
    this.eventsGateway.pusblishEvent('health-check', {
      id: userId,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
      },
    });
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
