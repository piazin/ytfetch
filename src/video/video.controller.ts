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
  Query,
  StreamableFile,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('video')
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @ApiOkResponse({
    description: 'As informações do video foram encontradas com sucesso',
  })
  @ApiBadRequestResponse({
    description: 'Não foi possivel encontrar o vídeo',
  })
  @ApiQuery({ name: 'videoUrl', description: 'Url do video' })
  @Get()
  async getVideoDetails(@Query('videoUrl') videoUrl: string) {
    const videoDetails = this.videoService.getVideoDetails(videoUrl);
    return videoDetails;
  }

  @ApiCreatedResponse({ description: 'Job de download criado com sucesso' })
  @ApiBadRequestResponse({
    description: 'Não foi possivel baixar o vídeo',
  })
  @ApiBody({ type: [CreateVideoDownloadDto] })
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

  @ApiOkResponse({ description: 'Job encontrado com sucesso' })
  @ApiBadRequestResponse({
    description: 'Não foi possivel encontra o job',
  })
  @ApiParam({ name: 'jobId', description: 'Id do job a ser verificado' })
  @Get(':jobId')
  async getVideoJobStatus(@Param('jobId') jobId: string) {
    const job = await this.videoService.getJobStatus(jobId);
    return {
      job,
    };
  }

  @ApiResponse({
    status: 206,
    description: 'Download do vide iniciado com sucesso',
  })
  @ApiNotFoundResponse({
    description: 'Não foi possivel encontrar o vídeo',
  })
  @ApiParam({ name: 'videoId', description: 'Id do video a ser baixado' })
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  @Get(':videoId/download')
  @Header('Content-Type', 'apllication/json')
  async downloadVideo(@Param('videoId') videoId: string) {
    const file = await this.videoService.downloadVideo(videoId);
    return new StreamableFile(file);
  }
}
