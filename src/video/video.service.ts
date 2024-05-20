import { Inject, Injectable, Logger } from '@nestjs/common';
import { VideoPort } from './ports/video.port';
import { CreateVideoDownloadDto } from '@dto/video';

@Injectable()
export class VideoService {
  private readonly logger: Logger = new Logger(VideoService.name);

  constructor(
    @Inject('VideoAdapter')
    private readonly videoAdapter: VideoPort,
  ) {}

  async getVideoDetails(videoUrl: string) {
    try {
      return await this.videoAdapter.getDetails(videoUrl);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async downloadVideo(videoId: string) {
    try {
      return await this.videoAdapter.downloadVideo(videoId);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async addToQueue(createVideoDownloadDto: CreateVideoDownloadDto) {
    try {
      return await this.videoAdapter.enqueueVideoDownload(
        createVideoDownloadDto,
      );
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async getJobStatus(jobId: string) {
    try {
      return await this.videoAdapter.getVideoDownloadStatus(jobId);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
