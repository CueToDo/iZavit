function HelloWorld() {

    //http://api.jquery.com/jQuery.ajax/

    //Anonymous functions http://docs.jquery.com/How_jQuery_Works#jQuery:_The_Basics

    //Synchronous AJAX is an oxymoron
    //Don't attempt XSS
    //get the POST data in the right format

    //Error Handling: http://en.wikipedia.org/wiki/JQuery

    // Assign handlers immediately after making the request,
    // ((and remember the jqxhr object for this request: var jqxhr = $ajax))

    // As of jQuery 1.8, the use of async: false with jqXHR ($.Deferred) is deprecated; you must use the complete/success/error callbacks.

    // Deprecation Notice: The jqXHR.success(), jqXHR.error(), and jqXHR.complete() callbacks will be deprecated in jQuery 1.8. 
    // To prepare your code for their eventual removal, use jqXHR.done(), jqXHR.fail(), and jqXHR.always() instead.

    $.ajax({ url: "http://www.izavit.com/WS/iZ.asmx/HelloWorld",
        type: "POST",
        dataType: "json",
        data: "{'UniqueUserID':'uuid'}",
        contentType: "application/json; charset=utf-8"
    })
            .done(function (result) { CBF(result); })

            .fail(
                function (xmlHttpRequest, statusText, errorThrown) {
                    alert(
                      "XML Http Request: " + JSON.stringify(xmlHttpRequest)
                      + ",\nStatus Text: " + statusText
                      + ",\nError Thrown: " + errorThrown)
                }
            )

    //.always(function () { alert("complete"); })
            ;

    // perform other work here ...

    // Set another completion function for the request above
    //jqxhr.always(function () { alert(result); });

}


function CBF(result) { alert(result.d); };