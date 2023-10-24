import { Queue } from 'bull';
import { Video } from '@if/video';
import { randomUUID } from 'crypto';
import { InjectQueue } from '@nestjs/bull';
import { CreateVideoDownloadDto } from '@dto/video';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class VideoService {
  constructor(
    @InjectQueue('video-download-queue')
    private videoDownloadQueue: Queue<Video>,
  ) {}

  async addToQueue({ youtubeVideoUrl }: CreateVideoDownloadDto) {
    const jobId = randomUUID();

    const createdJob = await this.videoDownloadQueue.add(
      {
        youtubeVideoUrl,
      },
      { jobId },
    );

    return {
      jobId: createdJob.id,
    };
  }

  async getJobStatus(jobId: string) {
    try {
      const job = await this.videoDownloadQueue.getJob(jobId);
      return {
        jobId: job.id,
        status: await job.getState(),
        progress: job.progress(),
      };
    } catch (error) {
      throw new BadRequestException('Job not found');
    }
  }
}
