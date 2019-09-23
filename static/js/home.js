$(document).ready(function(){

    $('.case').mouseenter(function(){
        console.log('hover');
        $('.case-image', this).css('transform', 'scale(1.1, 1.1)');
    });

    $('.case').mouseleave(function(){
        $('.case-image', this).css('transform', 'scale(1, 1)');
    });
    
    $('.case').click(function(){

        window.location.href = '/case/get/' + $(this).attr('data-name');

    });

});