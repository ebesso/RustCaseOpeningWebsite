$(document).ready(function(){

    var value = 0;

    $('.item').click(function(){
        
        if($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            value -= Number($(this).attr('data-value'));
        }
        else {
            $(this).addClass('selected');
            value += Number($(this).attr('data-value'));
            
        }
        
        $('#value').html('Value: ' + value + '$');

    });

});