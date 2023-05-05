import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { VideoEffectDto } from './dto/videoEffect.dto';
import { ResponseCommandDto } from './dto/response.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  /**
   * Get FFmpeg command
   * @param videoEffectDto
   * @return response command
   */
  getFFmpeg(videoEffectDto: VideoEffectDto): ResponseCommandDto {
    this.validateEffect(videoEffectDto);

    const command = this.generateFFmpegCommand(videoEffectDto);

    this.logger.log(command);

    return {
      output: command,
    };
  }

  /**
   * Generate FFmpeg command from videoEffectDto properties
   * @param videoEffectDto
   * @return generated string command
   */
  private generateFFmpegCommand(videoEffectDto: VideoEffectDto): string {
    return (
      `ffmpeg -i ${videoEffectDto.input_video_path} -vf ` +
      `drawtext="enable='between(t,${videoEffectDto.effect.start_time},${videoEffectDto.effect.end_time})'` +
      `:text='${videoEffectDto.effect.text_string}'` +
      `:fontcolor=${videoEffectDto.effect.font_color}` +
      `:fontsize=${videoEffectDto.effect.font_size}` +
      `:x=${videoEffectDto.effect.position.x}` +
      `:y=${videoEffectDto.effect.position.y}"` +
      ` ${videoEffectDto.output_video_path}`
    );
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
