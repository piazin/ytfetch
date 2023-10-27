import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, Matches } from 'class-validator';

export class CreateVideoDownloadDto {
  @ApiProperty({ required: true, description: 'Url do video a ser baixado' })
  @IsUrl()
  @IsString()
  @IsNotEmpty()
  @Matches('^(https?://)?(www.youtube.com|youtu.?be)/.+$')
  youtubeVideoUrl: string;

  @ApiProperty({
    required: true,
    description: 'Qualidade do video a ser baixado',
  })
  @IsString()
  @IsNotEmpty({ message: 'Qualidade inválida' })
  qualityLabel: '1080p' | '720p' | '480p';

  @ApiProperty({ description: 'Formato a ser baixado' })
  @IsString()
  type: 'mp4' | 'webm';
}
