var k = require('./keys/k'),
    spotify = require('./node_modules/node-spotify/spotify')({ appkeyFile: './keys/spotify_appkey.key' }),
    express = require('express'),
    app = express();

/*
 * APP
 */
var raspi = { 'app': {}, 'playlists': {}, 'player': { 'queue': {} } };
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

raspi.app.log = function(msg, status) {
    console.log('----------------------------');
    console.log('RASPI ' + status + ': ' + msg);
}
raspi.app.init = function() {
    raspi.app.log('Servidor', 'OK');
    spotify.login(k.spotify_user, k.spotify_pass, false, false);
}
raspi.app.resetQueue = function() {
    raspi.player.queue = {};
}


/*
 * CALLBACKS
 */
spotify.on({
    ready: function () {
        raspi.app.log('Spotify', 'OK');
        raspi.playlists = spotify.playlistContainer.getPlaylists();
    }
});
spotify.player.on({
    endOfTrack: function () {
        raspi.app.log('Fin de la canción', 'OK');
    }
});


/*
 * ROUTES
 */
app.get('/', function(req, res) {
    res.render('index', { playlists: raspi.playlists, queue: raspi.player.queue });
});

app.get('/play/:pl', function(req, res) {
    var pl = spotify.createFromLink(req.params.pl);
    var track = pl.getTrack(0);

    raspi.app.log('Ahora suena: ' + track.name + ' de ' + track.artists[0].name, 'OK');
    spotify.player.play(track);
    
    res.send('ok');
});


/*
 * SERVER
 */
app.listen(3000, raspi.app.init);
