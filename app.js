var k = require('./keys/k'),
    spotify = require('./node_modules/node-spotify/spotify')({ appkeyFile: './keys/spotify_appkey.key' }),
    express = require('express'),
    serv = express();

/*
 * APP
 */
var raspi = {},
    app = { 'playlists': {}, 'player': { 'playing': false, 'nowplaying': {}, 'queue': {} } };
serv.set('views', __dirname + '/views');
serv.set('view engine', 'jade');
serv.use(express.static(__dirname + '/public'));

raspi.log = function (msg, status) {
    console.log('----------------------------');
    console.log('RASPI ' + status + ': ' + msg);
}
raspi.init = function () {
    raspi.log('Servidor', 'OK');
    spotify.login(k.spotify_user, k.spotify_pass, false, false);
}
raspi.playerPlayNextSong = function () {
    if (app.player.queue.length > 0) {
        var trackNro = raspi.randomInt(0, app.player.queue.length),
            //track = app.player.queue.shift();
            track = app.player.queue.splice(trackNro, 1),
            track = track[0];
        
        spotify.player.play(track);
        raspi.setNowPlaying(track);

        app.player.playing = true;
        raspi.log('Ahora suena: ' + track.name + ' de ' + track.artists[0].name, 'OK');
    } else {
        raspi.resetQueue();
        app.player.playing = false;
        raspi.log('No hay más canciones', 'OK');
    }
}
raspi.playerSeek = function (second) {
    spotify.player.seek(parseInt(second));
}
raspi.playerStop = function () {
    spotify.player.stop();
}
raspi.resetQueue = function () {
    app.player.queue = {};
}
raspi.setNowPlaying = function (trkObj) {
    app.player.nowplaying = {
        song: trkObj.name,
        album: trkObj.album.name,
        artist: trkObj.artists[0].name,
        duration: trkObj.duration,
        link: trkObj.link,
        id: trkObj.link.split(':')[2]
    }
}
raspi.randomInt = function (min, max) {
    return Math.floor(Math.random() * ((max+1) - min)) + min;
}


/*
 * CALLBACKS
 */
spotify.on({
    ready: function () {
        app.playlists = spotify.playlistContainer.getPlaylists();
        for (var pl in app.playlists) {
            app.playlists[pl].image = '/default_image_' + raspi.randomInt(1, 5) + '.png';
        }
        raspi.log('Playlists', 'OK');
        raspi.log('Todo listo!', 'OK');
    }
});
spotify.player.on({
    endOfTrack: function () {
        raspi.playerPlayNextSong();
    }
});


/*
 * ROUTES
 */
serv.get('/', function(req, res) {
    res.render('index', { app: app });
});

serv.get('/play/:pl', function(req, res) {
    var pl = spotify.createFromLink(req.params.pl);
    app.player.queue = pl.getTracks();

    raspi.playerPlayNextSong();
    res.status(200).end();
});

serv.get('/seek/:s', function(req, res) {
    raspi.playerSeek(req.params.s);
    res.status(200).end();
});

serv.get('/stop', function(req, res) {
    raspi.playerStop();
    res.status(200).end();
});

serv.get('/nowplaying', function(req, res) {
    res.send(app.player.nowplaying);
});


/*
 * SERVER
 */
serv.listen(3000, raspi.init);
