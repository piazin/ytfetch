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

@Processor('video-download-queue')
export class VideoProcessor {
  constructor(private eventsGateway: EventsGateway) {}

  @Process()
  async download(job: Job<Video>) {
    const { youtubeVideoUrl } = job.data;
    let progress = 0;

    for (let i = 0; i < 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      progress += 1;
      job.progress(progress);
    }

    return youtubeVideoUrl;
  }

  @OnQueueActive()
  onActive(job: Job) {
    Logger.debug(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )}`,
    );
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
