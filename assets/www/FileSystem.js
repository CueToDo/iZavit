//https://gist.github.com/1904992
//http://blog.safaribooksonline.com/2012/02/29/phonegap-storing-and-retrieving-with-the-filesystem/

    var FILENAME = 'settings.txt',

        fsStringSettings = "",
        fsJsonSettings = { emailHash:"", sessionKey:"", voterID :"", sessionID:"" },

        failCallBack = function (msg) {
            return function () {
                alert('[FAIL] ' + msg);
            }
        },

        file = {
            writer: { available: false },
            reader: { available: false }
        };


document.addEventListener('deviceready', function () {

    //won't fire when you 
    //super.setBooleanProperty("loadInWebView", true);

    //Read saved settings from FileSystem
    var fail = failCallBack('requestFileSystem');
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

}, false);


function DirShite(fs) {

    alert('1');

    //Callback functions
    var fail = failCallBack('gotFS/getDirectory');
    alert('2');
    var success = null;// gotDirectory();

    alert('3');

    //Get/Create Directory
    var entry = fs.root;
    alert(DIRECTORY);
    entry.getDirectory(DIRECTORY, { create: true, exclusive: false }, success, fail);
    alert('5');
}

function gotFS(fs) {
    var fail = failCallBack('gotDirectory/getFile');
    fs.root.getFile(FILENAME, { create: true, exclusive: false }, gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {

    var fail = failCallBack('gotFileEntry/createWriter');
    file.entry = fileEntry;
    
    fileEntry.createWriter(gotFileWriter, fail);
    readSettings();
}

function gotFileWriter(fileWriter) {

    file.writer.available = true;
    file.writer.object = fileWriter;
}


function fsReadSettings() {
    
    if (file.entry) {

        file.entry.file(function (dbFile) {

            var reader = new FileReader();
            reader.onloadend = function (evt) {



                fsStringSettings = evt.target.result.toString();

                if (fsStringSettings == null || fsStringSettings == '') {
                    promptRegistration();
                }
                else {
                    
                    //alert(fsStringSettings);

                    fsJsonSettings = jQuery.parseJSON(fsStringSettings);

                    //alert(fsJsonSettings.emailAddress);

                    //If we don't have an email or session key, get user to sign in / register
                    if (fsJsonSettings.emailHash == null || fsJsonSettings.emailHash == '' || fsJsonSettings.sessionKey == null || fsJsonSettings.sessionKey == '') {
                        promptRegistration();
                    }
                    else {
                        //tbEmailAddress in html file
                        $("#tbEmailAddress").val(fsJsonSettings.emailAddress);
                    }
                }

            }
            reader.readAsText(dbFile);

        }, failCallBack("FileReader"));
    }

    return false;
}

function fsSaveSettings(emailHash, sessionKey, voterID, sessionID) {

    if (file.writer.available) {
        file.writer.available = false;
        file.writer.object.onwriteend = function (evt) {
            file.writer.available = true;
            file.writer.object.seek(0);
        }

        if (!fsJsonSettings) { fsJsonSettings = { emailHash: "", sessionKey: "", voterID:"", sessionID:""} };
        fsJsonSettings.emailHash = emailHash;
        fsJsonSettings.sessionKey = sessionKey;
        fsJsonSettings.voterID = voterID;
        fsJsonSettings.sessionID = sessionID;

        fsStringSettings = JSON.stringify(fsJsonSettings).toString();
        file.writer.object.write(fsStringSettings);

        alert('saved');
    }
}