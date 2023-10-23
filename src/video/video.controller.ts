import { VideoService } from './video.service';
import { CreateVideoDownloadDto } from '@dto/video';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('process')
  async processVideoDownload(
    @Body() createVideoDownloadDto: CreateVideoDownloadDto,
  ) {
    const jobId = await this.videoService.addToQueue(createVideoDownloadDto);
    return { jobId };
  }
}
