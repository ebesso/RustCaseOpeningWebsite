$(document).ready(function(){

    $('#deleteButton').click(function(){
        e.preventDefault();

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

    $("#editButton").click(function(e){
        e.preventDefault();

        var selected = $('input:checked')[0];
        console.log($(selected).attr('data-name'));

        window.location.replace('/admin/edit/case/' + $(selected).attr('data-name'));

    });

});