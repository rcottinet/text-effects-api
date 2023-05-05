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
    "ffmpeg -i test.mp4 -vf drawtext=\"enable='between(t,9,10)':text='OMG':fontcolor=0x777777:fontsize=11:x=38:y=23\" test.mp4",
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
  });
});
