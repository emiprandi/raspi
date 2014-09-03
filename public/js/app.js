$(function(){
    /*
     * onload actions
     */
    var socket = io();
    //$('.js-control-play').hide();

    /*
     * list actions
     */
    $('.js-open-menu').click(function(){
        allowScroll(false);
        $('.js-menu').addClass('active');
        $('.js-overlay').addClass('active');
        return false;
    });
    $('.js-overlay').click(function(){
        allowScroll(true);
        $('.js-menu').removeClass('active');
        $(this).removeClass('active');
        return false;
    });
    $('.js-list-item').click(function(){
        var pl = $(this).prop('href');
        socket.emit('set playlist', pl);
        return false;
    });

    /*
     * player actions
     */
    $('.js-control-pause').click(function(){
        $('.js-app').removeClass('playing');
        return false;
    });

    /*
     * socket actions
     */
    socket.on('connect', function(){
        $('.js-warning').fadeOut();
    });
    socket.on('disconnect', function(){
        $('.js-warning').show();
    });
    socket.on('status', function(player){
        setNowPlaying(player);
    });
    socket.on('new song', function(player){
        setNowPlaying(player);
    });

    function setNowPlaying(player){
        $('.js-app').addClass('playing');
        $('.js-song').text(player.nowplaying.song);
        $('.js-artist').text(player.nowplaying.artist);
        $('.js-duration').text(player.nowplaying.duration);
        $.ajax({ url: 'https://api.spotify.com/v1/tracks/' + player.nowplaying.id, cache: false }).done(function(r){
            $('.js-album-art').attr('src',r.album.images[1].url);
        });
    }

    function allowScroll(act){
        if(act){
            $('body').removeClass('no-scroll');
            $('body').off('touchmove');
        }else{
            $('body').addClass('no-scroll');
            $('body').on('touchmove', function(e){ e.preventDefault(); });
        }
    }
});
