# Debate

- install graphicsmagick in your system:
```
INSERT_YOUR_SYSTEM_INSTALL_COMMAND_HERE graphicsmagick
```

- install dependencies:
```
cd Debate && npm install
```

- Create default.json with the general config of the app:
```
cp config/default.json.personal config/default.json
```

- Add your license in default.json

- Run the app:
```
DEBUG=Debate:* npm start
```