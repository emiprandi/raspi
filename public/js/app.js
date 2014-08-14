$(function(){
    $('.js-open-menu').click(function(){
        $('.js-menu').addClass('active');
        $('.js-overlay').addClass('active');
        return false;
    });

    $('.js-overlay').click(function(){
        $('.js-menu').removeClass('active');
        $('.js-overlay').removeClass('active');
        return false;
    });

    $('.js-list-item').click(function(){
        var pl = $(this).prop('href');
        $.ajax({ url: '/play/' + pl, cache: false })
            .done(function( res ) {
                //console.log(res);
            });
        return false;
    });
});
