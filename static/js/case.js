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
                init();
                roll(data.item);
            }

        });
    });

    init();  

});


function init(){

    $('#case-carousel-container').children().hide();
    $('#case-carousel-container').css("display", "none");    

    $('.item-thumbnail').first().animate({marginLeft: 0});
    
}

function roll(item){

    $("#vertical-line").hide();
    rolling = true;

    $('#case-image').fadeOut("slow", function(){
        $('#case-carousel-container').css("display", "block");
        $('#case-carousel-container').children().fadeIn("slow", function(){
             
            $('.item-thumbnail').first().animate({marginLeft: -5476}, 5000, 'easeOutExpo', function(){
                init();
                $('#case-image').fadeIn("slow");
                rolling  = false;
                
                $('#modal-image').attr('src', item.image);
                $('#modal-item-name').html(item.name);
                $('#modal-item-price').html(item.price + '$');

                $('#win-modal').modal({
                    fadeDuration: 250
            
                });
            });

            $("#vertical-line").show();
        
        });
        

    });
    
}