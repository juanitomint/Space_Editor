// -----------------------------------------
// Right-click context menu plugin for jQuery...
// -----------------------------------------
var allCollabInfo = [];
// ----------------------------------------------------------
var mostRecentFilesAndInfo = [];
var mostRecentTotalUserCount = 1;

function getUsersInFile(fname) {
    for (var i = 0; i < mostRecentFilesAndInfo.length; i++) {
        var f = mostRecentFilesAndInfo[i];
        if (f[0] == fname) {
            return f[1];
        }
    }
    return 0;
}
function addFileToList(fname) {
    for (var i = 0; i < mostRecentFilesAndInfo.length; i++) {
        var f = mostRecentFilesAndInfo[i];
        if (f[0] == fname) {
            console.log("Already have this file.");
            return;
        }
    }
    mostRecentFilesAndInfo.push([fname, 0]);
    //updateFileBrowserFromFileList(mostRecentFilesAndInfo);
}
function removeFileFromList(fname) {
    for (var i = 0; i < mostRecentFilesAndInfo.length; i++) {
        var f = mostRecentFilesAndInfo[i];
        if (f[0] == fname) {
            mostRecentFilesAndInfo.splice(i, 1);
            updateFileBrowserFromFileList(mostRecentFilesAndInfo);
            return;
        }
    }
}
function getProjectFileInfo(fname) {
    for (var i = 0; i < mostRecentFilesAndInfo.length; i++) {
        var f = mostRecentFilesAndInfo[i];
        if (f[0] == fname) {
            return f;
        }
    }
    return null;
}

var userColorMap = ["#9DDC23", "#00FFFF", "#FF308F", "#FFD400", "#FF0038", "#7C279B", "#FF4E00", "#6C8B1B", "#0A869B"];
function getColor(str){
    return userColorMap[(str.charCodeAt(0) + str.charCodeAt(str.length - 1)+str.length) % userColorMap.length];
}
// ---------------------------------------------------------
// MSG Related Functions
// ---------------------------------------------------------
function BroadcastKeydown(event) {
    if (event.keyCode == 13) {
// ENTER was pressed
        var txt = this.value;
        if (txt != "") {
            var usedAsCommand = false;
            if (txt.length == 1) {
                switch (txt.toLowerCase()) {
                    case "f":
                    {
                        followMe();
                        usedAsCommand = true;
                        break;
                    }
                    case "l":
                    {
                        toggleLog();
                        usedAsCommand = true;
                        break;
                    }
                    case "o":
                    {
                        toggleLogOutput();
                        usedAsCommand = true;
                        break;
                    }
                }
            }
            if (!usedAsCommand) {
                now.s_teamMessageBroadcast("personal", txt);
            }
        }
        this.value = '';
        return false;
    }
    if (event.keyCode == 27) {
// ESC was pressed
        toggleShiftShift();
        return false;
    }
    return true;
}
function followMe(fname) {

    now.s_followMe(fname);
}
function addCollaborator(userId, fromUserName, color) {
    if (userId && fromUserName && !Ext.get(userId) && userId !== now.core.clientId) {
        if (Ext.getCmp('TeamTree').store.getById(userId) == null) {
            Ext.getCmp('TeamTree').getRootNode().appendChild({
                id: userId,
                name: fromUserName,
                color: color
            });
        }
    }
}
function removeCollaboratorFromFile(userId, fname) {
    fname_stripped =userId+'_'+fname.replace(/[-[\]{}()*+?.,\/\\^$|#\s]/g, "_");

    user = Ext.getCmp('TeamTree').store.getById(userId);
    if (user) {
        if (Ext.getCmp('TeamTree').store.getById(fname_stripped)) {
            Ext.getCmp('TeamTree').store.getById(fname_stripped).remove();
        }
    }
}
function addCollaboratorToFile(userId, fname) {
    fname_stripped =userId+'_'+ fname.replace(/[-[\]{}()*+?.,\/\\^$|#\s]/g, "_");

    user = Ext.getCmp('TeamTree').store.getById(userId);
    if (user) {
        if (Ext.getCmp('TeamTree').store.getById(fname_stripped) == null) {
            user.appendChild({
                id: fname_stripped,
                name: fname,
                leaf: true
            });
        }
    }
}
function removeCollaborator(userId) {
    if (Ext.getCmp('TeamTree').store.getById(userId)) {
        Ext.getCmp('TeamTree').store.getById(userId).remove();
    }

}
function groupChatMsg(fromUserName, msg, me, color) {
    add = (me) ? 'self' : 'other';
    color = (me) ? '#444' : color;
    avatar = '<div class="avatar"><img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/3/profile/profile-80_20.jpg"/></div>';
    avatar = '<div class="avatar"  style="background-color:' + color + '"></div>';
    timeStamp = '<time datetime="' + Date() + '">' + fromUserName + ':</time>';
    Ext.get('chat-ol').createChild('<li class="' + add + '">' + avatar + ' <div class="messages">' + timeStamp + Ext.htmlDecode(msg) + '</div></li>');
}
function notifyAndAddMessageToLog(userColor, fromUserName, msg) {
    console.log("shout: msg(" + userColor + ", " + fromUserName + ", " + msg + ");");
    $("#logWindowContent").append('<span class="" style="color:' + userColor + '">' + fromUserName + ': ' + msg + '</span>');
}
// ---------------------------------------------------------
// URL manipulation.
// ---------------------------------------------------------
function getURLGetVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0].toLowerCase() == variable.toLowerCase()) {
            return pair[1];
        }
    }
    return null;
}
function setURLHashVariable(variable, value) {
    var newQuery = "";
    var replacedExistingVar = false;
    var query = window.location.hash.substring(1);
    console.log(query);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        if (vars[i] == "") {
            continue;
        }
        var pair = vars[i].split("=");
        if (pair[0].toLowerCase() == variable.toLowerCase()) {
            pair[1] = value;
            console.log("replaced value: " + pair[0]);
            replacedExistingVar = true;
        }
        newQuery += pair[0] + "=" + pair[1];
        if (i < vars.length - 1) {
            newQuery += "&";
        }
    }
    if (!replacedExistingVar) {
        if (newQuery.length > 0) {
            newQuery += "&";
        }
        newQuery += variable + "=" + value;
    }
    window.location.hash = newQuery;
}
function getURLHashVariable(variable) {
    var query = window.location.hash.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        if (vars[i] == "") {
            continue;
        }
        var pair = vars[i].split("=");
        if (pair[0].toLowerCase() == variable.toLowerCase()) {
            return pair[1];
        }
    }
    return null;
}
// ---------------------------------------------------------

//////////////////////////////////////////////////////////////////////////////// 
//////////////////////////////////////////////////////////////////////////////// 
// 
//              IMPORTED FROM EDIT FILE                 
// 
//////////////////////////////////////////////////////////////////////////////// 
//////////////////////////////////////////////////////////////////////////////// 
// ---------------------------------------------------------
// Main functions...
// ---------------------------------------------------------
var Range = require("ace/range").Range;
var infile = "";
var cursorChangeTimeout = null;
var textChangeTimeout = null;
var initialFileloadTimeout = null;
var nowIsOnline = false;
var ignoreAceChange = false;
var openIsPending = false;
var timeOfLastLocalChange = (new Date()).getTime();
var timeOfLastLocalKepress = (new Date()).getTime();
var timeOfLastPatch = (new Date()).getTime();
var fileIsUnsaved = false;
var saveIsPending = false;
// -----------------------------------------
// Editor
// -----------------------------------------
var pageLoadID = Math.floor(Math.random() * 100000);
var editor = null;
var nowClientID = 0;
var allCollabInfo = [];
var initialStateIsWelcome = true;
var alreadyRequestedRemoteFile = false;
var TIME_UNTIL_GONE = 7000;
var NOTIFICATION_TIMEOUT = 10000;
var autoCheckStep = 0;
var collaborators = [];
var PROJECT = '';
function sendTextChange(fname) {
    fname_stripped = fname.replace(/[-[\]{}()*+?.,\/\\^$|#\s]/g, "_");
    textChangeTimeout = null;
    //console.log("send text change.");
    editor = Ext.getCmp(fname_stripped + '-tab').getEditor();
    var currentText = editor.getSession().getValue();
    if (currentText === previousText) {
        //console.log("text is the same. sidestepping update.");
        return false;
    }
    setFileStatusIndicator(fname, "changed");
    var md5 = Crypto.MD5(currentText);
    var patch_list = dmp.patch_make(previousText, currentText);
    var patch_text = dmp.patch_toText(patch_list);
    var patches = dmp.patch_fromText(patch_text);
    previousText = currentText;
    timeOfLastLocalChange = (new Date()).getTime();
    now.s_sendDiffPatchesToCollaborators(infile, patches, md5);
    return true;
}
function ifOnlineLetCollaboratorsKnowImHere() {
    if (!nowIsOnline) {
        return;
    }

    thisTab = Ext.getCmp('filetabs').getActiveTab();
    if (thisTab) {
        if (thisTab.getEditor != null) {
            editor = thisTab.getEditor();
            infile = thisTab.path;
            var range = editor.getSelectionRange();
            now.s_sendCursorUpdate(infile, range, true);
        }
    }

}
function ifOnlineVerifyCollaboratorsAreStillHere_CleanNotifications_AutoSave() {
    if (!nowIsOnline) {
        return;
    }
    autoCheckStep++;
    var t = (new Date()).getTime();
    var activeCollabs = 0;
    for (var prop in allCollabInfo) {
        if (allCollabInfo.hasOwnProperty(prop)) {
            var cInfo = allCollabInfo[prop];
            if (cInfo[fname]) {
                if (cInfo[fname]['isShown']) {
                    var tDiff = t - cInfo[fname]['timeLastSeen'];
                    if (tDiff > TIME_UNTIL_GONE) {
                        console.log("Looks like " + cInfo['name'] + " is no longer around in: " + fname);
                        var lastCursorID = cInfo[fname]['lastCursorMarkerID'];
                        var ses = editor.getSession();
                        if (lastCursorID !== undefined) {
                            ses.removeMarker(lastCursorID); // remove collaborator's cursor.
                        }
                        var lastSelID = cInfo[fname]['lastSelectionMarkerID'];
                        if (lastSelID !== undefined) {
                            ses.removeMarker(lastSelID); // remove collaborator's selection.
                        }
                        cInfo[fname]['isShown'] = false;
                    } else {
                        activeCollabs++;
                    }
                }
            }
        }
    }

    /*
     if (activeCollabs > 0) {
     
     } else {
     
     }
     
     // auto-save if neccessary...
     var saveRequestedForRemoteUser = ((t - timeOfLastPatch) > 10000 && Math.random() > 0.7);
     var saveRequestedForMe = (timeOfLastPatch < timeOfLastLocalChange && (t - timeOfLastLocalChange) > 2000);
     var typingInProgress = (timeOfLastLocalKepress > timeOfLastLocalChange);
     //console.log("typing in progress: " + typingInProgress);
     //console.log("saveRequestedForMe: " + saveRequestedForMe + ", " + timeOfLastPatch + " <? " +timeOfLastLocalChange);
     if (fileIsUnsaved && !saveIsPending && !typingInProgress && (saveRequestedForRemoteUser || saveRequestedForMe)) {
     // save it!
     console.log("AUTO SAVE! ");
     saveFileToServer();
     }
     */
}
function removeAllCollaborators(fname) {
    console.log("Removing all previous collaborators...");
    for (var prop in allCollabInfo) {
        if (allCollabInfo.hasOwnProperty(prop)) {
            var cInfo = allCollabInfo[prop];
            //console.log("trying to remove: " + cInfo[fname]['name']+" from "+fname);
            if (cInfo[fname])
                cInfo[fname]['timeLastSeen'] -= TIME_UNTIL_GONE;
        }
    }
    ifOnlineVerifyCollaboratorsAreStillHere_CleanNotifications_AutoSave(fname);
}
// -----------------------------------------
// Diff-Match-Patch.
// -----------------------------------------
var patchQueue = [];
var patchingInProcess = false;
var dmp = new diff_match_patch();
dmp.Diff_Timeout = 1;
dmp.Diff_EditCost = 4;
var updateWithDiffPatchesLocal = function (id, patches, md5, fname) {
    tab = Ext.getCmp('filetabs').child('[path=' + fname + ']');
    editor = tab.getEditor();
    if (patchingInProcess) {
        console.log("patching in process.. queued action.");
        patchQueue.push({id: id, patches: patches, md5: md5});
        return;
    }
    patchingInProcess = true;
    var t = (new Date()).getTime();
    if (id != now.core.clientId) {
        console.log("patching from user: " + id + ", md5=" + md5);
        //console.log("PATCHES");
        //console.log(patches);

        var currentText = editor.getSession().getValue();
        var localChangeJustSent = sendTextChange(Ext.getCmp('filetabs').getActiveTab().path); // make sure we send any outstanding changes before we apply remote patches.

        var results = dmp.patch_apply(patches, currentText);
        var newText = results[0];
        // TODO: get text around cursor and then use it later for a fuzzy-match to keep it in the same spot.
        //console.log("DIFF TO DELTAS");
        var diff = dmp.diff_main(currentText, newText);
        var deltas = dmp.diff_toDelta(diff).split("\t");
        //console.log(deltas);

        var doc = editor.getSession().doc;
        //
        // COMPUTE THE DIFF FROM THE PATCH AND ACTUALLY INSERT/DELETE TEXT VIA THE EDITOR (AUTO TRACKS CURSOR, AND DOESN'T RESET THE ENTIRE TEXT FIELD).
        //
        var offset = 0;
        var row = 1;
        var col = 1;
        var aceDeltas = [];
        for (var i = 0; i < deltas.length; i++) {
            var type = deltas[i].charAt(0);
            var data = decodeURI(deltas[i].substring(1));
            //console.log(type + " >> " + data);
            switch (type) {
                case "=":
                { // equals for number of characters.
                    var sameLen = parseInt(data);
                    for (var j = 0; j < sameLen; j++) {
                        if (currentText.charAt(offset + j) == "\n") {
                            row++;
                            col = 1;
                        } else {
                            col++;
                        }
                    }
                    offset += sameLen;
                    break;
                }
                case "+":
                { // add string.
                    var newLen = data.length;
                    //console.log("at row="+row+" col="+col+" >> " + data);
                    var aceDelta = {
                        action: "insertText",
                        range: {start: {row: (row - 1), column: (col - 1)}, end: {row: (row - 1), column: (col - 1)}}, //Range.fromPoints(position, end),
                        text: data
                    };
                    aceDeltas.push(aceDelta);
                    var innerRows = data.split("\n");
                    var innerRowsCount = innerRows.length - 1;
                    row += innerRowsCount;
                    if (innerRowsCount <= 0) {
                        col += data.length;
                    } else {
                        col = innerRows[innerRowsCount].length + 1;
                    }
                    //console.log("ended at row="+row+" col="+col);
                    break;
                }
                case "-":
                { // subtract number of characters.
                    var delLen = parseInt(data);
                    //console.log("at row="+row+" col="+col+" >> " + data);
                    var removedData = currentText.substring(offset, offset + delLen);
                    //console.log("REMOVING: " + removedData);
                    var removedRows = removedData.split("\n");
                    //console.log(removedRows);
                    var removedRowsCount = removedRows.length - 1;
                    //console.log("removed rows count: " + removedRowsCount);
                    var endRow = row + removedRowsCount;
                    var endCol = col;
                    if (removedRowsCount <= 0) {
                        endCol = col + delLen;
                    } else {
                        endCol = removedRows[removedRowsCount].length + 1;
                    }
                    //console.log("end delete selection at row="+endRow+" col="+endCol);
                    var aceDelta = {
                        action: "removeText",
                        range: {start: {row: (row - 1), column: (col - 1)}, end: {row: (endRow - 1), column: (endCol - 1)}}, //Range.fromPoints(position, end),
                        text: data
                    };
                    aceDeltas.push(aceDelta);
                    //console.log("ended at row="+row+" col="+col);      
                    offset += delLen;
                    break;
                }
            }
        }

        ignoreAceChange = true;
        doc.applyDeltas(aceDeltas);
        previousText = newText;
        ignoreAceChange = false;
        if (!localChangeJustSent && (t - timeOfLastLocalChange) > 2000) {
            //console.log("no local changes have been made in a couple seconds >> md5 should match..");
            var newMD5 = Crypto.MD5(newText);
            if (md5 == newMD5) {
                setFileStatusIndicator(fname, "changed");
            } else {
                setFileStatusIndicator(fname, "error");
                console.log("** OH NO: MD5 mismatch. this=" + newMD5 + ", wanted=" + md5);
                now.s_requestFullFileFromUserID(infile, id, function (fname, fdata, err, isSaved) {
                    if (fname != infile) {
                        console.log("Oh No! They sent me a file that I don't want: " + fname);
                        return;
                    }
                    console.log("### FULL FILE UPDATE (from remote user)...");
                    var patch_list = dmp.patch_make(previousText, fdata);
                    var patch_text = dmp.patch_toText(patch_list);
                    var patches = dmp.patch_fromText(patch_text);
                    var md5 = Crypto.MD5(fdata);
                    updateWithDiffPatchesLocal(id, patches, md5, fname);
                });
            }
        }
        timeOfLastPatch = t;
    } else {
        console.log("saw edit from self. not using it.");
    }
    patchingInProcess = false;
    if (patchQueue.length > 0) {
        console.log("Patching from Queue! DOUBLE CHECK THIS.");
        var nextPatch = patchQueue.shift(); // get the first patch off the queue.
        updateWithDiffPatchesLocal(nextPatch.id, nextPatch.patches, nextPatch.md5, fname);
    }
}
// -----------------------------------------
// Now.JS Client-side functions.
// -----------------------------------------


var alreadyConnected = false;

function openFileFromServer(fname, forceOpen, editor) {
//    if (infile == fname && (!forceOpen)) {
//        console.log("file is already open.");
//        return;
//    }
    if (!fname || fname == "") {
        console.log("Invalid filename.");
        return;
    }
//    if (openIsPending) {
//        console.log("open is pending... aborting open request for: " + fname);
//        return;
//    }
//    openIsPending = true;
    //---get tab editor
    if (editor) {
        //----attach analizecode to tokenizer
        /* analize disable
         editor.session.bgTokenizer.on('update', AnalizeCode);
         */
        editor.setReadOnly(true);
        ignoreAceChange = true;
        editor.getSession().setValue(""); // clear the editor.
        initialFileloadTimeout = setTimeout(function () {
            initialStateIsWelcome = false;
        }, 3000);
        editor.setFadeFoldWidgets(false);
        now.s_getLatestFileContentsAndJoinFileGroup(fname, function (fname, fdata, err, isSaved) {
            if (err) {
                console.log("ERROR: couldn't load file.");
                console.log(err);
                //alert("Oh No! We couldn't load that file: "+fname);
                editor.setReadOnly(true);
                ignoreAceChange = false;
                openIsPending = false;
                $("#topFileName").html("<span style='color: #F00;'>" + fname + " ???</span>");
                return;
            }
            infile = fname;
            ignoreAceChange = true;
            editor.getSession().setValue(fdata.replace(/\t/g, "  "));
            // TODO: Auto-fold here...
            // addFold("...", new Range(8, 44, 13, 4));
            ignoreAceChange = false;
            editor.setReadOnly(false);
            // auto fold things that are code (html is an expection...)
            previousText = editor.getSession().getValue();
            //autoFoldCodeProgressive();
            setFileStatusIndicator(fname, "ok");
            removeAllCollaborators(fname);
            ifOnlineLetCollaboratorsKnowImHere();
            openIsPending = false;
            //setTimeout(AnalizeCode(editor),500);
        });
        initialFileloadTimeout = null;
        setFileStatusIndicator(fname, "unknown");

    }
}
function saveFileToServer(fname, previousText) {
    if (previousText == null) {
        fname_stripped = fname.replace(/[-[\]{}()*+?.,\/\\^$|#\s]/g, "_");
        editor = Ext.getCmp(fname_stripped + '-tab').getEditor();
        previousText = editor.getSession().getValue();
    }
    saveIsPending = true;
    console.log("SAVING FILE:" + fname);
    sendTextChange(fname);
    now.s_saveUserFileContentsToServer(fname, previousText, function (err) {
        if (err) {
            console.log("File save error!");
            setFileStatusIndicator(fname, "error");
        } else {
            console.log("file save successfully");
            setFileStatusIndicator(fname, "saved");
        }
        saveIsPending = false;
    });
}
function setFileStatusIndicator(fname, status) {
    console.log(fname, status);
    switch (status) {
        case "ok":
        {
            fileIsUnsaved = false;
            iconCls = 'fa-check-square';
            colorCls = 'status-green';
            break;
        }
        case "saved":
        {
            fileIsUnsaved = false;
            iconCls = 'fa-cloud-upload';
            colorCls = 'status-green';
            break;
        }
        case "changed":
        {
            fileIsUnsaved = true;
            iconCls = 'fa-pencil';
            colorCls = 'status-blue';
            break;
        }
        case "error":
            iconCls = 'fa-exclamation-triangle';
            colorCls = 'status-red';
            break;
        case "offline":
        {
            iconCls = 'fa-unlink';
            colorCls = 'status-red';
            break;
        }
        default:
        {
            iconCls = 'fa-square';
            colorCls = 'status-gray';
        }
    }
    tab = Ext.getCmp('filetabs').child('[path=' + fname + ']');
    if (tab) {
        tab.setIconCls('status-tab fa ' + iconCls + ' ' + colorCls);
        tab.status = status;
    }
}
//////////////////////////////////////////////////////////////////////////////// 
//////////////////////////////////////////////////////////////////////////////// 
// 
//              IMPORTED FROM EDIT FILE                 
// 
//////////////////////////////////////////////////////////////////////////////// 
//////////////////////////////////////////////////////////////////////////////// 


// ---------------------------------------------------------
// READY! :)
// ---------------------------------------------------------