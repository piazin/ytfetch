import { VideoService } from './video.service';
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
  async createVideoDownloadJob(
    @Body() createVideoDownloadDto: CreateVideoDownloadDto,
  ) {
    const { jobId } = await this.videoService.addToQueue(
      createVideoDownloadDto,
    );

    return {
      jobId,
    };
  }

  @Get(':jobId')
  async getJobStatus(@Param('jobId') jobId: string) {
    const job = await this.videoService.getJobStatus(jobId);
    return {
      job,
    };
  }
}
