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

    navigator.notification.alert('Connection type', null, states[networkState]);
}


//Check that we have a response from the iZavit webserver
function ping() {

    //alert('ping');   

    $.ajax(
        { url: 'http://www.iZavit.com' }
    )

    .done(
        function () {
        
            //alert('ping done');   
            IssueCandidateStats();
            
        }
    )
    .fail(
        
        function (xmlHttpRequest, statusText, errorThrown) {
            //alert('ping fail');   
            navigator.notification.alert('The iZavit webservers cannot be reached at this time. Please try again later', null, 'Web service error')
        }
    )

    .always(
        function(){
            //alert('ping always');  
        }
    )


}


//function Go(){

    //$("#rbtnGo").prop("checked", false);    
    //$("input[type='radio']").checkboxradio("refresh"); //http://jquerymobile.com/demos/1.0a4.1/docs/forms/forms-checkboxes.html

    //goBack();            
//}


function IssueCandidateStats(){

    $.ajax(
        {   url: 'http://www.iZavit.com/WS/iZ.asmx/IssueCandidateStatistics' ,
            contentType: "application/json; charset=utf-8",
            type: "POST",
            beforeSend: setHeaderAuthenticationValues,
            dataType: "json"        
        }
    )



    .done(
        function (response) {
        
            try {

                if (!response.d.ResultBasic.Authenticated) {
                    MustSignIn();
                } else if (!response.d.ResultBasic.Success) {
                    navigator.notification.alert(response.d.ResultBasic.Message, null, "IssueCandidateStats: Fail");
                } else {
                    
                    var candidates = "Issue Candidates (" + response.d.NewIssues + " of " + response.d.Candidates + ")"
                    $("#buttonCandidateIssues").text(candidates).button("refresh");
                    
                    var currentIssues = "Current Issues (" + response.d.CurrentIssues + ")";
                    $("#buttonCurrentIssues").text(currentIssues).button("refresh");
                };
            } catch (e) {
                navigator.notification.alert(e.Message, null, 'IssueCandidateStats: Error')
            };

            navigator.splashscreen.hide();

            //Must wait until initialisation is complete (splash screen is hidden)

            if (CandidateIssueSelectionMode()=='N'){$("#rbtnSelectNewIssues").prop("checked", true); }
            else if (CandidateIssueSelectionMode()=='U') {$("#rbtnSelectUpdatableIssues").prop("checked", true);}
            else {$("#rbtnSelectAllIssues").prop("checked", true);}

            //.checkboxradio("refresh") http://jquerymobile.com/demos/1.0a4.1/docs/forms/forms-checkboxes.html
            $("input[type='radio']").checkboxradio("refresh");
            
        }
    )
    .fail(
        
        function (xmlHttpRequest, statusText, errorThrown) {
            //alert('ping fail');   
            navigator.notification.alert('Could not determine Issue Candidate Stats', null, 'Web service error')
        }
    )

    .always(
        function(){
            //alert('ping always');  
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
    ShowElement('spinnerSignIn', true);

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

                                IssueCandidatesSelect();
                                $.mobile.changePage($("#divIssueCandidates"));
 
                            } else {
                                navigator.notification.alert(response.d.Message, null, "Sign in: Fail");
                            };
                        } catch (e) {
                            navigator.notification.alert(e.Message, null, 'Sign In: Error')
                        };
                    }
                )

                .fail(
                    function (xmlHttpRequest, statusText, errorThrown) {
                        navigator.notification.alert( 
                            "XML Http Request: " + JSON.stringify(xmlHttpRequest)
                            + ",\nStatus Text: " + statusText
                            + ",\nError Thrown: " + errorThrown,
                            null,
                            'Sign In: Fail')
                    }
                )

                .always(
                    function(){
                        ShowElement('spinnerSignIn', false);
                    }
                )


    } catch (err) {
        navigator.notification.alert(err.Message, null, "Sign In: Error");
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
                            navigator.notification.alert(response.d.Message, null, "Registration success");
                        } else {
                            navigator.notification.alert(response.d.Message, null, "Registration failed");
                        };
                    } catch (e) {
                        navigator.notification.alert(e.Message, null, "Registration error")
                    };
                }
            )

            .fail(
                function (xmlHttpRequest, statusText, errorThrown) {
                    navigator.notification.alert(
                        "XML Http Request: " + JSON.stringify(xmlHttpRequest)
                        + ",\nStatus Text: " + statusText
                        + ",\nError Thrown: " + errorThrown,
                        null, 
                        'Registration failure')
                }
            )
}

function quitiZavit() {
    navigator.app.exitApp(); 
}

function MustSignIn() {
    navigator.notification.alert('Your session key is not valid', null, 'Please sign in')
    document.addEventListener("backbutton", quitiZavit, false);
    $.mobile.changePage($('#divSignIn'));
}


function IssueCandidatesSelect() {

    ShowElement('spinner', true);

    //alert('IssueCandidatesSelect');
    $.ajax(
        { url: "http://www.izavit.com/WS/iZ.asmx/IssueCandidatesSelect",
            contentType: "application/json; charset=utf-8",
            type: "POST",
            beforeSend: setHeaderAuthenticationValues,
            data: '{"CandidateIssueSelectionMode":"' + CandidateIssueSelectionMode() + '"}',
            dataType: "json"
        }
    )

    .done(
        function (response) {
            try {
                //alert('Auth: ' + response.d.Authenticated);
                //alert(response.d.Message);
                if (!response.d.Authenticated) {
                    MustSignIn();
                } else if (!response.d.Success) {
                    navigator.notification.alert(response.d.Message, null, "Issue Candidates Select: Failed");
                } else {
                    //must wait a little longer before hiding splash screen
                    IssueCandidate();
                };
            } catch (e) {
                navigator.notification.alert(e.Message, null, "Issue Candidates Select: Error")
            };
        }
    )

    .fail(
        function (xmlHttpRequest, statusText, errorThrown) {
            navigator.notification.alert(
                "XML Http Request: " + JSON.stringify(xmlHttpRequest)
                + ",\nStatus Text: " + statusText
                + ",\nError Thrown: " + errorThrown,
                null,
                "Issue Candidates Select: Fail")
        }
    )

    .always(function(){
            ShowElement('spinner', false);
        }
    )
}

function IssueCandidate() {

    ShowElement('spinner', true);

    $.ajax(
        { url: "http://www.izavit.com/WS/iZ.asmx/IssueCandidate",
            contentType: "application/json; charset=utf-8",
            type: "POST",
            beforeSend: setHeaderAuthenticationValues,
            data: '{"CandidateIssueSelectionMode":"' + CandidateIssueSelectionMode() + '"}',
            dataType: "json"
        }
    )

    .done(
        function (response) {
            try {

                //alert(response.d.ResultBasic.Success);

                if (response.d.ResultBasic.Success) {

                    IssuesSelectedSave(response.d.Total);

                    if(response.d.Total == 0){
                        navigator.notification.alert("There are no issue candidates to vote on at this time.", 
                            function(){goBack()}, //To menu}
                            "Issue Candidate Fetch");
                    }
                    else {
                        IssueIdSave(response.d.IssueID);

                        $("#hIssueTitle").text(response.d.Issue);
                        $("#divIssueContext").text(response.d.ContextHTML);
                        $("#divIssueContext2").text(response.d.ContextHTML2);

                        //prop/attr http://api.jquery.com/prop/
                        //.checkboxradio("refresh") http://jquerymobile.com/demos/1.0a4.1/docs/forms/forms-checkboxes.html
                        $("#chkInteresting").prop("checked", response.d.Interesting).checkboxradio("refresh"); 
                        $("#chkImportant").prop("checked", response.d.Important).checkboxradio("refresh");
                        $("#chkActionRequired").prop("checked", response.d.ActionRequired).checkboxradio("refresh");
                    
                        $("#spnIssueNumber").text(response.d.Selection);
                        $("#spnIssueTotalSelected").text(response.d.Total);spnIssueTotalSelected
                        $("#spnLatestStartDate").text(response.d.LatestStartDate);

                        $("#spnReselectionMessageNew").hide();
                        $("#spnReselectionMessageUpdatable").hide();
                        $("#spnReselectionMessageAll").hide();

                        if(response.d.Reselected){
                            switch(response.d.ReselectNewUpdatableOrAll){
                                case "N": $("#spnReselectionMessageNew").show(); break;
                                case "U": $("#spnReselectionMessageUpdatable").show(); break;
                                case "A": $("#spnReselectionMessageAll").show(); break;
                            }
                        }
                    }
                } else {
                    navigator.notification.alert(response.d.ResultBasic.Message, null, "Issue Candidate Fetch: Failed");
                };
            } catch (e) {
                navigator.notification.alert(e.Message, null, "Issue Candidate Fetch: Error")
            };
        }
    )

    .fail(
        function (xmlHttpRequest, statusText, errorThrown) {
            navigator.notification.alert(
                "XML Http Request: " + JSON.stringify(xmlHttpRequest)
                + ",\nStatus Text: " + statusText
                + ",\nError Thrown: " + errorThrown,
                null,
                "Issue Candidate Fetch: Failed")
        }
    )

    .always(function(){            
        //When the app first loads, we call ping, IssueCandidatesSelect and IssueCandidate
        //All must complete before hiding the splash screen
        ShowElement('spinner', false);
        }
    )

}

function Vote() {

    ShowElement('spinner', true);

    var interesting = $("#chkInteresting").is(':checked'),
        important = $("#chkImportant").is(':checked'),
        actionRequired = $("#chkActionRequired").is(':checked');

    $.ajax(
        { url: "http://www.izavit.com/WS/iZ.asmx/IssueVote",
            contentType: "application/json; charset=utf-8",
            type: "POST",
            beforeSend: setHeaderAuthenticationValues,
            data: '{"IssueID":"' + IssueId() + '", "Interesting":"' + interesting + '", "Important":"' + important + '", "ActionRequired":"' + actionRequired + '", "CandidateIssueSelectionMode":"' + CandidateIssueSelectionMode() + '"}',
            dataType: "json"
        }
    )

    .done(
        function (response) {
            try {
                if (response.d.ResultBasic.Success) {
                    IssueCandidate();
                } else {
                    navigator.notification.alert(response.d.ResultBasic.Message, null, "Vote: Failed");
                };
            } catch (e) {
                navigator.notification.alert(e.Message, null, "Vote: Error")
            };
        }    
    )

    .fail(
            function (xmlHttpRequest, statusText, errorThrown) {
                navigator.notification.alert(
                    "XML Http Request: " + JSON.stringify(xmlHttpRequest)
                    + ",\nStatus Text: " + statusText
                    + ",\nError Thrown: " + errorThrown,
                    null,
                    "Vote: Failed")    
            }
    )

    .always(function(){
            ShowElement('spinner', false);
        }
    )

}



function NextIssue() {
    IssueCandidate();
    //$.mobile.changePage($('#divMenu', {transition:'slideup'}));
}

function onMenuKeyDown() {
    $.mobile.changePage($('#divSettings'));
}