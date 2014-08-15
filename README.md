# Simple Music Server
Simple music server and web client written in Node.js. I'm using it in a raspberry pi.

## Requirements
* Spotify premium account and binary app key (https://developer.spotify.com/technologies/libspotify/#application-keys)
* Libspotify (https://developer.spotify.com/technologies/libspotify/#download)

## Dependencies
* express (https://github.com/strongloop/express)
* node-spotify (https://github.com/FrontierPsychiatrist/node-spotify)
* jade (https://github.com/visionmedia/jade)

## Installation
1. Put your spotify_appkey.key in ```/keys```
2. Copy ```/keys/k_dist.js``` into ```/keys/k.js``` and add your credentials
3. Compile or download node-spotify binaries from node-spotify site. Place it inside ```node_modules```
4. npm install
5. npm start
6. Go to http://localhost:3000
