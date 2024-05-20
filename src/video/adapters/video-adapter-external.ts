import fs from 'node:fs';
import ytdl from 'ytdl-core';
import { Inject } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Video } from '../entities/video.entity';
import { VideoExternalPort } from '../ports/video-external.port';
import {
  isFormatAccepted,
  isQualityAccepted,
  removeDuplicateFormats,
} from '@utils/getVideoDetails';
import { QueueVideo, ProgressCallback } from '../interfaces';
import { traceStreamProgress } from '@utils/traceStreamProgress';

export class VideoExternalAdapter implements VideoExternalPort {
  constructor(
    @Inject('ytdl')
    private readonly ytdlCore: typeof ytdl,
    @Inject('ffmpeg')
    private readonly ffmpeg: any,
  ) {}

  async getVideoDetails(videoUrl: string): Promise<Video> {
    try {
      const cookie =
        'SIDCC=AKEyXzVXXkle56gzr_gQAIGN_CLQai5P1U9lhSwIZ2Y6pE0GP1CTdm7bi90Xc5FJdfFUml-CcA; __Secure-1PSIDCC=AKEyXzUAeQ09qr7xjJvY5jDi3GLKRAmbTQDqBMsrU_76d2LGl9TsG4WfeLKTdizRa8sYxUhEpV4; __Secure-3PSIDCC=AKEyXzXF2W6of4ae5RdwMALtUmYgfLpZWZ5zVwCrgF1pEk_2jBlAmN5tfhlz1RlKBefBs8mgrP8;';

      const video = await this.ytdlCore.getInfo(videoUrl, {
        requestOptions: {
          headers: {
            cookie,
          },
        },
      });

      const formats = removeDuplicateFormats(video.formats)
        .filter((f, i) => isFormatAccepted(f) && isQualityAccepted(f))
        .map(
          ({
            width,
            height,
            container,
            mimeType,
            qualityLabel,
            approxDurationMs,
          }) => ({
            width,
            height,
            container,
            mimeType,
            qualityLabel,
            approxDurationMs,
          }),
        );

      return {
        title: video.videoDetails.title,
        videoId: video.videoDetails.videoId,
        videoUrl: video.videoDetails.video_url,
        formats,
        thumbnails: video.videoDetails.thumbnails,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description Downloads a video from YouTube
   * @param youtubeVideoUrl The URL of the YouTube video
   * @param traceProgress A callback function that will be called with the progress of the download
   * @returns The path to the downloaded video
   */
  async downloadVideoFromYoutube(
    { youtubeVideoUrl }: QueueVideo,
    traceProgress?: ProgressCallback,
  ): Promise<string> {
    try {
      const videoId = `${randomUUID()}.mp4`;
      const videoPath = `${process.cwd()}/videos/${videoId}`;

      const videoStream = ytdl(youtubeVideoUrl, { quality: 18 });

      videoStream.pipe(fs.createWriteStream(videoPath));

      if (traceProgress) {
        traceStreamProgress(videoStream, traceProgress);
      }

      await new Promise((resolve, reject) => {
        videoStream.on('error', (error) => {
          reject(error);
        });

        videoStream.on('end', () => {
          resolve(videoId);
        });
      });

      return videoId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async convertVideoToMp3(
    youtubeVideoUrl: string,
    traceProgress?: ProgressCallback,
  ): Promise<string> {
    try {
      const audioId = `${randomUUID()}.mp3`;
      const audioPath = `${process.cwd()}/videos/${audioId}`;
      const audioStream = ytdl(youtubeVideoUrl, { quality: 'highestaudio' });

      const writeStream = this.ffmpeg(audioStream)
        .audioBitrate(128)
        .save(audioPath);

      if (traceProgress) {
        traceStreamProgress(audioStream, traceProgress);
      }

      await new Promise((resolve, reject) => {
        writeStream.on('error', (err) => reject(err));
        writeStream.on('end', () => resolve(audioId));
      });

      return audioId;
    } catch (error) {
      throw error;
    }
  }
}
