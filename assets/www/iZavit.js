function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';

    alert('Connection type: ' + states[networkState]);
}

function AllNewOrUpdatable(){
    if($("#rbtnViewNewIssues").is(':checked')){return "N"}
    else if($("#rbtnViewUpdatableIssues").is(':checked')) {return "U"}
    else return "A"
}

function ping() {

    $.ajax(
        { url: 'http://www.iZavit.com' }
    )
    .done(function () { 
        //Why are we testing lsJsonSettings here???
        //What happens if the test fails???
        if (lsJsonSettings.emailHash) {IssueContendersSelect()} }
    )
    .fail(
        function (xmlHttpRequest, statusText, errorThrown) {
            navigator.notification.alert('The iZavit webservers cannot be reached at this time. Please try again later', null, 'Web service error')
        }
    )
}

function setHeaderAuthenticationValues(xhr) {

    xhr.setRequestHeader('EmailHash', lsJsonSettings.emailHash);
    xhr.setRequestHeader('SessionKey', lsJsonSettings.sessionKey);

    //alert('Set Authentication Headers ' + lsJsonSettings.emailHash + ' ' + lsJsonSettings.sessionKey)

}

function promptRegistration() {
    //alert("prompting");
    $("#hSignInOrRegister").html("register");
    $("#buttonSignIn").html("register");
    $("#aSignIn").click();
}

function SignIn(emailAddress, password) {

    //var element = document.getElementById('deviceProperties');

    try {

        //element.innerHTML = 'Device uuid: ' + device.uuid
        //'Device Name: ' + device.name + '<br />' +
        //'Device Cordova: ' + device.cordova + '<br />' +
        //'Device Platform: ' + device.platform + '<br />' +            
        //'Device Version: ' + device.version;

        $.ajax(
                    {
                        //http://gregsramblings.com/2011/10/12/stupid-phonegap-tricks-loading-external-content/
                        //in MainActivity.java: 
                        //public void onCreate
                        //super.setBooleanProperty("loadInWebView", true);

                        //How do you make a call to a webservice when the Same Origin Policy is enforced?
                        //http://stackoverflow.com/questions/2697557/accessing-web-service-from-jquery-cross-domain

                        //$.mobile.allowCrossDomainPages
                        //http://jquerymobile.com/test/docs/pages/phonegap.html

                        url: "http://www.izavit.com/WS/iZ.asmx/SignInPassword",
                        contentType: "application/json; charset=utf-8",
                        type: "POST",

                        data: '{"EmailAddress":"' + emailAddress + '","Password":"' + password + '"}',
                        dataType: "json"

                        // As of jQuery 1.8, the use of async: false with jqXHR ($.Deferred) is deprecated; you must use the complete/success/error callbacks.
                        //As of jQuery 1.5, the $.ajax() method returns the jqXHR object, which is a superset of the XMLHTTPRequest object. For more information, see the jqXHR section of the $.ajax entry
                    }
                )

                .done(
                    function (response) {
                        try {
                            if (response.d.Success) {
                                //alert('Sign in success');
                                
                                lsSaveSettings(response.d.EmailHash, response.d.SessionKey);
                                //alert('Sign in details saved');

                                IssueContendersSelect();
                            } else {
                                alert(response.d.Message);
                            };
                        } catch (e) {
                            alert("Sign in error: " + e.Message)
                        };
                    }
                )

                .fail(
                    function (xmlHttpRequest, statusText, errorThrown) {
                        alert("Sign in fail: XML Http Request: " + JSON.stringify(xmlHttpRequest)
                          + ",\nStatus Text: " + statusText
                          + ",\nError Thrown: " + errorThrown)
                    }
                )


    } catch (err) {
        alert("Sign in error caught: " + err.Message);
    }

}


function Register(EMailAddress) {

    $.ajax(
                { url: "http://www.izavit.com/WS/iZ.asmx/PhoneEMailRegister",
                    contentType: "application/json; charset=utf-8",
                    type: "POST",
                    data: '{"UniqueUserID":"' + device.uuid + '","EmailAddress":"' + EMailAddress + '"}',
                    dataType: "json"
                }
            )

            .done(
                function (response) {
                    try {
                        if (!response.d.Success) {
                            alert(response.d.Message);
                        } else {
                            alert(response.d.Message);
                        };
                    } catch (e) {
                        alert(e.Message)
                    };
                }
            )

            .fail(
                function (xmlHttpRequest, statusText, errorThrown) {
                    alert("Registration failure: XML Http Request: " + JSON.stringify(xmlHttpRequest)
                      + ",\nStatus Text: " + statusText
                      + ",\nError Thrown: " + errorThrown)
                }
            )
}

function quitiZavit() {
    navigator.app.exitApp(); 
}

function MustSignIn() {
    //TODO Change this alert to a notification
    alert("Please sign in");
    document.addEventListener("backbutton", quitiZavit, false);
    $.mobile.changePage($('#divSignIn'));
}

function IssueContendersSelect() {

    ShowElement('imgALG');

    //alert('IssueContendersSelect');
    $.ajax(
        { url: "http://www.izavit.com/WS/iZ.asmx/IssueContendersSelect",
            contentType: "application/json; charset=utf-8",
            type: "POST",
            beforeSend: setHeaderAuthenticationValues,
            data: '{"AllNewOrUpdatable":"' + AllNewOrUpdatable() + '"}',
            dataType: "json"
        }
    )

    .done(
        function (response) {
            try {
                //alert('Auth: ' + response.d.Authenticated);
                //alert(response.d.Message);
                if (!response.d.Authenticated) {
                    navigator.splashscreen.hide(); 
                    MustSignIn();
                } else if (!response.d.Success) {
                    navigator.splashscreen.hide(); 
                    alert("Issue Contenders Select not successful: " + response.d.Message);
                } else {
                    //must wait a little longer before hiding splash screen
                    IssueContender();
                };
            } catch (e) {
                navigator.splashscreen.hide(); 
                alert("Issue Contenders Select Error: " + e.Message)
            };
        }
    )

    .fail(
        function (xmlHttpRequest, statusText, errorThrown) {
            navigator.splashscreen.hide(); 
            alert("Issue Contenders Select Fail XML Http Request: " + JSON.stringify(xmlHttpRequest)
                + ",\nStatus Text: " + statusText
                + ",\nError Thrown: " + errorThrown)
        }
    )

    .always(function(){HideElement('imgALG');})
}

function IssueContender() {

    //navigator.splashscreen.hide(); is in "always"

    ShowElement('imgALG');

    $.ajax(
        { url: "http://www.izavit.com/WS/iZ.asmx/IssueContender",
            contentType: "application/json; charset=utf-8",
            type: "POST",
            beforeSend: setHeaderAuthenticationValues,
            data: '{"AllNewOrUpdatable":"' + AllNewOrUpdatable() + '"}',
            dataType: "json"
        }
    )

    .done(
        function (response) {
            try {

                if (response.d.ResultBasic.Success) {

                    IssueIdSave(response.d.IssueID);

                    if(response.d.Reselected){alert("Issues were reselected: " + response.d.ReselectNewUpdatableOrAll)}

                    $("#hIssueTitle").text(response.d.Issue);
                    $("#divIssueContext").text(response.d.ContextHTML);
                    $("#divIssueContext2").text(response.d.ContextHTML2);

                    //prop/attr http://api.jquery.com/prop/
                    //.checkboxradio("refresh") http://jquerymobile.com/demos/1.0a4.1/docs/forms/forms-checkboxes.html
                    $("#chkInteresting").prop("checked", response.d.Interesting).checkboxradio("refresh"); 
                    $("#chkImportant").prop("checked", response.d.Important).checkboxradio("refresh");
                    $("#chkActionRequired").prop("checked", response.d.ActionRequired).checkboxradio("refresh");

                } else {
                    alert("Issue Contender fetch not successful: " + response.d.ResultBasic.Message);
                };
            } catch (e) {
                alert("Issue Contender fetch error: " + e.Message)
            };
        }
    )

    .fail(
        function (xmlHttpRequest, statusText, errorThrown) {
            alert("Issue Contender fetch failed XML Http Request: " + JSON.stringify(xmlHttpRequest)
                + ",\nStatus Text: " + statusText
                + ",\nError Thrown: " + errorThrown)
        }
    )

    .always(function(){            
        //When the app first loads, we call ping, IssueContendersSelect and IssueContender
        //All must complete before hiding the splash screen
        navigator.splashscreen.hide(); 
        HideElement('imgALG');}
    )

}

function Vote() {

    ShowElement('imgALG');

    var interesting = $("#chkInteresting").is(':checked'),
        important = $("#chkImportant").is(':checked'),
        actionRequired = $("#chkActionRequired").is(':checked');

    $.ajax(
        { url: "http://www.izavit.com/WS/iZ.asmx/IssueVote",
            contentType: "application/json; charset=utf-8",
            type: "POST",
            beforeSend: setHeaderAuthenticationValues,
            data: '{"IssueID":"' + IssueId() + '", "Interesting":"' + interesting + '", "Important":"' + important + '", "ActionRequired":"' + actionRequired + '", "AllNewOrUpdatable":"' + AllNewOrUpdatable() + '"}',
            dataType: "json"
        }
    )

    .done(
        function (response) {
            try {
                if (response.d.ResultBasic.Success) {
                    IssueContender();
                } else {
                    alert("Vote not successful: " + response.d.ResultBasic.Message);
                };
            } catch (e) {
                alert("Vote error: " + e.Message)
            };
        }    
    )

    .fail(
            function (xmlHttpRequest, statusText, errorThrown) {
                alert("Vote failed XML Http Request: " + JSON.stringify(xmlHttpRequest)
                    + ",\nStatus Text: " + statusText
                    + ",\nError Thrown: " + errorThrown)    
            }
    )

    .always(function(){HideElement('imgALG');})

}

function NextIssue() {
    IssueContender();
}