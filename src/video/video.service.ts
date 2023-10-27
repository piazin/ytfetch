import { Queue } from 'bull';
import { Video } from '@if/video';
import fs from 'node:fs/promises';
import { randomUUID } from 'crypto';
import { InjectQueue } from '@nestjs/bull';
import { CreateVideoDownloadDto } from '@dto/video';
import { getVideoDetails } from '@utils/getVideoDetails';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { join } from 'node:path';
import { ReadStream, createReadStream } from 'node:fs';

@Injectable()
export class VideoService {
  private readonly logger: Logger = new Logger(VideoService.name);

  constructor(
    @InjectQueue('video-download-queue')
    private videoDownloadQueue: Queue<Video>,
  ) {}

  async getVideoDetails(videoUrl: string) {
    try {
      const { thumbnails, title, video_url, videoId, formats } =
        await getVideoDetails(videoUrl);
      return {
        title,
        thumbnails,
        video_url,
        videoId,
        formats,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException('Não foi possivel encontrar o vídeo');
    }
  }

  async downloadVideo(videoId: string) {
    try {
      const fullPath = join(process.cwd(), 'videos', videoId);
      await fs.access(fullPath, fs.constants.F_OK);

      return createReadStream(fullPath);
    } catch (error) {
      this.logger.error(error.message);
      throw new NotFoundException('Não foi possivel encontrar o vídeo');
    }
  }

  async addToQueue(createVideoDownloadDto: CreateVideoDownloadDto) {
    try {
      const jobId = randomUUID();

      const createdJob = await this.videoDownloadQueue.add(
        createVideoDownloadDto,
        { jobId },
      );

      return {
        jobId: createdJob.id,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException('Não foi possivel baixar o vídeo');
    }
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
      this.logger.error(error.message);
      throw new BadRequestException('Job not found');
    }
  }
}
