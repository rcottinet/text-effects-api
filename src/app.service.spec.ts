import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { VideoEffectDto } from './dto/videoEffect.dto';
import { ResponseCommandDto } from './dto/response.dto';

const mock: VideoEffectDto = {
  input_video_path: 'test.mp4',
  duration: 12.0,
  resolution: '123x232',
  output_video_path: 'test.mp4',
  effect: {
    text_string: 'OMG',
    font_size: 11,
    font_color: '0x777777',
    start_time: 9.0,
    end_time: 10.0,
    position: {
      x: 38,
      y: 23,
    },
  },
};

const response_mock: ResponseCommandDto = {
  output:
    "ffmpeg -i test.mp4 -vf\n    drawtext=\"enable='between(t,9,10)'\n    :text='OMG'\n    :fontcolor=0x777777\n    :fontsize=11\n    :x=38\n    :y=23\"\n    test.mp4",
};

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return response command succesfully', () => {
      expect(appService.getFFmpeg(mock)).toStrictEqual(response_mock);
    });
  });
});
