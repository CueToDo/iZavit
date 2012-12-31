var lsJsonSettings = { emailHash:"", sessionKey:"" };

document.addEventListener('deviceready', function () {

    //won't fire when you 
    //super.setBooleanProperty("loadInWebView", true);

    //Read saved settings from LocalStorage
    lsJsonSettings.emailHash = window.localStorage.getItem("emailHash");
    lsJsonSettings.sessionKey = window.localStorage.getItem("sessionKey");

    if (!lsJsonSettings.emailHash) { promptRegistration()};

}, false);

function lsSaveSettings(emailHash, sessionKey) {

    lsJsonSettings.emailHash = emailHash;
    lsJsonSettings.sessionKey = sessionKey;

    window.localStorage.setItem("emailHash", emailHash);
    window.localStorage.setItem("sessionKey", sessionKey);

}