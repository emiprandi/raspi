$(function(){
    /*
     * onload actions
     */
    var socket = io();

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
    $('.js-control-play').click(function(){
        socket.emit('player resume');
        return false;
    });
    $('.js-control-pause').click(function(){
        socket.emit('player pause');
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
        switch(player.status){
            case 0:
                $('.js-app').removeClass('playing');
                break;
            case 1:
                $('.js-app').addClass('playing');
                setPlayState('play');
                break;
            case 2:
                $('.js-app').addClass('playing');
                setPlayState('pause');
                break;
        }
        if(!$.isEmptyObject(player.nowplaying)){
            $('.js-song').text(player.nowplaying.song);
            $('.js-artist').text(player.nowplaying.artist);
            var m = Math.floor(player.nowplaying.duration/60);
            var s = player.nowplaying.duration-m*60;
            $('.js-duration').text(m+':'+s);
            
            $.ajax({ url: 'https://api.spotify.com/v1/tracks/' + player.nowplaying.id, cache: false }).done(function(r){
                $('.js-album-art').attr('src',r.album.images[1].url);
            });
        }
    }

    function setPlayState(state){
        if(state == 'play'){
            $('.js-control-pause').hide();
            $('.js-control-play').show();
        }else{
            $('.js-control-play').hide();
            $('.js-control-pause').show();
        }
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
