import { VideoService } from './video.service';
import {
  Response,
  VideoJobResponse,
  VideoProcessResponse,
} from 'src/responses';
import { CreateVideoDownloadDto } from '@dto/video';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  async processVideoDownload(
    @Body() createVideoDownloadDto: CreateVideoDownloadDto,
  ) {
    const { jobId } = await this.videoService.addToQueue(
      createVideoDownloadDto,
    );

    return new Response<VideoProcessResponse>({
      status: HttpStatus.OK,
      data: { jobId },
    });
  }

  @Get(':jobId')
  async getJobState(@Param('jobId') jobId: string) {
    const job = await this.videoService.getJobState(jobId);
    return new Response<VideoJobResponse>({
      status: HttpStatus.OK,
      data: job,
    });
  }
}
