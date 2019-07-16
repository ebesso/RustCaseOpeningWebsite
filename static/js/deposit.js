$(document).ready(function(){

    $('.item-container').click(function(){

        if($(this).hasClass('selected'))$(this).removeClass('selected');
        else $(this).addClass('selected');

        $('#depositButton').html('Deposit: ' + calculateValue() + '$');

    });

    function calculateValue(){
        var value = 0;

        $('.selected').each(function(index){
            value += Number($(this).attr('data-price'));
        });

        return value;
    }

    $('#depositButton').click(function(){

        var items = $('.selected');

        var data = {
            items: []
        }

        items.each(function(index){
            data.items.push($(this).attr('data-itemid'));
        });

        $.post('/deposit', data, function(resp){

            alert(resp);

        });

    });

});
