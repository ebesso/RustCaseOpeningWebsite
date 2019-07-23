
$(document).ready(function () {

    $('.case-carousel').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: true,
        infinite: false,
        draggable: false
    });

    $('.open-button').hover(function(){
        $(this).html(`Open ${$(this).attr('data-price')}$`);
    }, function(){
        $(this).html(`${$(this).attr('data-price')}$`);
    });

    $('.open-button').click(function(){
        loadCase($(this).attr('data-name'));
    });
    $('#open-case-modal').on('show.bs.modal', function (e) {
        
        $('.owl-carousel').owlCarousel({

            loop: true,
            margin: 1,
            nav: false,
            mouseDrag: false,
            touchDrag: false,
            pullDrag: false,
            dots: false,
            autoplay: false,
            center: true,   
            autoplayTimeout: 0,
            slideSpeed: 1000,
            
            responsive: {
                0:{
                    items: 3
                },
                600:{
                    items: 5
                },
                1000:{
                    items: 10
                }
            }
    
        });
    });

    $('#open-case-modal').on('hide.bs.modal', function (e) {

    });


    $('#open-case-button').click(function(){
        openCase($(this).attr('data-name'));      
    });

    $('#won-item-ok-button').click(function(){
        $('#won-item-modal').modal('hide');
        $('#open-case-modal').modal('show');
        
    });

    var currentSlowdown = 1;

    function slowdown(){
        currentSlowdown += 1;
        $('.owl-carousel').trigger('play.owl.autoplay', [50 * currentSlowdown]);
    }

    function openWinModal(data){
        $('#won-item-info').html(`${data.item.name} | ${data.item.price}`);
        $('#won-item-image').attr('src', data.item.image);

        $('#won-item-modal').modal('show');
        $('#open-case-modal').modal('hide');
    }   

    function loadCase(name){

        $.get('/case/get/' + name, function(data){

            $('.owl-carousel').owlCarousel('destroy');
            $('.owl-carousel').empty();  
            
            $('#case-title').html(name);
            $('#open-case-button').attr('data-name', name);

            data.case.items.forEach(function(item, index){

                var image = `<img class="item element-roulette" data-item="${item.item.name}" src="${item.item.image}" style="padding: 0;">`;
    
                $('#carousel-content').append(image);

                if(index == data.case.items.length - 1){
                    $('#open-case-modal').modal('show');
                }

            });


        });


    }

    function openCase(name){


        $.post('/case/open/' + name, function(data){

            if(!data.success){
                alert(data.message);
                return;
            }

            stopping = false;
            wonData = data;

            $('#open-case-button').prop('disabled', true);

            currentSlowdown = 1;

            console.log(`Won ${data.item.name}`);
    
            $('.owl-carousel').trigger('play.owl.autoplay', [200]);
    
            setTimeout(function(){
                stopping = true;
            }, 2000);  


        });

    }
    var wonData;
    var stopping = false;

    $('.owl-carousel').on('changed.owl.carousel', function(e){
        if(stopping){
            var currentElement = $(e.target).find(".owl-item").eq(e.item.index).find('.element-roulette');
            if(currentElement.attr('data-item') == wonData.item.name){
                $('.owl-carousel').trigger('stop.owl.autoplay');
                setTimeout(function(){
                    openWinModal(wonData);
                    $('#open-case-button').prop('disabled', false);
                    stopping = false;
                }, 400);
            }
        }


    });

});

