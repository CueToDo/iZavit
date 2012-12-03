//https://gist.github.com/1904992
//http://blog.safaribooksonline.com/2012/02/29/phonegap-storing-and-retrieving-with-the-filesystem/

        
    var FILENAME = 'settings.txt',

        stringSettings = "",
        jsonSettings = { emailAddress: "", sessionKey: "" }

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


function gotFS(fs) {
    var fail = failCallBack('getFile');
    fs.root.getFile(FILENAME, { create: true, exclusive: false }, gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {

    var fail = failCallBack('createWriter');
    file.entry = fileEntry;
    
    fileEntry.createWriter(gotFileWriter, fail);
    readSettings();
}

function gotFileWriter(fileWriter) {

    file.writer.available = true;
    file.writer.object = fileWriter;
}


function readSettings() {
    
    if (file.entry) {



        file.entry.file(function (dbFile) {

            var reader = new FileReader();
            reader.onloadend = function (evt) {



                stringSettings = evt.target.result.toString();

                if (stringSettings == null || stringSettings == '') {
                    promptRegistration();
                }
                else {
                    alert(stringSettings);
                    jsonSettings = jQuery.parseJSON(stringSettings);

                    alert(jsonSettings.emailAddress);

                    //If we don't have an email or session key, get user to sign in / register
                    if (jsonSettings.emailAddress == null || jsonSettings.emailAddress == '' || jsonSettings.sessionKey == null || jsonSettings.sessionKey == '') {
                        promptRegistration();
                    }
                    else {
                        //tbEmailAddress in html file
                        $("#tbEmailAddress").val(jsonSettings.emailAddress);
                    }
                }

            }
            reader.readAsText(dbFile);

        }, failCallBack("FileReader"));
    }

    return false;
}

function promptRegistration() {
    $("#hSignInOrRegister").html("register");
    $("#ButtonSignIn").html("register");
    $("#aSignIn").click();
}

function saveSettings(emailAddress, sessionKey) {

    if (file.writer.available) {
        file.writer.available = false;
        file.writer.object.onwriteend = function (evt) {
            file.writer.available = true;
            file.writer.object.seek(0);
        }

        if (!jsonSettings) { jsonSettings = { emailAddress: "", sessionKey: ""} };
        jsonSettings.emailAddress = emailAddress;
        jsonSettings.sessionKey = sessionKey;
        stringSettings = JSON.stringify(jsonSettings).toString();

        file.writer.object.write(stringSettings);

        alert('saved');
    }
}