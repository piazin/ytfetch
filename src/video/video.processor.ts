import {
  Processor,
  OnQueueActive,
  Process,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Video } from '@if/video';
import { Logger } from '@nestjs/common';
import { Events } from 'src/events/enums/events.enum';
import { EventsGateway } from '../events/events.gateway';
import * as fs from 'fs';
import * as ytdl from 'ytdl-core';

async function downloadVideo(youtubeVideoUrl: string) {
  return new Promise(async (resolve, reject) => {
    const { videoDetails } = await ytdl.getInfo(youtubeVideoUrl);
    const videoPath = `${process.cwd()}/videos/${videoDetails.title}.mp4`;

    if (fs.existsSync(videoPath)) {
      return resolve(videoPath);
    }

    const videoStream = ytdl(youtubeVideoUrl, {
      quality: 'highest',
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

function returnPromise() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Hello World');
    }, 4000);
  });
}

@Processor('video-download-queue')
export class VideoProcessor {
  constructor(private eventsGateway: EventsGateway) {}

  @Process()
  async download(job: Job<Video>) {
    const { youtubeVideoUrl } = job.data;

    // quando usado a extensão live server do vscode, a pagina fica recarregando e não envia os eventos, use o html direto no navegador
    const videoPath = await downloadVideo(youtubeVideoUrl);
    return videoPath;
  }

  @OnQueueActive()
  onActive(job: Job) {
    Logger.debug(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )}`,
    );
    this.eventsGateway.pusblishEvent(Events.VIDEO_DOWNLOAD_STARTED, {
      jobId: job.id,
    });
  }

  @OnQueueCompleted()
  onCompleted(job: Job<Video>) {
    Logger.debug(`Job ${job.id} completed`);

    this.eventsGateway.pusblishEvent(Events.FINISHED_VIDEO_DOWNLOAD, {
      jobId: job.id,
      videoUrl: job.returnvalue,
    });
  }
}
