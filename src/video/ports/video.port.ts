import { ReadStream } from 'node:fs';
import { Video } from '../entities/video.entity';
import {
  VideoAddedToQueueResponse,
  VideoGetDownloadStatusResponse,
} from '../response/video.response';
import { QueueVideo } from '../interfaces';

export interface VideoPort {
  getDetails(videoUrl: string): Promise<Video>;
  downloadVideo(videoId: string): Promise<ReadStream>;
  enqueueVideoDownload(
    queueVideo: QueueVideo,
  ): Promise<VideoAddedToQueueResponse>;
  getVideoDownloadStatus(
    jobId: string,
  ): Promise<VideoGetDownloadStatusResponse>;
  deleteVideo(videoId: string): Promise<void>;
}
