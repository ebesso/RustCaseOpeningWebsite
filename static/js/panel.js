$(document).ready(function(){

    $('#deleteButton').click(function(){

        var checkboxes = $('input:checked');

        var names = []

        checkboxes.each(function(index){
            names.push($(this).attr('data-name'));

        });

        var data = {
            cases: names
        }

        $.post('/admin/delete/case', data, function(resp){
            alert(resp);
        });

        

    });

});