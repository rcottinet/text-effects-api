# Moments Text Effects API

## Description

API to provide FFmpeg command

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

Try the following command :

```bash
curl --request POST \
  --url http://localhost:3000/generate-ffmpeg \
  --header 'Content-Type: application/json' \
  --data '{
	"input_video_path": "test.mp4",
	"duration": 12.0,
	"resolution": "123x232",
	"output_video_path": "test.mp4",
	"effect": {
		"text_string": "OMG",
		"font_size": 11,
		"font_color": "0x777777",
		"start_time": 10.0,
		"end_time": 11.0,
		"position": {
			"x": 38,
			"y": 23
		}
	}
}'
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
