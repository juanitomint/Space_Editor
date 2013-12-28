// ---------------------------------------------------------
// NOW BIndings
// ---------------------------------------------------------
now.c_processMessage = function(scope, type, message, fromUserId, fromUserName) {
    console.log("msg from " + fromUserId + ": " + message);
    name = fromUserName;
    var userColor = userColorMap[(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % userColorMap.length];
    var msg = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    notifyAndAddMessageToLog(userColor, fromUserName, msg);
    me = (fromUserId == now.core.clientId) ? true : false;
    groupChatMsg(fromUserName, msg, me, userColor);
}
now.c_addCollaborator = function(user) {
    name = user.about.name;
    userColor = userColorMap[(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % userColorMap.length];
    collaborators[user.clientId] = user.about;
    addCollaborator(user.clientId, name, userColor);
}
now.c_processUserEvent = function(event, fromUserId, fromUserName) {
    if (fromUserId == now.core.clientId) {
        return;
    }
//---set the collabinfo
    if (allCollabInfo[fromUserId] == undefined) {
        allCollabInfo[fromUserId] = [];
        allCollabInfo[fromUserId]['name'] = fromUserName;
        allCollabInfo[fromUserId]['timeLastSeen'] = 0;
    }
    console.log("UserEvent: " + event + " >> " + fromUserName);
    var userColor = userColorMap[(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % userColorMap.length];
    if (event == "join") {
        mostRecentTotalUserCount++;
        notifyAndAddMessageToLog(userColor, fromUserName, "has joined.");
    } else {
        mostRecentTotalUserCount--;
        notifyAndAddMessageToLog(userColor, fromUserName, "has left.");
        removeCollaborator(fromUserId)
    }
}
now.c_processUserFileEvent = function(fname, event, fromUserId, usersInFile, secondaryFilename, msg) {

    if (fromUserId == now.core.clientId) {
        return;
    }

    var uInfo = allCollabInfo[fromUserId];
    var uName = "???";
    if (uInfo != undefined) {
        uName = uInfo.name;
    }
    if (fromUserId == now.core.clientId) {
        uName = now.name;
    }
    console.log("UserFileEvent: " + event + " >> " + fname + " >> " + uName + ", usersInFile: " + usersInFile);
    if (event == "joinFile") {
        setUsersInFile(fname, usersInFile);
        var userColor = userColorMap[(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % userColorMap.length];
        notifyAndAddMessageToLog(userColor, uName, "joined file: <div class='itemType_fileAction'>" + fname + "</div>");
        console.log("added notify for joinFile");
    }
    if (event == "leaveFile") {
        setUsersInFile(fname, usersInFile);
        fname_stripped = fname.replace(/[-[\]{}()*+?.,\/\\^$|#\s]/g, "_");
//if (fname == infile) {
        // remove the user's marker, they just left!
        var cInfo = allCollabInfo[fromUserId];
        if (cInfo != undefined) {
            console.log('cInfo', cInfo)
            cInfo[fname] = cInfo[fname] || [];
            cInfo[fname]['timeLastSeen'] -= TIME_UNTIL_GONE;
            tab = Ext.getCmp(fname_stripped + '-tab');
            if (tab) {
                editor = tab.getEditor();
                if (editor) {
                    var lastCursorID = cInfo[fname]['lastCursorMarkerID'];
                    var ses = editor.getSession();
                    if (lastCursorID !== undefined) {
                        ses.removeMarker(lastCursorID); // remove collaborator's cursor.
                    }
                    var lastSelID = cInfo[fname]['lastSelectionMarkerID'];
                    if (lastSelID !== undefined) {
                        ses.removeMarker(lastSelID); // remove collaborator's selection.
                    }
                }
            }
            cInfo[fname]['isShown'] = false;
        }
//}
    }
    if (event == "deleteFile") {
        removeFileFromList(fname);
        var userColor = userColorMap[(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % userColorMap.length];
        notifyAndAddMessageToLog(userColor, uName, "deleted file: <div class='itemType_fileAction'>" + fname + "</div>");
    }
    if (event == "createFile") {
        addFileToList(fname);
        var userColor = userColorMap[(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % userColorMap.length];
        notifyAndAddMessageToLog(userColor, uName, "created file: <div class='itemType_fileAction'>" + fname + "</div>");
    }
    if (event == "renameFile" && secondaryFilename != undefined) {
        removeFileFromList(fname);
        addFileToList(secondaryFilename);
        var userColor = userColorMap[(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % userColorMap.length];
        notifyAndAddMessageToLog(userColor, uName, "renamed file: <div class='itemType_fileAction'>" + fname + "</div><div style='text-align: right'>to</div><div class='itemType_fileAction'>" + secondaryFilename + "</div>");
    }
    if (event == "duplicateFile" && secondaryFilename != undefined) {
        addFileToList(secondaryFilename);
        var userColor = userColorMap[(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % userColorMap.length];
        notifyAndAddMessageToLog(userColor, uName, "duplicated file: <div class='itemType_fileAction'>" + fname + "</div><div style='text-align: right'>as</div><div class='itemType_fileAction'>" + secondaryFilename + "</div>");
    }
    if (event == "commitProject") {
        var userColor = userColorMap[(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % userColorMap.length];
        notifyAndAddMessageToLog(userColor, uName, "commited project with note: <div class='itemType_projectAction'>" + msg + "</div>");
    }
    if (event == "launchProject") {
        console.log("launch!");
        var userColor = userColorMap[(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % userColorMap.length];
        notifyAndAddMessageToLog(userColor, uName, "<div class='itemType_projectAction'>Launched the project!</div>");
    }

}
now.c_updateTree = function(param) {
}
now.c_setUsersInFile = setUsersInFile;
function setUsersInFile(fname, usersInFile) {
    fname_stripped = fname.replace(/[-[\]{}()*+?.,\/\\^$|#\s]/g, "_");
    tree = Ext.getCmp('FileTree')
    node = tree.store.getNodeById(fname_stripped);
    //node = $("#fileTree").tree('getNodeById', fname_stripped);
    if (node) {

        node.set('users', usersInFile);
        if (node.parentNode != null) {
            node = node.parentNode;
            users = 0;
            //---walk children to sum
            for (j in node.childNodes) {
                child = node.childNodes[j];
                users += (child.data.users) ? child.data.users : 0;
            }
            //---check if node path exists
            if (node.data.path)
                setUsersInFile(node.data.path, users);
        }
    }
    return
    console.log("Unable to add user from file: " + fname);
}
now.c_confirmProject = function(teamID) {
    now.teamID = teamID;
    console.log("PROJECT: " + now.teamID);
    // <a href='http://"+teamID+".chaoscollective.org/'
    $("#topProjName").html(teamID + "");
}
now.c_updateCollabCursor = function(id, name, range, changedByUser, fname) {

    if (id == now.core.clientId) {
        return;
    }
    var cInfo = allCollabInfo[id];
    if (cInfo == undefined) {
// first time seeing this user!
        allCollabInfo[id] = [];
        cInfo = allCollabInfo[id];
        // let collaborator know I'm here.
        ifOnlineLetCollaboratorsKnowImHere();
    }
    if (cInfo[fname] == undefined) {
        cInfo[fname] = [];
    }
    cInfo[fname]['name'] = name;
    cInfo[fname]['timeLastSeen'] = (new Date()).getTime();
    fname_stripped = fname.replace(/[-[\]{}()*+?.,\/\\^$|#\s]/g, "_");
    editor = Ext.getCmp(fname_stripped + '-tab').getEditor();
    var ses = editor.getSession();
    var rSel = Range.fromPoints(range.start, range.end);
    var rCur = Range.fromPoints(range.start, {row: range.start.row, column: range.start.column + 1});
    var lastSelID = cInfo[fname]['lastSelectionMarkerID'];
    if (lastSelID !== undefined) {
        ses.removeMarker(lastSelID);
    }
    var lastCursorID = cInfo[fname]['lastCursorMarkerID'];
    if (lastCursorID !== undefined) {
        ses.removeMarker(lastCursorID);
    }
    var uid = id;
    if (name.indexOf("_") > 0) {
        uid = parseInt(name.substring(name.indexOf("_") + 1), 10);
    }
    var userColor = userColorMap[(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % userColorMap.length];
    cInfo[fname]['lastSelectionMarkerID'] = ses.addMarker(rSel, "collab_selection", "line", false); // range, clazz, type/fn(), inFront
    cInfo[fname]['lastCursorMarkerID'] = ses.addMarker(rCur, "collab_cursor", function(html, range, left, top, config) {
        html.push("<div class='collab_cursor' style='top: " + top + "px; left: " + left + "px; border-left-color: " + userColor + "; border-bottom-color: " + userColor + ";'><div class='collab_cursor_nametag' style='background: " + userColor + ";'>&nbsp;" + cInfo[fname]['name'] + "&nbsp;<div class='collab_cursor_nametagFlag' style='border-right-color: " + userColor + "; border-bottom-color: " + userColor + ";'></div></div>&nbsp;</div>");
    }, false); // range, clazz, type, inFront
    cInfo[fname]['isShown'] = true;
}
now.c_updateWithDiffPatches = function(id, patches, md5, fname) {
//console.log(patches);
    updateWithDiffPatchesLocal(id, patches, md5, fname);
}

now.c_userRequestedFullFile = function(fname, collabID, fileRequesterCallback) {
//if(!initialStateIsWelcome){
    console.log("user requesting full file: " + fname + " >> " + collabID);
    if (infile == fname) {
        fileRequesterCallback(infile, previousText, null, false); // (fname, filedata, err, isSaved)
    } else {
        console.log("Oh No! They think I'm editing a file I'm not. I'm in: " + infile);
    }
//}else{
//  console.log("received request for initial state, but I just got here. ignoring.");
//}
}
now.c_fileStatusChanged = function(fname, status) {
    setFileStatusIndicator(fname, status);
}
now.c_setTeamID = function(val) {
    PROJECT = val;
    document.title = PROJECT;
    //register into the project and join the group.
    Ext.getCmp('FileTree').store.setProxy({
        type: 'ajax',
        method: 'GET',
        noCache: false, //---get rid of the ?dc=.... in urls
        url: '/getFileTree?project=' + PROJECT,
        reader: {
            type: 'json'
        }

    });
    Ext.getCmp('FileTree').store.load();
    this.now.teamID = PROJECT;
    now.s_setTeamID(PROJECT);
    now.s_sendUserEvent("join"); // let everyone know who I am!
    setInterval(ifOnlineLetCollaboratorsKnowImHere, TIME_UNTIL_GONE / 3);
}
now.ready(function() {
    console.log(">>>> NOW READY <<<<");
    if (alreadyConnected) {
        // seeing ready after already being connected.. assume server was reset!
        //alert("editor server was reset... \nreloading page...");
        //window.location.reload();
    }
    nowIsOnline = true;
    alreadyConnected = true;
    console.log("Using NowJS -- this clientId: " + now.core.clientId);
    var getProject = getURLGetVariable("project");
    if (getProject) {
        now.s_setActiveProject(getProject);
    } else {
        now.s_setActiveProject();
    }
    //now.s_sendUserEvent("join"); // let everyone know who I am!
    setInterval(ifOnlineLetCollaboratorsKnowImHere, TIME_UNTIL_GONE / 3);
    var specifiedFileToOpen = getURLHashVariable("fname");
    now.core.on('disconnect', function() {
        console.log("DISCONNECT... Setting nowIsOnline to false"); // this.user.clientId
        nowIsOnline = false;
        tabs = Ext.getCmp('filetabs');
        tabs.items.each(function(tab) {
            if (tab.path) {
                setFileStatusIndicator(tab.path, "offline");
            }
        });
    });
    now.core.on('connect', function() {
        console.log(">>>> NOW CONNECT<<<<");
        console.log("CONNECT... Setting nowIsOnline to true"); // this.user.clientId
        nowIsOnline = true;
    });
});