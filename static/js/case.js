var carousel_lenght = 100;
var rolling = false;

var itemThumbnails;

$(document).ready(function(){

    itemThumbnails = $('#case-carousel-container').children();

    $('#open-button').click(function(){
    
        var name = $('#case-name').attr('data-name');
    
        $.post('/case/open/' + name, function(data){
            if(!data.success){
                alert(data.message);
                return;
            }else{
                alert(data.item.name);
                // init();
                // roll(data.item);
            }

        });
    });

    init();

});


function init(){
    $('.item-thumbnail').remove();

    // while($('#case-carousel-container').children().length < 100){
    //     var newItem = $('.item-thumbnail')[Math.random(0, $('.item-thumbnail').length) - 1].clone();
    //     newItem.appendTo('#case-carousel-container');
    // }

    $('#case-carousel-container').children().hide();
    $('#case-carousel-container').css("display", "none");    
    
}

function roll(){

    $("#vertical-line").hide();
    rolling = true;

    $('#case-image').fadeOut("slow", function(){
        $('#case-carousel-container').css("display", "block");
        $('#case-carousel-container').children().fadeIn("slow", function(){
             
            $('.item-thumbnail').first().animate({marginLeft: -5476}, 5000, 'easeOutExpo', function(){
                init();
                $('#case-image').fadeIn("slow");
                rolling  = false;

                $('#win-modal').modal({
                    fadeDuration: 250
            
                });
            });

            $("#vertical-line").show();
        
        });
        

    });
    



}