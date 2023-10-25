import { Queue } from 'bull';
import { Video } from '@if/video';
import { randomUUID } from 'crypto';
import { InjectQueue } from '@nestjs/bull';
import { CreateVideoDownloadDto } from '@dto/video';
import { getVideoDetails } from '@utils/getVideoDetails';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class VideoService {
  private readonly logger: Logger = new Logger(VideoService.name);

  constructor(
    @InjectQueue('video-download-queue')
    private videoDownloadQueue: Queue<Video>,
  ) {}

  async getVideoDetails(videoUrl: string) {
    try {
      const { thumbnails, title, video_url } = await getVideoDetails(videoUrl);
      return {
        title,
        thumbnails,
        video_url,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException('Não foi possivel encontrar o vídeo');
    }
  }

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
