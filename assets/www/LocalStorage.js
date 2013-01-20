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

function IssueIdSave(issueID){window.localStorage.setItem("issueId", issueID)}
function IssueId(){return window.localStorage.getItem("issueId")}

function IssuesSelectedSave(issues){window.localStorage.setItem("issuesSelected", issues)}
function IssuesSelected(){return window.localStorage.getItem("issues")}

function SetModeToCandidateIssues(){window.localStorage.setItem("mode", "Candidates")} //"Candidates" or "Current" 
function SetModeToCurrentIssues(){window.localStorage.setItem("mode", "Current")} //"Candidates" or "Current" 
function Mode(){return window.localStorage.getItem("mode")}

function CandidateIssueSelectionModeSave(mode){window.localStorage.setItem("candidateIssueSelectionMode", mode)}

function CandidateIssueSelectionMode(){
    var mode = window.localStorage.getItem("candidateIssueSelectionMode");
    if (!mode){mode='A'; CandidateIssueSelectionModeSave(mode)}
    else if (mode!='N' && mode != 'U') {mode='A'; CandidateIssueSelectionModeSave(mode)}
    return mode
}