import {
  Processor,
  OnQueueActive,
  Process,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';
import { Job } from 'bull';
import { QueueVideo } from '@if/video';
import { Inject, Logger } from '@nestjs/common';
import { Events } from '../events/enums/events.enum';
import { EventsGateway } from '../events/events.gateway';
import { VideoExternalPort } from './ports/video-external.port';

/**
 * @description A classe VideoProcessor é um processador de filas, que é responsável por processar os jobs da fila
 * @method download: é o método que processa o job, ele é executado quando um job é adicionado na fila
 * @method onActive: é executado quando um job é iniciado
 * @method onCompleted: é executado quando um job é finalizado
 * @method onFailed: é executado quando um job falha
 */
@Processor('video-download-queue')
export class VideoProcessor {
  private logger: Logger = new Logger(VideoProcessor.name);
  constructor(
    private eventsGateway: EventsGateway,
    @Inject('VideoExternalAdapter')
    private readonly videoExternalAdapter: VideoExternalPort,
  ) {}

  @Process()
  async download(job: Job<QueueVideo>) {
    try {
      // quando usado a extensão live server do vscode, a pagina fica recarregando e não envia os eventos, use o html direto no navegador
      const convertVideoToMp3 = job.data.type === 'mp3';
      if (convertVideoToMp3) {
        const audioId = await this.videoExternalAdapter.convertVideoToMp3(
          job.data.youtubeVideoUrl,
          ({ downloadedMb, percentage, estimatedDownloadTime }) => {
            this.eventsGateway.pusblishEvent(Events.VIDEO_DOWNLOAD_PROGRESS, {
              jobId: job.id,
              percentage: (percentage * 100).toFixed(0),
              downloadedMb,
              estimatedDownloadTime,
            });
          },
        );

        return audioId;
      }

      const videoId = await this.videoExternalAdapter.downloadVideoFromYoutube(
        job.data,
        ({ downloadedMb, percentage, estimatedDownloadTime }) => {
          this.eventsGateway.pusblishEvent(Events.VIDEO_DOWNLOAD_PROGRESS, {
            jobId: job.id,
            percentage: (percentage * 100).toFixed(0),
            downloadedMb,
            estimatedDownloadTime,
          });
        },
      );
      return videoId;
    } catch (error) {
      this.logger.error(error.message);
      job.moveToFailed({ message: error.message });
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(
        job.data,
      )}`,
    );
    this.eventsGateway.pusblishEvent(Events.VIDEO_DOWNLOAD_STARTED, {
      jobId: job.id,
    });
  }

  @OnQueueCompleted()
  onCompleted(job: Job<QueueVideo>) {
    this.logger.debug(`Job ${job.id} completed ${job.returnvalue}}`);

    this.eventsGateway.pusblishEvent(Events.FINISHED_VIDEO_DOWNLOAD, {
      jobId: job.id,
      videoId: job.returnvalue,
    });
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    this.logger.error(`Job ${job.id} failed, err: ${err.message}`);

    this.eventsGateway.pusblishEvent(Events.FAILED_VIDEO_DOWNLOAD, {
      jobId: job.id,
      error: err.message,
    });
  }
}
