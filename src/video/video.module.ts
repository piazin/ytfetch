import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { VideoService } from './video.service';
import { VideoProcessor } from './video.processor';
import { VideoController } from './video.controller';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'video-download-queue',
    }),
    EventsModule,
  ],
  controllers: [VideoController],
  providers: [VideoService, VideoProcessor],
})
export class VideoModule {}
