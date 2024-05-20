import { join } from 'path';
import { Queue } from 'bull';
import fs from 'node:fs/promises';
import { randomUUID } from 'crypto';
import { Inject, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Video } from '../entities/video.entity';
import { ReadStream, createReadStream } from 'node:fs';
import { VideoPort } from '../ports/video.port';
import { VideoExternalAdapter } from './video-adapter-external';
import {
  VideoAddedToQueueResponse,
  VideoGetDownloadStatusResponse,
} from '../response/video.response';
import { QueueVideo } from '../interfaces';

export class VideoAdapter implements VideoPort {
  constructor(
    @Inject('VideoExternalAdapter')
    private readonly videoExternalAdapter: VideoExternalAdapter,
    @InjectQueue('video-download-queue')
    private videoDownloadQueue: Queue<QueueVideo>,
  ) {}

  async getDetails(videoUrl: string): Promise<Video> {
    const videoDetails =
      await this.videoExternalAdapter.getVideoDetails(videoUrl);
    return videoDetails;
  }

  async enqueueVideoDownload(
    queueVideo: QueueVideo,
  ): Promise<VideoAddedToQueueResponse> {
    const jobId = randomUUID();
    await this.videoDownloadQueue.add(queueVideo, { jobId });
    return new VideoAddedToQueueResponse(jobId);
  }

  async getVideoDownloadStatus(
    jobId: string,
  ): Promise<VideoGetDownloadStatusResponse> {
    const job = await this.videoDownloadQueue.getJob(jobId);
    if (!job) throw new NotFoundException('Job not found');
    return {
      jobId: String(job.id),
      status: await job.getState(),
      progress: job.progress(),
    };
  }

  async downloadVideo(videoId: string): Promise<ReadStream> {
    const fullPath = join(process.cwd(), 'videos', videoId);
    await fs.access(fullPath, fs.constants.F_OK);

    return createReadStream(fullPath);
  }

  async deleteVideo(videoId: string): Promise<void> {
    try {
      await fs.rm(join(process.cwd(), 'videos', videoId));
    } catch (error) {
      console.error(error);
    }
  }
}
