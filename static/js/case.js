var carousel_lenght = 100;
var rolling = false;

$(document).ready(function(){

    $('#open-button').click(function(){
        if(rolling) return;
        init();
        roll();
    });
    init();

});


function init(){
    $('.item-thumbnail').remove();

    for(var i = 0; i < carousel_lenght; i++){

        var item1 = document.createElement('div');
        item1.classList.add('item-thumbnail');
        item1.classList.add('green');

        var item2 = document.createElement('div');
        item2.classList.add('item-thumbnail');
        item2.classList.add('red');

        var item3 = document.createElement('div');
        item3.classList.add('item-thumbnail');
        item3.classList.add('blue');
        
        document.getElementById('case-carousel-container').appendChild(item1);
        document.getElementById('case-carousel-container').appendChild(item2);
        document.getElementById('case-carousel-container').appendChild(item3);
        
    }
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