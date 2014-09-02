# Spotify Music Server
Simple Spotify Music Server and Web Client written in Node.js. I'm using it in a raspberry pi.

## Requirements
* Spotify premium account and binary app key (https://developer.spotify.com/technologies/libspotify/#application-keys)
* Libspotify (https://developer.spotify.com/technologies/libspotify/#download)

## Dependencies
* express (https://github.com/strongloop/express)
* socket.io (https://github.com/Automattic/socket.io)
* node-spotify (https://github.com/FrontierPsychiatrist/node-spotify)
* jade (https://github.com/visionmedia/jade)

## Installation
1. Put your spotify_appkey.key in ```/keys```
2. Copy ```/keys/k_dist.js``` into ```/keys/k.js``` and add your credentials
3. Install libspotify
4. Compile or download node-spotify binaries from node-spotify site. Place it inside ```node_modules```
5. npm install
6. npm start
7. Go to http://localhost:3000
