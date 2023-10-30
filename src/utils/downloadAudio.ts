import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import { randomUUID } from 'crypto';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import { ProgressCallback } from './downloadVideo';
import { traceStreamProgress } from './traceStreamProgress';

ffmpeg.setFfmpegPath(ffmpegPath.path);

export async function downloadAudio(
  youtubeVideoUrl: string,
  traceProgress?: ProgressCallback,
) {
  try {
    const audioId = `${randomUUID()}.mp3`;
    const audioPath = `${process.cwd()}/videos/${audioId}`;
    const audioStream = ytdl(youtubeVideoUrl, { quality: 'highestaudio' });

    const writeStream = ffmpeg(audioStream).audioBitrate(128).save(audioPath);

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
