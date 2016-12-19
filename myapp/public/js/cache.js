(function() {

    $placeHolder = $('#place_holder');

    $(function() {
        $('.btn-success').on('click', function() {
            // Grab the template script - HANDLEBARS
            var theTemplateScript = $('#my_template_cache').html();

            // Compile the template - HANDLEBARS
            var theTemplate = Handlebars.compile(theTemplateScript);

            $.ajax({
                    method: 'POST',
                    url: '/cache/information/',
                    data: {
                        'submit': true
                    },
                })
                .done(function(data) {
                    $placeHolder.empty();

                    var context = {
                        cache: []
                    };

                    for (var i = 0; i < data.length; i++) {
                        context['cache'].push({ found: data[i] });
                    }
                    // Pass our data to the template - HANDLEBARS
                    var theCompiledHtml = theTemplate(context);

                    // Add the compiled html to the page - HANDLEBARS
                    $placeHolder.html(theCompiledHtml);


                    $placeHolder.show();
                });

        });
    });


    $(function() {
        $('.btn-danger').on('click', function() {
            $.ajax({
                    method: 'DELETE',
                    url: '/cache/information/',
                    data: {
                        'submit': true
                    },
                })
                .done(function(data) {
                    $placeHolder.hide();
                });

        });
    });

})()