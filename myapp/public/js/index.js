(function() {

    $Container = $('#container');
    $Movies = $('.movie_details');
    $Movies.hide();

    function debounce(func, wait, immediate) {

        var timeout;

        return function() {

            var context = this,
                args = arguments;

            var callNow = immediate && !timeout;

            clearTimeout(timeout);

            timeout = setTimeout(function() {
                timeout = null;

                if (!immediate) {
                    func.apply(context, args);
                }
            }, wait);

            if (callNow) func.apply(context, args);
        };
    };


    $(function() {
        $('#searchInput').on('keyup', debounce(function(event) {
            event.preventDefault();
            var mySearchInput = $('#searchInput').val();

            // Grab the template script - HANDLEBARS
            var theTemplateScript = $('#my_template').html();

            // Compile the template - HANDLEBARS
            var theTemplate = Handlebars.compile(theTemplateScript);

            if (mySearchInput.length >= 3) {
                $.ajax({
                        method: "POST",
                        url: "/search/movie/",
                        data: {
                            movie: mySearchInput
                        },
                    })
                    .done(function(data) {
                        var context = data['Search'];
                        myLength = data['totalResults'];
                        $Movies.empty();
                        $Container.find('.results').text('You recieved: ' + myLength + ' results.').css('color', 'black');

                        function notAvl(item) {
                            if (item.Poster == 'N/A') {
                                item.Poster = '';
                            }
                            return item;
                        }
                        context = context.map(notAvl);

                        // Pass our data to the template - HANDLEBARS
                        var theCompiledHtml = theTemplate(data);

                        // Add the compiled html to the page - HANDLEBARS
                        $Movies.html(theCompiledHtml);

                        $Movies.show();
                    });

            } else {
                $Container.find('.results').text('You must enter at least 3 letters!').css('color', 'red');

            }
        }, 400));
    });

})()