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
    this.validateEffect(videoEffectDto);
    return this.appService.getFFmpeg(videoEffectDto);
  }

  private validateEffect(videoEffectDto: VideoEffectDto) {
    this.validateTime(videoEffectDto);
    this.validatePosition(videoEffectDto);
  }

  /**
   * Validate effect end_time regarding effect start_time and duration
   *
   * @param videoEffectDto
   */
  private validateTime(videoEffectDto: VideoEffectDto) {
    if (
      videoEffectDto.effect.end_time <= videoEffectDto.effect.start_time ||
      videoEffectDto.effect.end_time >= videoEffectDto.duration
    ) {
      throw new BadRequestException('Error String. Invalid End Time.');
    } else if (videoEffectDto.effect.start_time >= videoEffectDto.duration) {
      throw new BadRequestException('Error String. Invalid Start Time.');
    }
  }

  /**
   * Validate coordinate regarding resolution
   *
   * @param videoEffectDto
   */
  private validatePosition(videoEffectDto: VideoEffectDto) {
    // validate coordinate regarding resolution
    const resolutionValues = videoEffectDto.resolution.split('x');
    if (
      videoEffectDto.effect.position.x > +resolutionValues[0] ||
      videoEffectDto.effect.position.y > +resolutionValues[1]
    ) {
      throw new BadRequestException('Error String. Invalid X, Y coordinate.');
    }
  }
}
