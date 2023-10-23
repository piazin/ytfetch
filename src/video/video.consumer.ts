import {
  Processor,
  OnQueueActive,
  Process,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Job } from 'bull';
import { Video } from '@if/video';
import { EventsGateway } from '../events/events.gateway';
import { Events } from 'src/events/enums/events.enum';

@Processor('video-download-queue')
export class VideoProcessor {
  constructor(private eventsGateway: EventsGateway) {}

  @Process()
  async download(job: Job<Video>) {
    let progress = 0;
    for (let i = 0; i < 100; i += 10) {
      progress += 10;
      job.progress(progress);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(job.data);
    this.eventsGateway.pusblishEvent(Events.FINISHED_VIDEO_DOWNLOAD, {
      id: job.data.sessionId,
      data: {
        status: 'ok',
        message: 'Video processado',
      },
    });

    return {};
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(
      `completed job ${job.id} of type ${job.name} with result ${JSON.stringify(
        job.returnvalue,
      )}`,
    );
  }
}
