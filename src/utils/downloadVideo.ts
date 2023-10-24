import * as fs from 'fs';
import * as ytdl from 'ytdl-core';

export async function downloadVideo(
  youtubeVideoUrl: string,
  traceProgress?: (progress: number) => void,
) {
  return new Promise(async (resolve, reject) => {
    const video = await ytdl.getInfo(youtubeVideoUrl);
    const videoPath = `${process.cwd()}/videos/${video.videoDetails.title}.mp4`;

    if (fs.existsSync(videoPath)) {
      return resolve(videoPath);
    }
    console.log(video.formats[0].contentLength);
    const videoStream = ytdl(youtubeVideoUrl, {
      quality: 'highest',
    });

    videoStream.on('data', (chunk) => {
      traceProgress(chunk.length);
    });

    videoStream.pipe(fs.createWriteStream(videoPath));

    videoStream.on('error', (error) => {
      reject(error);
    });

    videoStream.on('end', () => {
      resolve(videoPath);
    });
  });
}
