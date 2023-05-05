import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

const resolution_regex = /^\d+x\d+$/;
const font_color_regex = /^\dx\d{6}$/;
const mp4_extension_regex = /([a-zA-Z0-9\s_\\.\-\(\):])+(.mp4)$/;

class Coordinate {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly x: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly y: number;
}

class EffectDto {
  @IsNotEmpty()
  @IsString()
  readonly text_string: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Coordinate)
  readonly position: Coordinate;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly font_size: number;

  @IsNotEmpty()
  @IsString()
  @Matches(font_color_regex, {
    message: 'Invalid font color',
  })
  readonly font_color: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly start_time: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly end_time: number;
}

export class VideoEffectDto {
  @IsNotEmpty()
  @IsString()
  @Matches(mp4_extension_regex, {
    message: 'Invalid input_video_path : Expected <file>.mp4 path.',
  })
  readonly input_video_path: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly duration: number;

  @IsNotEmpty()
  @IsString()
  @Matches(resolution_regex, {
    message: 'Invalid resolution',
  })
  readonly resolution: string;

  @IsNotEmpty()
  @IsString()
  @Matches(mp4_extension_regex, {
    message: 'Invalid output_video_path : Expected <file>.mp4 path.',
  })
  readonly output_video_path: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EffectDto)
  readonly effect: EffectDto;
}
