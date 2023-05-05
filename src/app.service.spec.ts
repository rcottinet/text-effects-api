import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { VideoEffectDto } from './dto/videoEffect.dto';
import { ResponseCommandDto } from './dto/response.dto';
import { BadRequestException } from '@nestjs/common';

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
    "ffmpeg -i test.mp4 -vf drawtext=\"enable='between(t,9,10)':text='OMG':fontcolor=0x777777:fontsize=11:x=38:y=23\" test.mp4",
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

    it('should throw an exception if end time is not valid', () => {
      const mock_with_invalid_end_time = {
        ...mock,
        effect: {
          ...mock.effect,
          end_time: 7.0,
        },
      };

      try {
        appService.getFFmpeg(mock_with_invalid_end_time);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Error String. Invalid End Time.');
      }
    });

    it('should throw an exception if start time is not valid', () => {
      const mock_with_invalid_start_time = {
        ...mock,
        duration: 8,
      };

      try {
        appService.getFFmpeg(mock_with_invalid_start_time);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Error String. Invalid End Time.');
      }
    });

    it('should throw an exception if coordinate x is not valid', () => {
      const mock_with_invalid_coordinate = {
        ...mock,
        effect: {
          ...mock.effect,
          position: {
            ...mock.effect.position,
            x: 124,
          },
        },
      };

      try {
        appService.getFFmpeg(mock_with_invalid_coordinate);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Error String. Invalid X, Y coordinate.');
      }
    });

    it('should throw an exception if coordinate y is not valid', () => {
      const mock_with_invalid_coordinate = {
        ...mock,
        effect: {
          ...mock.effect,
          position: {
            ...mock.effect.position,
            y: 124,
          },
        },
      };

      try {
        appService.getFFmpeg(mock_with_invalid_coordinate);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Error String. Invalid X, Y coordinate.');
      }
    });
  });
});
