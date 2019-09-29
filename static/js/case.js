
var carousel_lenght = 100;
var rolling = false;

var itemThumbnails;
var elementIndex = 70;


$(document).ready(function(){
    $('#open-button').click(function(){
    
        var name = $('#case-info').attr('data-name');
    
        if(rolling) return;
    
        $.post('/case/open/' + name, function(data){
            if(!data.success){
                alert(data.message);
                return;
            }else{
                var price = Number($('#case-info').attr('data-price'));
                var balance = Number($('#profile-balance').html().replace('$', ''));
                $('#profile-balance').html(`${balance-price}$`);

                init();
                roll(data.item);
            }
    
        });

    });
    init();  

});


function init(){
    $('.item-thumbnail').first().stop(true);
    $('.item-thumbnail').first().css('margin-left', 0);
    $('#case-carousel-container').children().hide();
    $('#case-carousel-container').css("display", "none");    

}

function roll(item){

    console.log('Rolling...');

    $("#vertical-line").hide();
    rolling = true;

    var element = $('.item-thumbnail')[elementIndex];

    $(element).attr('src', item.image);

    $('#case-image').fadeOut("slow", function(){
        $('#case-carousel-container').css("display", "block");
        $('#case-carousel-container').children().fadeIn("slow", function(){
            
            $('.item-thumbnail').first().animate({marginLeft: -((elementIndex - 2)*85 + 40)}, 5000, 'easeOutExpo', function(){                
                init();

                $('#case-image').fadeIn("slow");
                rolling  = false;
                
                $('#modal-image').attr('src', item.image);
                $('#modal-item-name').html(item.name);
                $('#modal-item-price').html(item.price + '$');

                $('#win-modal').modal({
                    fadeDuration: 250,
                    closeExisting: true,
                    escapeClose: true,

                });

            });
            

            $("#vertical-line").show();
        
        });

    });    
}