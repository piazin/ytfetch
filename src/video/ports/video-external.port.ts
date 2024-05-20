import { Video } from '../entities/video.entity';
import { ProgressCallback, QueueVideo } from '../interfaces';

export interface VideoExternalPort {
  getVideoDetails(videoUrl: string): Promise<Video>;
  downloadVideoFromYoutube(
    videoUrl: QueueVideo,
    traceProgress?: ProgressCallback,
  ): Promise<string>;
  convertVideoToMp3(
    youtubeVideoUrl: string,
    traceProgress?: ProgressCallback,
  ): Promise<string>;
}
