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
raspi.playNextSong = function () {
    if (app.player.queue.length > 0) {
        var track = app.player.queue.shift();
        
        spotify.player.play(track);
        raspi.log('Ahora suena: ' + track.name + ' de ' + track.artists[0].name, 'OK');
    } else {
        raspi.resetQueue();
        raspi.log('No hay más canciones', 'OK');
    }
}
raspi.resetQueue = function () {
    app.player.queue = {};
}


/*
 * CALLBACKS
 */
spotify.on({
    ready: function () {
        app.playlists = spotify.playlistContainer.getPlaylists();
        raspi.log('Playlists', 'OK');
        raspi.log('Todo listo!', 'OK');
    }
});
spotify.player.on({
    endOfTrack: function () {
        raspi.playNextSong();
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

    raspi.playNextSong();
    res.status(200).end();
});


/*
 * SERVER
 */
serv.listen(3000, raspi.init);
