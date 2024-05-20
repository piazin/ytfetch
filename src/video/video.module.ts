import { Providers } from './mod';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { VideoController } from './video.controller';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'video-download-queue',
    }),
    EventsModule,
  ],
  controllers: [VideoController],
  providers: [...Providers],
  exports: [...Providers],
})
export class VideoModule {}
