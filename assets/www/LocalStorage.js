var lsJsonSettings = { emailHash:"", sessionKey:"", voterID :"", sessionID:"" };

document.addEventListener('deviceready', function () {

    //won't fire when you 
    //super.setBooleanProperty("loadInWebView", true);

    //Read saved settings from LocalStorage
    lsJsonSettings.emailHash = window.localStorage.getItem("emailHash");

    if (!lsJsonSettings.emailHash) { promptRegistration(); }
    else {
        lsJsonSettings.sessionKey = window.localStorage.getItem("sessionKey");
        lsJsonSettings.voterID = window.localStorage.getItem("voterID");
        lsJsonSettings.sessionID = window.localStorage.getItem("sessionID");
    };

}, false);

function lsSaveSettings(emailHash, sessionKey, voterID, sessionID) {

    lsJsonSettings.emailHash = emailHash;
    lsJsonSettings.sessionKey = sessionKey;
    lsJsonSettings.voterID = voterID;
    lsJsonSettings.sessionID = sessionID;

    window.localStorage.setItem("emailHash", emailHash);
    window.localStorage.setItem("sessionKey", sessionKey);
    window.localStorage.setItem("voterID", voterID);
    window.localStorage.setItem("sessionID", sessionID);

}