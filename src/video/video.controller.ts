import { VideoService } from './video.service';
import { CreateVideoDownloadDto } from '@dto/video';
import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  StreamableFile,
} from '@nestjs/common';
import { join } from 'path';
import { createReadStream } from 'fs';

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
  async getVideoJobStatus(@Param('jobId') jobId: string) {
    const job = await this.videoService.getJobStatus(jobId);
    return {
      job,
    };
  }

  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Get(':jobId/download')
  @Header('Content-Type', 'apllication/json')
  async downloadVideo(@Param('jobId') jobId: string) {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(file);
  }
}
