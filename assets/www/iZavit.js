﻿function checkConnection() {
    var networkState = navigator.network.connection.type;

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
                                alert('success');

                                saveSettings($("#tbEmailAddress").val(), response.d.SessionKey);

                                IssueContendersSelect();
                            } else {
                                alert('failed');
                            };
                        } catch (e) {
                            alert("SessionStatusCheck" + e.Message)
                        };
                    }
                )

                .fail(
                    function (xmlHttpRequest, statusText, errorThrown) {
                        alert("XML Http Request: " + JSON.stringify(xmlHttpRequest)
                          + ",\nStatus Text: " + statusText
                          + ",\nError Thrown: " + errorThrown)
                    }
                )


    } catch (err) {
        alert("PSCE" + err.Message);
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
                    alert("XML Http Request: " + JSON.stringify(xmlHttpRequest)
                      + ",\nStatus Text: " + statusText
                      + ",\nError Thrown: " + errorThrown)
                }
            )
}

function IssueContendersSelect() {

    alert("Issue Contenders Select");

    $.ajax(
                { url: "http://www.izavit.com/WS/iZ.asmx/IssueContendersSelect",
                    contentType: "application/json; charset=utf-8",
                    type: "POST",
                    data: '{"UniqueUserID":"' + device.uuid + '","SelectionType":"' + "1" + '"}',
                    dataType: "json"
                }
            )

            .done(
                function (response) {
                    try {
                        if (!response.d.Success) {
                            alert("ICSS" + response.d.Message);
                        } else {
                            alert("ICS1" + response.d.Message);
                        };
                    } catch (e) {
                        alert("ICSE" + e.Message)
                    };
                }
            )

            .fail(
                function (xmlHttpRequest, statusText, errorThrown) {
                    alert("XML Http Request: " + JSON.stringify(xmlHttpRequest)
                      + ",\nStatus Text: " + statusText
                      + ",\nError Thrown: " + errorThrown)
                }
            )

}