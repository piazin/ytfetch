import { Video } from '@if/video';
import Bull, { Queue } from 'bull';
import { randomUUID } from 'crypto';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { CreateVideoDownloadDto } from '@dto/video';

@Injectable()
export class VideoService {
  constructor(
    @InjectQueue('video-download-queue')
    private videoDownloadQueue: Queue<Video>,
  ) {}

  async addToQueue(createVideoDownloadDto: CreateVideoDownloadDto) {
    const jobId = randomUUID();
    const sessionId = randomUUID();

    const cratedJob = await this.videoDownloadQueue.add(
      {
        youtubeVideoUrl: createVideoDownloadDto.youtubeVideoUrl,
        sessionId,
      },
      { jobId },
    );

    return {
      jobId,
      sessionId,
    };
  }
}
