import ffmpeg = require('fluent-ffmpeg');
import { Provider } from '@nestjs/common';
import { VideoService } from './video.service';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import { VideoProcessor } from './video.processor';
import { VideoAdapter } from './adapters/video-adapter';
import { VideoExternalAdapter } from './adapters/video-adapter-external';

ffmpeg.setFfmpegPath(ffmpegPath.path);

export const Providers: Provider[] = [
  VideoService,
  VideoProcessor,
  {
    provide: 'VideoAdapter',
    useClass: VideoAdapter,
  },
  {
    provide: 'VideoExternalAdapter',
    useClass: VideoExternalAdapter,
  },
  {
    provide: 'ytdl',
    useValue: require('ytdl-core'),
  },
  {
    provide: 'ffmpeg',
    useValue: ffmpeg,
  },
];
