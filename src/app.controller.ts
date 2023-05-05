import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { VideoEffectDto } from './dto/videoEffect.dto';
import { ResponseCommandDto } from './dto/response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('generate-ffmpeg')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  generateFFmeg(@Body() videoEffectDto: VideoEffectDto): ResponseCommandDto {
    return this.appService.getFFmpeg(videoEffectDto);
  }
}
