$(document).ready(function(){

    $('.item-icon').click(function(){

        if($(this).hasClass('selected'))$(this).removeClass('selected');
        else $(this).addClass('selected');



    });

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
