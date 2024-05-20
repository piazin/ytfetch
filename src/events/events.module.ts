import { Module, forwardRef } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { VideoModule } from '../video/video.module';

@Module({
  imports: [forwardRef(() => VideoModule)],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
