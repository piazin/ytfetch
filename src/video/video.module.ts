import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'video-download-queue',
    }),
  ],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
