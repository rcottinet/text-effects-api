import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BadRequestException } from '@nestjs/common';
import { VideoEffectDto } from './dto/videoEffect.dto';
import { ResponseCommandDto } from './dto/response.dto';

const mock: VideoEffectDto = {
  input_video_path: 'test.mp4',
  duration: 12.0,
  resolution: '123x123',
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

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return response command succesfully', () => {
      jest
        .spyOn(appService, 'getFFmpeg')
        .mockImplementation(() => response_mock);

      expect(appController.generateFFmeg(mock)).toStrictEqual(response_mock);
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
        appController.generateFFmeg(mock_with_invalid_end_time);
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
        appController.generateFFmeg(mock_with_invalid_start_time);
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
        appController.generateFFmeg(mock_with_invalid_coordinate);
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
        appController.generateFFmeg(mock_with_invalid_coordinate);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Error String. Invalid X, Y coordinate.');
      }
    });
  });
});
