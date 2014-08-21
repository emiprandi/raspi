var k = require('./keys/k'),
    spotify = require('./node_modules/node-spotify/spotify')({ appkeyFile: './keys/spotify_appkey.key' }),
    express = require('express'),
    serv = express();

/*
 * APP
 */
var raspi = {},
    app = { 'playlists': {}, 'player': { 'playing': false, 'queue': {} } };
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
        //var track = app.player.queue.shift();
        var trackNro = raspi.randomInt(0, app.player.queue.length);
            track = app.player.queue[trackNro];

        delete app.player.queue[trackNro];
        
        spotify.player.play(track);
        raspi.log('Ahora suena: ' + track.name + ' de ' + track.artists[0].name, 'OK');
    } else {
        raspi.resetQueue();
        raspi.log('No hay más canciones', 'OK');
    }
}
raspi.playerStop = function () {
    spotify.player.stop();
}
raspi.resetQueue = function () {
    app.player.queue = {};
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

serv.get('/stop', function(req, res) {
    raspi.playerStop();
    res.status(200).end();
});


/*
 * SERVER
 */
serv.listen(3000, raspi.init);
