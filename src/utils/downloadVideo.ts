import * as fs from 'fs';
import { Video } from '@if/video';
import * as ytdl from 'ytdl-core';
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
    const video = await ytdl.getInfo(youtubeVideoUrl);
    const videoPath = `${process.cwd()}/videos/${
      video.videoDetails.title
    }${Date.now()}.mp4`;

    if (fs.existsSync(videoPath)) {
      return videoPath;
    }

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
    throw error;
  }
}
