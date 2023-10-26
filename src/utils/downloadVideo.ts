import * as fs from 'fs';
import { Video } from '@if/video';
import * as ytdl from 'ytdl-core';
import { randomUUID } from 'crypto';
import { traceStreamProgress } from './traceStreamProgress';

export type ProgressCallback = ({
  percentage,
  downloadMinutes,
  downloadedMb,
  estimatedDownloadTime,
}: {
  percentage: number;
  downloadMinutes?: number;
  downloadedMb?: string;
  estimatedDownloadTime?: number;
}) => void;

/**
 * @description Downloads a video from YouTube
 * @param youtubeVideoUrl The URL of the YouTube video
 * @param traceProgress A callback function that will be called with the progress of the download
 * @returns The path to the downloaded video
 */
export async function downloadVideoFromYoutube(
  { youtubeVideoUrl, qualityLabel, type }: Video,
  traceProgress?: ProgressCallback,
) {
  try {
    const videoPath = `${process.cwd()}/videos/${randomUUID()}.mp4`;

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
        resolve(videoPath);
      });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
