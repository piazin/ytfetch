import Bull, { Queue } from 'bull';
import { Video } from '@if/video';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { CreateVideoDownloadDto } from '@dto/video';

@Injectable()
export class VideoService {
  constructor(
    @InjectQueue('video-download-queue')
    private videoDownloadQueue: Queue<Video>,
  ) {}

  async addToQueue(
    createVideoDownloadDto: CreateVideoDownloadDto,
  ): Promise<Bull.JobId> {
    const job = await this.videoDownloadQueue.add(createVideoDownloadDto);
    return job.id;
  }
}
