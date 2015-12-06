# Debate

- install external dependencies
  ffmpeg: http://www.ffmpeg.org/download.html or ```brew install ffmpeg```
  graphicsmagick: http://www.graphicsmagick.org/


- install dependencies:
```
cd Debate && npm install
```

- Create default.json with the general config of the app:
```
cp config/default.json.personal config/default.json
```

- Add your license in default.json (get it at http://www.projectoxford.ai/subscription)


- run the app:
```$ DEBUG=Debate:* npm start```

- run the image capturer:
```$ npm run capture```
