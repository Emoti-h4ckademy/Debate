# Debate


## INSTALL

- install external dependencies
  ffmpeg: http://www.ffmpeg.org/download.html or ```brew install ffmpeg```
  graphicsmagick: http://www.graphicsmagick.org/

- install Gnu/Linux

```
apt-get install libkrb5-dev ffmpeg graphicsmagick mogodb

```

ffmpeg it's available up to Debian 8 Jessie, so for Jessie users it's needed to install libav-tools
# https://wiki.debian.org/ffmpeg
apt-get install libav-tools 

- install dependencies:
```
cd Debate && npm install
```

- Create default.json with the general config of the app:
```
cp config/default.json.personal config/default.json
```

- Add your license in default.json (get it at http://www.projectoxford.ai/subscription)


## RUNNING
- run the app:
```
$ DEBUG=Debate:* npm start
```
- run the image capturer:
```
$ npm run capture
```
