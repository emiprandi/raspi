$(function(){
    /*
     * onload actions
     */
    $('.js-control-play').hide();

    /*
     * list actions
     */
    $('.js-open-menu').click(function(){
        allowScroll(false);
        $('.js-menu').addClass('active');
        $('.js-overlay').addClass('active');
        return false;
    });
    $('.js-open-player').click(function(){
        allowScroll(false);
        $('.js-player').addClass('active');
        setTimeout(function(){
            $('.js-album-art').show();
        }, 500);
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
        $.ajax({ url: '/play/' + pl, cache: false });
        return false;
    });

    /*
     * player actions
     */
    $('.js-close-player').click(function(){
        allowScroll(true);
        $('.js-album-art').hide();
        $('.js-player').removeClass('active');
        return false;
    });
    $('.js-control-pause').click(function(){
        $('.js-player').removeClass('active');
        return false;
    });

    $('.js-album-art').click(function(){
        var trackId = $('.js-song').attr('id');
        $.ajax({ url: 'https://api.spotify.com/v1/tracks/' + trackId, cache: false }).done(function(r){
            $('.js-album-art').attr('src',r.album.images[1].url);
            //console.log(r);
        });
    });

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
