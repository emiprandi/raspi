var k = require('./keys/k'),
    spotify = require('./node_modules/node-spotify/spotify')({ appkeyFile: './keys/spotify_appkey.key' }),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

/*
 * APP
 */
var rClass = {},
    rApp = { 'playlists': {}, 'queue': {}, 'player': { 'status': 0, 'nowplaying': {} } };
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('index', { playlists: rApp.playlists });
});

rClass.log = function (msg) {
    console.log('----------------------------');
    console.log('Debug: ' + msg);
}
rClass.randomInt = function (min, max) {
    return Math.floor(Math.random() * ((max+1) - min)) + min;
}
rClass.init = function () {
    rClass.log('Server listo');
    spotify.login(k.spotify_user, k.spotify_pass, false, false);
}
rClass.playerPlayNextSong = function () {
    if (rApp.queue.length > 0) {
        var trackNro = rClass.randomInt(0, (rApp.queue.length-1)),
            //track = rApp.queue.shift();
            track = rApp.queue.splice(trackNro, 1),
            track = track[0];
        
        spotify.player.play(track);
        rClass.setNowPlaying(track);

        rClass.log('Now playing: ' + track.name + ' de ' + track.artists[0].name);
    } else {
        rClass.resetQueue();
        rClass.log('No more songs');
    }
}
rClass.playerStop = function () {
    spotify.player.stop();
}
rClass.playerPause = function () {
    spotify.player.pause();
}
rClass.playerResume = function () {
    spotify.player.resume();
}
rClass.playerSeek = function (second) {
    spotify.player.seek(parseInt(second));
}
rClass.changeStatus = function (status) {
    /*
     * 0: parado y sin canciones en la cola
     * 1: pausado con canciones en la cola
     * 2: sonando
     */
    rApp.player.status = status;
}
rClass.resetQueue = function () {
    rClass.changeStatus(0);
    rApp.player.queue = {};
    io.emit('status', rApp.player);
}
rClass.setNowPlaying = function (trkObj) {
    rClass.changeStatus(2);
    rApp.player.nowplaying = {
        song: trkObj.name,
        album: trkObj.album.name,
        artist: trkObj.artists[0].name,
        duration: trkObj.duration,
        link: trkObj.link,
        id: trkObj.link.split(':')[2]
    }
    io.emit('new song', rApp.player);
}
rClass.logout = function () {
    spotify.logout();
}


/*
 * CALLBACKS
 */
spotify.on({
    ready: function () {
        rApp.playlists = spotify.playlistContainer.getPlaylists();
        for (var pl in rApp.playlists) {
            rApp.playlists[pl].image = '/default_image_' + rClass.randomInt(1, 5) + '.png';
        }
        rClass.log('Playlists cargadas');
    }
});
spotify.player.on({
    endOfTrack: function () {
        rClass.playerPlayNextSong();
    }
});


/*
 * SOCKET
 */
io.on('connection', function (socket) {
    rClass.log('Hola');
    socket.emit('status', rApp.player);

    socket.on('set playlist', function (playlist) {
        rClass.log('Nueva playlist: ' + playlist);
        
        var pl = spotify.createFromLink(playlist);
        rApp.queue = pl.getTracks();

        rClass.playerPlayNextSong();
    });

    socket.on('player resume', function (playlist) {
        rClass.playerResume();
        rClass.changeStatus(2);
        socket.emit('status', rApp.player);
    });
    socket.on('player pause', function (playlist) {
        rClass.playerPause();
        rClass.changeStatus(1);
        socket.emit('status', rApp.player);
    });

    socket.on('disconnect', function () {
        rClass.log('Chau');
    });
});


/*
 * SERVER
 */
server.listen(3000, rClass.init);
