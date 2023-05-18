$(document).ready(function(){

    load_data();

    // load json data funtion


    function load_data()
    {
        var seconds = new Date() / 1000;
        $.getJSON("data.json?"+seconds+"", function(data){
            console.log(data);
            var data_arr = [];
            $.each(data,function(key,val){

                var sub_array = {
                    'id' : val.id,
                    'name' : val.name,
                    'images' : "<img src='images/"+val.images+"'/ alt='Avatar' class='rounded-circle' style='width: 80px;'>",
                    'address' : val.address,
                    'gender' : val.gender,
                    'action' : '<button type="button" class="btn btn-warning btn-sm edit" data-id="'+val.id+'">Edit</button>&nbsp;<button type="button" class="btn btn-danger btn-sm delete" data-id="'+val.id+'">Delete</button>&nbsp;<button type="button" class="btn btn-success btn-sm view" data-id="'+val.id+'">View</button>'
                };

            data_arr.push(sub_array);
            });
           // return false;
            // data.sort(function(a,b){

            //     return b.id - a.id;

            // });


            // for(var count = 0; count < data.length; count++)
            // {
            //     var sub_array = {
            //         'id' : data[count].id,
            //         'name' : data[count].name,
            //         'image' : data[count].image,
            //         'address' : data[count].address,
            //         'gender' : data[count].gender,
            //         'action' : '<button type="button" class="btn btn-warning btn-sm edit" data-id="'+data[count].id+'">Edit</button>&nbsp;<button type="button" class="btn btn-danger btn-sm delete" data-id="'+data[count].id+'">Delete</button>'
            //     };

            //     data_arr.push(sub_array);
            // }
            $('#sample_data').DataTable({
                ordering: true,
                data : data_arr,
                "paging": false,
                "bFilter": false,
                "bInfo": false,

                columns : [
                    { data : "id" },
                    { data : "name" },
                    { data : "images" },
                    { data : "address" },
                    { data : "gender" },
                    {data : "action" }
                ]
            });
        })
    }

    // here we setup model/form before adding
    $('#add_data').click(function(){

       // add Titile in add form
        $('#dynamic_modal_title').text('Add Data');

        // Reset form before adding data
        $('#sample_form')[0].reset();

        // Add form action
        $('#action').val('Add');

        // add Buttonn text on form

        $('#action_button').text('Add');

        // Remove button Text

        $('.text-danger').text('');

        // show add model box
        $('#action_modal').modal('show');

    });
    $('#sample_form').on('submit', function(event){
        event.preventDefault();
        var formdata=new FormData($("#sample_form")[0]);

        $.ajax({
            url:"action",
            method:"POST",
            headers:{ 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            data:formdata,
            dataType:"JSON",
            cache: false,
            processData: false,
            contentType: false,
            beforeSend:function()
            {
               // $('#action_button').attr('disabled', 'disabled');
            },
            success:function(data)
            {
                if($.isEmptyObject(data.error))
                {
                    console.log(data.filedata);
                    $('#message').html('<div class="alert alert-success">'+data.success+'</div>');

                    $('#action_modal').modal('hide');

                    $('#sample_data').DataTable().destroy();

                    load_data();

                    setTimeout(function(){
                        $('#message').html('');
                    }, 5000);
                    //alert(data.success);

                }
                else
                {
                    printError(data.error);

                }

            },
            error:function()
            {
                alert('something is wrong');
            }
        });

    });

    function printError(msg)
    {
        $.each(msg,function(key,value){

            $("#"+key+"_error").text(value);
        });
    }

    // delete button event
    $(document).on('click', '.delete', function(){

        var id = $(this).data('id');

        if(confirm("Are you sure you want to delete this data?"))
        {
            $.ajax({
                url:"delete",
                method:"POST",
                data:{id:id},
                dataType:"JSON",
                headers:{ 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                success:function(data)
                {
                  // alert(data.success);
                    $('#message').html('<div class="alert alert-success">'+data.success+'</div>');
                    $('#sample_data').DataTable().destroy();
                    load_data();
                    setTimeout(function(){
                        $('#message').html('');
                    }, 5000);
                },
                error:function()
                {
                    alert('something is wrong');
                }
            });
        }

    });


    // edit button event
    $(document).on('click', '.edit', function(){
        var id = $(this).data('id');

        $('#dynamic_modal_title').text('Edit Data');

        $('#action').val('Edit');

        $('#action_button').text('Edit');

        $('.text-danger').text('');

        $('#action_modal').modal('show');
        $.ajax({
            url:"edit",
            method:"POST",
            data:{id:id},
            dataType:"JSON",
            headers:{ 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            success:function(data)
            {

                $('#name').val(data.data_file.name);
                $('#address').val(data.data_file.address);
                $('#gender').val(data.data_file.gender);
                $('#images').val(data.data_file.images);
                $('#id').val(data.data_file.id);
            },
            error:function()
            {
                alert('something is wrong');
            }
        });
    });
    $(document).on('click', '.view', function(){
        var id = $(this).data('id');
        //alert(id);
        $('#dynamic_modal_title').text('View Data');
        $('#view_modal').modal('show');
        $.ajax({
            url:"edit",
            method:"POST",
            data:{id:id},
            dataType:"JSON",
            headers:{ 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            success:function(data)
            {
                //alert(data.success);
                $('#view_name').html(' : '+data.data_file.name);
                 $('#view_img').html("<img src='images/"+data.data_file.images+"' alt='Avatar' class='rounded-circle' style='width: 80px;'/>");
                 $('#view_add').html(' : '+data.data_file.address);
                 $('#view_gender').html(' : '+data.data_file.gender);
                // $('#id').val(data.data_file.id);
            },
            error:function()
            {
                alert('something is wrong');
            }
        });
    });
});
