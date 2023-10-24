import {
  Processor,
  OnQueueActive,
  Process,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Video } from '@if/video';
import { Logger } from '@nestjs/common';
import { Events } from 'src/events/enums/events.enum';
import { downloadVideo } from '../utils/downloadVideo';
import { EventsGateway } from '../events/events.gateway';

@Processor('video-download-queue')
export class VideoProcessor {
  constructor(private eventsGateway: EventsGateway) {}

  @Process()
  async download(job: Job<Video>) {
    const { youtubeVideoUrl } = job.data;
    try {
      // quando usado a extensão live server do vscode, a pagina fica recarregando e não envia os eventos, use o html direto no navegador
      const videoPath = await downloadVideo(youtubeVideoUrl);
      return videoPath;
    } catch (error) {
      job.moveToFailed({ message: error.message });
    }
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

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    Logger.error(`Job ${job.id} failed, err: ${err.message}`);

    this.eventsGateway.pusblishEvent(Events.FAILED_VIDEO_DOWNLOAD, {
      jobId: job.id,
      error: err.message,
    });
  }
}
