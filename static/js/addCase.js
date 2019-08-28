$(document).ready(function(){

    calculatePrice();

    $('#addItemButton').click(function(){

        var item = document.getElementsByClassName('item')[0];
        var list = document.getElementById('item-list');

        var newItem = item.cloneNode(true);

        list.appendChild(newItem);
        calculatePrice();

    });

    $(document).on('input', function(){
        calculatePrice();
    });

    function calculatePrice(){

        var price = 0;

        $('.item').each(function(index){

            var option = $(this).find('select option:selected');

            price += Number(option.attr('data-price')) * (Number($(this).find('input').val()/100));
        });

        $('#casePrice').html('Price: ' + Math.round(price * 100)/100  + '$');
        $('#receiveAmount').html('You will receive: ' + (Math.round(price * 0.1 * 100) / 100) + '$');
        
    }

    $('#submitButton').click(function(){
        if($('#case-form').valid()){

            var data = {
                name: $('#nameInput').val(),
                price: $('#priceInput').val(),
                image: $('#imageInput').val(),
    
                items: []
            };

            var totalPercentage = 0;

            $('.item').each(function(index){

                if($(this).find('select').valid() == false){
                    alert('Invalid form');
                    return;
                }if($(this).find('input').valid() == false){
                    alert('Invalid form');
                    return;
                }

                var option = $(this).find('select option:selected');
                var chance = Number($(this).find('input').val());

                if(chance <= 0){
                    alert('Chance must be greater than 0');
                    return;
                }

                data.items.push({
                    
                    name: option.attr('data-name'),
                    chance: chance
                    
                });

                totalPercentage += chance
    
            });

            if(totalPercentage != 100){
                alert('Invalid form, Sum of chances must be 100');
                return;
            }

            $.post('/admin/create/case', data, function(resp){

                alert(resp);

            });

        }else{
            alert('Invalid form');
        }
    

    });

    $('#confirmButton').click(function(){

        if($('#case-form').valid()){

            var data = {
                name: $('#nameInput').val(),
                data: {
                    price: $('#priceInput').val(),
                    image: $('#imageInput').val(),

                    items: []
                    
                }
            };

            var totalPercentage = 0;

            $('.item').each(function(index){

                if($(this).find('select').valid() == false){
                    alert('Invalid form');
                    return;
                }if($(this).find('input').valid() == false){
                    alert('Invalid form');
                    return;
                }

                var option = $(this).find('select option:selected');
                var chance = Number($(this).find('input').val());

                if(chance <= 0){
                    alert('Chance must be greater than 0');
                    return;
                }

                data.data.items.push({
                    
                    name: option.attr('data-name'),
                    chance: chance
                    
                });

                totalPercentage += chance
    
            });

            if(totalPercentage != 100){
                alert('Invalid form, Sum of chances must be 100');
                return;
            }

            $.post('/admin/edit/case', data, function(resp){

                alert(resp);

            });

        }else{
            alert('Invalid form');
        }

    });

});
