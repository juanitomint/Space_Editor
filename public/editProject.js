// -----------------------------------------
// Right-click context menu plugin for jQuery...
// -----------------------------------------
var allCollabInfo = [];
(function($) {
    /**
     * @author corey aufang (with many modifications by seewhatsticks dev team)
     * @version 1.0.1
     */
    $.conmenu = function(options) {
        var alreadyHandled = false;
        // first check to see if we already have the selector.
        for (var i = 0; i < items.length; i++) {
            if (options.selector == items[i].selector) {
                //console.log("Overwriting previous rightclick handler: " + options.selector);
                items[i] = options;
                alreadyHandled = true;
            }
        }
        if (!alreadyHandled) {
            // add a new selector to the set.
            items.push(options);
        }
        $(options.selector).bind(window.opera ? 'click' : 'contextmenu', showmenu);
    };
    //defaults
    $.conmenu.containerType = 'div';
    $.conmenu.choicesType = 'div';
    var items = [];
    var container = document.createElement($.conmenu.containerType);
    var marker = document.createElement($.conmenu.containerType);
    $(container).addClass("rightClickContainer");
    $(marker).addClass("rightClickMarker");
    $(document).ready(function() {
        $(container).hide().attr('id', 'conmenu').css('position', 'absolute').appendTo(document.body);
        $(marker).hide().attr('id', 'conmenuMarker').css('position', 'absolute').appendTo(document.body);
    });

    function mouseDownGrabber(clickEvent) {
        clickEvent.stopPropagation();
        resetMenu();
        console.log("I eat your clicks!");
    }

    function showmenu(event) {
        event.stopPropagation();
        resetMenu();
        if (window.opera && !event.ctrlKey) {
            return;
        }
        else {
            $(document.body).bind('mousedown', mouseDownGrabber);
        }
        var foundFirst = false;
        $.each(items, function() {
            if ($.inArray(event.currentTarget, $(this.selector)) > -1) {
                $.each(this.choices, function() {
                    if (!foundFirst) {
                        foundFirst = true;
                    }
                    var action = this.action;
                    $(document.createElement($.conmenu.choicesType)).addClass("rightClickItem").html(this.label).mousedown(function(clickEvent) {
                        clickEvent.stopPropagation();
                        resetMenu();
                        action(event.currentTarget);
                    }).appendTo(container);
                });
            }
        });
        var size = {
            'height': $(window).height(),
            'width': $(window).width(),
            'sT': $(window).scrollTop(),
            'cW': $(container).width(),
            'cH': $(container).height()
        };
        //console.log(container);
        $(marker).css({
            'left': (event.clientX - 3),
            'top': (event.clientY - 3)
        }).show();
        $(container).css({
            'left': ((event.clientX + size.cW) > size.width ? (event.clientX - size.cW) : event.clientX),
            'top': ((event.clientY + size.cH) > size.height && event.clientY > size.cH ? (event.clientY + size.sT - size.cH) : event.clientY + size.sT)
        }).show();
        //console.log(container);
        return false;
    }

    function resetMenu() {
        $(container).hide().empty();
        $(marker).hide();
        $(document.body).unbind('mousedown', mouseDownGrabber);
    }
})(jQuery);
// -----------------------------------------
// JQuery plugin disable selection.
// -----------------------------------------
(function($) {
    $.fn.disableSelection = function() {
        return this.each(function() {
            $(this).attr('unselectable', 'on').css({
                '-moz-user-select': 'none',
                '-webkit-user-select': 'none',
                'user-select': 'none'
            }).each(function() {
                this.onselectstart = function() {
                    return false;
                };
            });
        });
    };
})(jQuery);
// ---------------------------------------------------------
// Main functions...
// ---------------------------------------------------------
function fileHasExtention(f, ext) {
    return ((f.indexOf(ext) > 0 && f.indexOf(ext) == f.length - ext.length));
}
// ----------------------------------------------------------
var mostRecentFilesAndInfo = [];
var mostRecentTotalUserCount = 1;
function safelyOpenFileFromEntry(el) {
    var fname = $(el).attr('fname');
    if (fname != undefined && fname != null && fname != "") {
        console.log("SAFELY OPENING FILE: " + fname);
        console.log("TODO: make sure file is saved before opening over it...");
        /*
         var divToPopulate = $(".paneScreenSelected");
         if (divToPopulate.length > 0) {
         divToPopulate = $(divToPopulate[0]).parents(".editPane");
         console.log(divToPopulate);
         }
         */
        createEditPane(fname);
        closeFileBrowser();
    } else {
        console.log("output log disabled for demo.");
        return;
        console.log("Undefined filename... showing log.");
        var divToPopulate = $(".paneScreenSelected");
        if (divToPopulate.length > 0) {
            divToPopulate = $(divToPopulate[0]).parents(".editPane");
            console.log(divToPopulate);
            populateEditPane(divToPopulate, "");
        }
        closeFileBrowser();
    }
}
function registerCloseEvent() {

    $(".closeTab").click(function() {

        //there are multiple elements which has .closeTab icon so close the tab whose close icon is clicked
        var tabContentId = $(this).parent().attr("href");
        var fname = $(tabContentId).attr('fname');
        $(this).parent().parent().remove(); //remove li of tab
        $('#myTab a:last').tab('show'); // Select first tab
        //remove respective tab content
        $(tabContentId).remove();
        //remove user from filelist
        //now.s_leaveFile(fname);
    });
}
function createEditPane(fname) {
    if (fname) {
        fname_stripped = fname.replace(/[-[\]{}()*+?.,\/\\^$|#\s]/g, "_");
        if (!$('#myTab a[href="#' + fname_stripped + '"]').length) {
            $('#myTab').append('<li><a href="#' + fname_stripped + '" data-toggle="tab"><button class="close closeTab" type="button" >×</button>' + fname + '</a>');
            $('#tabContent').append('<div class="tab-pane tab editPane" fname="' + fname + '" id="' + fname_stripped + '"></div>');
            registerCloseEvent();
            populateEditPane($('#' + fname_stripped), fname);
        }
        $('#myTab a[href="#' + fname_stripped + '"]').tab('show');
        //now.s_enterFile(fname);
    }
}
function populateEditPane(editPane, fname) {
    if (fname) {
        $(editPane).html("<iframe style='height:100%;width:100%' src='/editFile.html?project=" + PROJECT + "#fname=" + fname + "'></iframe><div class='paneScreen' onmousedown='selectPaneScreen(this);'></div>");
    } else {
        $(editPane).html("<iframe src='/live?log=" + PROJECT + "'></iframe><div class='paneScreen' onmousedown='selectPaneScreen(this);'></div>");
    }
}
function setUsersInFile(fname, usersInFile) {
    for (var i = 0; i < mostRecentFilesAndInfo.length; i++) {
        var f = mostRecentFilesAndInfo[i];
        if (f[0] == fname) {
            f[1] = usersInFile;
            updateFileBrowserFromFileList(mostRecentFilesAndInfo);
            return;
        }
    }
    console.log("Unable to add user from file: " + fname);
}
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
    updateFileBrowserFromFileList(mostRecentFilesAndInfo);
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
// ---------------------------------------------------------
// File browser
// ---------------------------------------------------------
var fileBrowserIsOpen = false;
var fileBrowserMouseDownFn = function(event) {
    if ($(event.target).attr('id') != "fileBrowser" && $(event.target).parents("#fileBrowser").length == 0 && $(event.target).attr('id') != "filebrowserButton") {
        $(document).unbind('mousedown', fileBrowserMouseDownFn);
        closeFileBrowser();
    }
}
function updateFileBrowserFromFileList(filesAndInfo) {
    mostRecentFilesAndInfo = filesAndInfo;
    var mediaHTML = "";
    var htmlHTML = "";
    var cssHTML = "";
    var jsHTML = "";
    filesAndInfo.sort(fileSorter_Name);
    //console.log(filesAndInfo);
    for (var i = filesAndInfo.length - 1; i >= 0; i--) {
        var fInfo = filesAndInfo[i];
        var f = fInfo[0] || 0;
        var u = fInfo[1] || 0;
        var sz = fInfo[2] || 0;
        var td = fInfo[3] || 0;
        var fm = fInfo[4] || 0;
        if (f == "") {
            // this is the total number of users. Update and remove from file list.
            mostRecentTotalUserCount = u;
            filesAndInfo.splice(i, 1);
            continue;
        }
        var szAddon = "";
        if (sz > 0) {
            var dSz = Math.floor(sz / 10.24) / 100;
            szAddon = "<div class='fileEntrySize'>" + dSz + "k</div>";
        }
        var uAddon = "";
        if (u > 0) {
            var uNum = u;
            if (u > 9) {
                uNum = "9+";
            }
            uAddon = "<div class='fileEntryUsers' title='" + u + " users'>" + uNum + "</div>";
        }
        var tdAddon = "";
        if (td > 0) {
            tdAddon = "<div class='fileEntryTD' title='" + td + " TO" + "DO' style='height: " + Math.min(16, 1 + td) + "px;'></div>";
        }
        var fmAddon = "";
        if (fm > 0) {
            fmAddon = "<div class='fileEntryFM' title='" + fm + " FIX" + "ME' style='height: " + Math.min(16, 1 + fm) + "px;'></div>";
        }
        var styledFile = f;
        if (f.lastIndexOf("/") > 0) {
            styledFile = "<div class='fileEntryDir'>" + f.substring(0, f.lastIndexOf("/") + 1) + "</div> " + f.substring(f.lastIndexOf("/") + 1);
        }
        // put into type folders...
        if (fileHasExtention(f, ".js")) {
            jsHTML += "<div class='fileEntry' onclick='safelyOpenFileFromEntry(this);' fname='" + f + "'>" + styledFile + uAddon + szAddon + tdAddon + fmAddon + "</div>";
        } else {
            if (fileHasExtention(f, ".css") || fileHasExtention(f, ".less") || fileHasExtention(f, ".styl")) {
                cssHTML += "<div class='fileEntry' onclick='safelyOpenFileFromEntry(this);' fname='" + f + "'>" + styledFile + uAddon + szAddon + tdAddon + fmAddon + "</div>";
            } else {
                if (fileHasExtention(f, ".html") || fileHasExtention(f, ".php")) {
                    htmlHTML += "<div class='fileEntry' onclick='safelyOpenFileFromEntry(this);' fname='" + f + "'>" + styledFile + uAddon + szAddon + tdAddon + fmAddon + "</div>";
                } else {
                    mediaHTML += "<div class='fileEntry' onclick='safelyOpenFileFromEntry(this);' fname='" + f + "'>" + styledFile + uAddon + szAddon + tdAddon + fmAddon + "</div>";
                }
            }
        }
    }
    $("#fileBrowser_Media").html(mediaHTML);
    $("#fileBrowser_HTML").html(htmlHTML);
    $("#fileBrowser_CSS").html(cssHTML);
    $("#fileBrowser_JS").html(jsHTML);
    $(".fileEntry").disableSelection();
    $.conmenu({
        selector: ".fileEntry",
        choices: [{
                label: "<div class='rightClickCornerCut'></div>",
            },
            {
                label: "<div class='rightClickItemEl'>Duplicate</div>",
                action: function(div) {
                    var fname = $(div).attr("fname");
                    openShiftShiftAsDuplicate(fname);
                }
            },
            {
                label: "<div class='rightClickItemEl'>Rename</div>",
                action: function(div) {
                    var fname = $(div).attr("fname");
                    if (getUsersInFile(fname) <= 0) {
                        openShiftShiftAsRename(fname);
                    }
                }
            },
            {
                label: "<div class='rightClickItemSpacer'></div>",
                action: function(div) {
                    //console.log("SPACER: "+fname);
                }
            },
            {
                label: "<div class='rightClickItemEl'>Delete</div>",
                action: function(div) {
                    var fname = $(div).attr("fname");
                    if (getUsersInFile(fname) <= 0) {
                        openShiftShiftAsDelete(fname);
                    }
                }
            }]
    });
}
function fileSorter_Name(a, b) {
    if (a[0].toLowerCase() == b[0].toLowerCase()) {
        return 0;
    }
    return (a[0].toLowerCase() > b[0].toLowerCase()) ? -1 : 1;
}
function fileSorter_Size(a, b) {
    if (a[2] == b[2]) {
        return 0;
    }
    return (a[2] > b[2]) ? -1 : 1;
}
function toggleFileBrowser() {
    if (fileBrowserIsOpen) {
        closeFileBrowser();
    } else {
        openFileBrowser();
    }
}
function closeFileBrowser() {
    $("#fileBrowser").animate({bottom: -315}, 100);
    fileBrowserIsOpen = false;
    $(".paneScreen").hide();
}
function openFileBrowser() {
    var origActive = document.activeElement;
    console.log(origActive);
    var putFileInPane = $("#pane_0");
    var epane = $(origActive).parents(".editPane");
    if (epane && epane.length > 0) {
        putFileInPane = epane;
    }
    $(".paneScreen").removeClass("paneScreenSelected").show();
    putFileInPane.children(".paneScreen").addClass("paneScreenSelected");
    $("#fileBrowser").animate({bottom: 34}, 100);
    fileBrowserIsOpen = true;
    $(document).unbind('mousedown', fileBrowserMouseDownFn);
    $(document).bind('mousedown', fileBrowserMouseDownFn);
    //setTimeout(loadAllProjectFiles, 50);
}
function selectPaneScreen(p) {
    $(".paneScreen").removeClass("paneScreenSelected").show();
    $(p).addClass("paneScreenSelected");
    event.stopPropagation();
}
function createNewFile(el) {
    if ($(el).html() == "New File...") {
        $(el).html("New File...<input id='newfileInputName' type='text' onkeydown='if(event.keyCode==13){createNewFileFromInputs();}if(event.keyCode==27){$(this).parent().html(\"New File...\");}'/><select id='newfileInputType'><option>.js</option><option>.json</option><option>.css</option><option>.html</option><option>.txt</option><option>.styl</option><option>.less</option></select><input type='submit' value='ok' onclick='createNewFileFromInputs(); event.stopPropagation();' />");
        $("#newfileInputName").focus();
    }
}
function createNewFileFromInputs() {
    var newfname = $("#newfileInputName").val().replace(/\ /g, "_").replace(/[^a-zA-Z_\.\-0-9\/\(\)]+/g, '');
    var newftype = $("#newfileInputType").val();
    if (newfname.length > 40) {
        alert("invalid file name. it's too long. :(");
        return;
    }
    $("#newfileInputName").parent().html("New File...");
    if (newfname.length == 0) {
        return;
    }
    var newFilename = newfname + newftype;
    console.log("Requesting file creation: " + newFilename);
    if (newFilename != "") {
        $.post("/createFile?project=" + PROJECT, {fname: newFilename}, function(data) {
            if (data && data.indexOf("FAIL") !== 0) {
                shoutCreatedFile(data);
            } else {
                alert("failed to create new file.");
            }
        });
    }
}
function deleteFile(fname) {
    $.post("/deleteFile?project=" + PROJECT, {fname: fname}, function(data) {
        if (data && data.indexOf("FAIL") !== 0) {
            console.log("I just deleted the file. > " + fname);
            shoutDeletedFile(data);
        } else {
            alert("failed to delete file: " + fname);
        }
    });
}
// ---------------------------------------------------------
// Shift+Shift
// ---------------------------------------------------------
var preShiftShiftFocusElement = null;
var shiftShiftMouseDownFn = function(event) {
    if ($(event.target).attr('id') != "shiftshift" && $(event.target).parents("#shiftshift").length == 0 && $(event.target).parents("#topMenu").length == 0) {
        $(document).unbind('mousedown', shiftShiftMouseDownFn);
        closeShiftShift();
    }
}
function toggleShiftShift() {
    if ($("#shiftshift").is(":visible")) {
        closeShiftShift();
    } else {
        openShiftShiftAsBroadcast();
    }
}
function openShiftShift(html, height, borderColor) {
    if (!$("#shiftshift").is(":visible")) {
        // open it.
        preShiftShiftFocusElement = document.activeElement;
        $("#shiftshift").css({height: height, "border-color": borderColor}).html(html).show();
        $("#topMenu_CMD").addClass("topMenuItemOpen");
        $(document).unbind('mousedown', shiftShiftMouseDownFn);
        $(document).bind('mousedown', shiftShiftMouseDownFn);
    }
}
function closeShiftShift() {
    if ($("#shiftshift").is(":visible")) {
        // close it.
        $("#shiftshift").hide();
        $("#topMenu_CMD").removeClass("topMenuItemOpen");
        $("#shiftshiftInputDiv input").blur();
        $(preShiftShiftFocusElement).focus();
    }
}
function shiftshiftBroadcastKeydown(event) {
    if (event.keyCode == 13) {
        // ENTER was pressed
        var txt = $("#shiftshiftInputDiv input").val();
        if (txt != "") {
            var usedAsCommand = false;
            if (txt.length == 1) {
                switch (txt.toLowerCase()) {
                    case "f":
                        {
                            toggleFileBrowser();
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
        $("#shiftshiftInputDiv input").val("");
        if (!event.shiftKey) {
            toggleShiftShift();
        }
        return false;
    }
    if (event.keyCode == 27) {
        // ESC was pressed
        toggleShiftShift();
        return false;
    }
    return true;
}
// -------------
function shiftshiftRenameKeydown(event, fname) {
    if (event.keyCode == 13) {
        // ENTER was pressed
        var txt = $("#shiftshiftInputDiv input").val();
        if (txt != "") {
            $.post("/renameFile?project=" + PROJECT, {fname: fname, newfname: txt}, function(data) {
                if (data && data.indexOf("FAIL") !== 0) {
                    console.log("I just renamed the file. > " + fname + " to " + data);
                    shoutRenamedFile(fname, data);
                } else {
                    alert("failed to rename file: " + fname);
                }
            });
        }
        $("#shiftshiftInputDiv input").val("");
        toggleShiftShift();
        return false;
    }
}
function shiftshiftDuplicateKeydown(event, fname) {
    if (event.keyCode == 13) {
        // ENTER was pressed
        var txt = $("#shiftshiftInputDiv input").val();
        if (txt != "") {
            if (getUsersInFile(fname) != 0) {
                alert("cannot duplicate file, there are still users editing it!");
                return;
            }
            $.post("/duplicateFile?project=" + PROJECT, {fname: fname, newfname: txt}, function(data) {
                if (data && data.indexOf("FAIL") !== 0) {
                    console.log("I just duplicated the file. > " + fname + " to " + data);
                    shoutDuplicatedFile(fname, data);
                } else {
                    alert("failed to duplicate file: " + fname);
                }
            });
        }
        $("#shiftshiftInputDiv input").val("");
        toggleShiftShift();
        return false;
    }
}
function shiftshiftCommitKeydown(event) {
    if (event.keyCode == 13) {
        // ENTER was pressed
        var txt = $("#shiftshiftInputDiv input").val();
        now.s_commitProject(txt, function(errs) {
            if (errs) {
                console.log(errs);
                alert("Error committing project: \n\n >> " + errs.message);
            } else {
                console.log("I just committed the project.");
            }
        });
        $("#shiftshiftInputDiv input").val("");
        toggleShiftShift();
        return false;
    }
}
function openShiftShiftAsBroadcast() {
    var html = "";
    html += "<div id='shiftshiftTitle'>BROADCAST</div>";
    html += "<div id='shiftshiftInputDiv'><input type='text' onkeydown='return shiftshiftBroadcastKeydown(event);'/></div>";
    openShiftShift(html, 90, "#00ACED");
    $("#shiftshiftInputDiv input").val("").focus();
}
function openShiftShiftAsRename(fname) {
    var html = "";
    html += "<div id='shiftshiftTitle'>RENAME</div>";
    html += "<div id='shiftshiftFilename'>" + fname + " <span>to...</span></div>";
    html += "<div id='shiftshiftInputDiv'><input type='text' onkeydown='return shiftshiftRenameKeydown(event, \"" + fname + "\");'/></div>";
    openShiftShift(html, 130, "#FFF100");
    setTimeout(function() {
        $("#shiftshiftInputDiv input").val(fname).focus();
    }, 50);
}
function openShiftShiftAsDuplicate(fname) {
    var html = "";
    html += "<div id='shiftshiftTitle'>DUPLICATE</div>";
    html += "<div id='shiftshiftFilename'>" + fname + " <span>as...</span></div>";
    html += "<div id='shiftshiftInputDiv'><input type='text' onkeydown='return shiftshiftDuplicateKeydown(event, \"" + fname + "\");'/></div>";
    openShiftShift(html, 130, "#FFF100");
    setTimeout(function() {
        $("#shiftshiftInputDiv input").val(fname).focus();
    }, 50);
}
function openShiftShiftAsDelete(fname) {
    var html = "";
    html += "<div id='shiftshiftTitle'>DELETE</div>";
    html += "<div id='shiftshiftFilename'>" + fname + "</div>";
    html += "<div id='shiftshiftBtn_Cancel' class='shiftshiftBtn' onclick='closeShiftShift();'>cancel file termination</div>";
    html += "<div id='shiftshiftBtn_Delete' class='shiftshiftBtn' onclick='deleteFile(\"" + fname + "\"); closeShiftShift();'>DELETE</div>";
    openShiftShift(html, 130, "#FF3600");
    $("#shiftshiftInputDiv input").val("").focus();
}
function openShiftShiftAsCommit() {
    alert("FAIL: Sorry but committing projects is currently disabled.");
    return;
    var html = "";
    html += "<div id='shiftshiftTitle'>COMMIT</div>";
    html += "<div id='shiftshiftFilename'><span>Notes...</span></div>";
    html += "<div id='shiftshiftInputDiv'><input type='text' onkeydown='return shiftshiftCommitKeydown(event);'/></div>";
    openShiftShift(html, 130, "#FFF100");
    setTimeout(function() {
        $("#shiftshiftInputDiv input").val("").focus();
    }, 50);
    if (fileIsUnsaved) {
        saveFileToServer();
    }
}
// ---------------------------------------------------------
// LOG and Notifications.
// ---------------------------------------------------------
var userColorMap = ["#9DDC23", "#00FFFF", "#FF308F", "#FFD400", "#FF0038", "#7C279B", "#FF4E00", "#6C8B1B", "#0A869B"];
function notifyAndAddMessageToLog(userColor, fromUserName, msg) {
    var t = (new Date()).getTime();
    $("#notifications").append("<div class='notificationItem' style='border-top-color: " + userColor + ";' postTime='" + t + "'><span>" + fromUserName + ":</span> " + msg + "</div>");
    $("#logWindowContent").append("<div class='logItem'><div class='logItemTop' style='border-top-color: " + userColor + ";'></div><span>" + fromUserName + ":</span> " + msg + "</div>").stop().animate({scrollTop: ($("#logWindowContent")[0].scrollHeight - $("#logWindowContent").height())}, 250);
}
function toggleLog() {
    if ($("#logWindow").is(":visible")) {
        // close it.
        $("#logWindow").hide();
        $("#topMenu_LOG").removeClass("topMenuItemOpen");
    } else {
        // open it.
        $("#logWindow").show();
        $("#topMenu_LOG").addClass("topMenuItemOpen");
    }
}
// ---------------------------------------------------------
// LOG OUTPUT / CONSOLE
// ---------------------------------------------------------
function toggleLogOutput() {
    if ($("#logOutput").is(":visible")) {
        // close it.
        $("#logOutput").hide();
        $("#topMenu_OUT").removeClass("topMenuItemOpen");
    } else {
        // open it.
        $("#logOutput").show();
        $("#topMenu_OUT").addClass("topMenuItemOpen");
    }
}
// ---------------------------------------------------------
// Launch!
// ---------------------------------------------------------
function launchProject() {
    console.log("Attempting to launch project...");
    $.post("/launchProject?project=" + PROJECT, function(data) {
        if (data && data.indexOf("FAIL") !== 0) {
            shoutLaunchedProject();
        } else {
            alert(data); //"failed to launch project.");
        }
    });
}
function loadAllProjectFiles(tryToLoadFirstFiles) {
    $.get("/allProjectFiles?project=" + PROJECT, function(data) {
        if (data) {
            try {
                var filesAndInfo = JSON.parse(data);
                updateFileBrowserFromFileList(filesAndInfo);
                // first time only, check if index.less exists: otherwise, fallback to index.css.
                if (tryToLoadFirstFiles) {
                    console.log("-- trying to load first file for pane 0 --");
                    if (!getProjectFileInfo("public/index.less")) {
                        if (getProjectFileInfo("public/index.css")) {
                            populateEditPane($("#pane_0"), "public/index.css");
                        } else {
                            if (getProjectFileInfo("public/index.html")) {
                                populateEditPane($("#pane_0"), "public/index.html");
                            } else {
                                if (getProjectFileInfo("_project.json")) {
                                    populateEditPane($("#pane_0"), "_project.json");
                                } else {
                                    console.log("-- no file seems suitable for initial pane 0 --");
                                }
                            }
                        }
                    }
                }
            } catch (ex) {
                console.log("JSON fail?");
                console.log(ex);
            }
        } else {
            console.log("ERROR: couldn't fetch project file data.");
            console.log(data);
        }
    });
}
// ---------------------------------------------------------
// Shout
// ---------------------------------------------------------
function shoutLaunchedProject() {
    console.log("TODO: shout that project has been launched.");
}
function shoutCreatedFile(fname) {
    loadAllProjectFiles();
    closeFileBrowser();
    var divToPopulate = $(".paneScreenSelected");
    if (divToPopulate.length > 0) {
        divToPopulate = $(divToPopulate[0]).parents(".editPane");
        console.log(divToPopulate);
        populateEditPane(divToPopulate, fname);
    }
    console.log("TODO: shout that file was created >> " + fname);
}
function shoutDeletedFile(fname) {
    loadAllProjectFiles();
    console.log("TODO: shout that file was deleted >> " + fname);
}
function shoutRenamedFile(fname, newfname) {
    loadAllProjectFiles();
    console.log("TODO: shout that file was renamed >> " + fname + " to " + newfname);
}
function shoutDuplicatedFile(fname, newfname) {
    loadAllProjectFiles();
    console.log("TODO: shout that file was duplicated >> " + fname + " to " + newfname);
}
// ---------------------------------------------------------
// NOW BIndings
// ---------------------------------------------------------
now.c_processMessage = function(scope, type, message, fromUserId, fromUserName) {
    console.log("msg from " + fromUserId + ": " + message);
    name = fromUserId;
    var userColor = userColorMap[(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % userColorMap.length];
    var msg = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    notifyAndAddMessageToLog(userColor, fromUserName, msg);
    me = (fromUserId == now.core.clientId) ? true : false;
    groupChatMsg(fromUserName, msg, me);
}
now.c_processUserEvent = function(event, fromUserId, fromUserName) {
    if (fromUserId == now.core.clientId) {
        return;
    }
    var cInfo = allCollabInfo[fromUserId];
    if (cInfo == undefined) {
        allCollabInfo[fromUserId] = [];
        cInfo = allCollabInfo[fromUserId];
        cInfo['name'] = fromUserName;
        cInfo['timeLastSeen'] = 0;
    }
    console.log("UserEvent: " + event + " >> " + fromUserName);
    var userColor = userColorMap[(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % userColorMap.length];
    if (event == "join") {
        mostRecentTotalUserCount++;
        notifyAndAddMessageToLog(userColor, fromUserName, "has joined.");
    } else {
        mostRecentTotalUserCount--;
        notifyAndAddMessageToLog(userColor, fromUserName, "has left.");
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
//        if (fname == infile) {
//            // remove the user's marker, they just left!
//            var cInfo = allCollabInfo[fromUserId];
//            if (cInfo != undefined) {
//                cInfo['timeLastSeen'] -= TIME_UNTIL_GONE;
//            }
//        }
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
function followMe() {

    now.s_followMe(fname);
}
function groupChatMsg(fromUserName, msg, me) {
    add = (me) ? 'Me' : 'Other';
    $('#groupMsg').append('<div class="groupChatMsg groupChat' + add + '">' + fromUserName + ':<br/>' + msg + '</div>');
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
function setupJoin(j) {
    var join = j;
    var isLR = true;
    if (!$(join).hasClass("joinLR")) {
        isLR = false;
    }
    var divScreen = $(join).children(".divScreen");
    if (isLR) {
        var divLeft = $(join).children(".joinLeft");
        var divRight = $(join).children(".joinRight");
        var divBar = $(join).children(".divLR");
        function updateLR() {
            var p = divBar.position();
            divRight.css({left: (p.left + divBar.width()) + "px"});
            divLeft.css({width: (p.left) + "px"});
        }
        updateLR();
        $(divBar).draggable({
            axis: "x",
            containment: join,
            iframeFix: true,
            start: function(event, ui) {
                divScreen.show();
                updateLR();
            },
            drag: function(event, ui) {
                updateLR();
            },
            stop: function(event, ui) {
                updateLR();
                divScreen.hide();
            }
        });
    } else {
        var divTop = $(join).children(".joinTop");
        var divBottom = $(join).children(".joinBottom");
        var divBar = $(join).children(".divTB");
//        function updateTB() {
//            var p = divBar.position();
//            divBottom.css({top: (p.top + divBar.height()) + "px"});
//            divTop.css({height: (p.top) + "px"});
//        }
//        updateTB();
        $(divBar).draggable({
            axis: "y",
            containment: join,
            iframeFix: true,
            start: function(event, ui) {
                divScreen.show();
                updateTB();
            },
            drag: function(event, ui) {
                updateTB();
            },
            stop: function(event, ui) {
                updateTB();
                divScreen.hide();
            }
        });
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
function sendTextChange() {
    if (infile === "") {
        return;
    }
    textChangeTimeout = null;
    //console.log("send text change.");
    var currentText = editor.getSession().getValue();
    if (currentText === previousText) {
        //console.log("text is the same. sidestepping update.");
        return false;
    }
    setFileStatusIndicator("changed");
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
        editor = thisTab.getEditor();
        infile = thisTab.path;
        var range = editor.getSelectionRange();
        console.log('sending cursor update for:'+infile);
        now.s_sendCursorUpdate(infile, range, true);
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
            if (cInfo['isShown']) {
                var tDiff = t - cInfo['timeLastSeen'];
                if (tDiff > TIME_UNTIL_GONE) {
                    console.log("Looks like " + cInfo['name'] + " is no longer around.");
                    var lastCursorID = cInfo['lastCursorMarkerID'];
                    var ses = editor.getSession();
                    if (lastCursorID !== undefined) {
                        ses.removeMarker(lastCursorID); // remove collaborator's cursor.
                    }
                    var lastSelID = cInfo['lastSelectionMarkerID'];
                    if (lastSelID !== undefined) {
                        ses.removeMarker(lastSelID); // remove collaborator's selection.
                    }
                    cInfo['isShown'] = false;
                } else {
                    activeCollabs++;
                }
            }
        }
    }
    if (activeCollabs > 0) {
        $("#whoAreThey").html("+" + activeCollabs);
        if (activeCollabs == 1) {
            $("#whoAreThey").attr("title", activeCollabs + " other person collaborating");
        } else {
            $("#whoAreThey").attr("title", activeCollabs + " other people collaborating");
        }
    } else {
        $("#whoAreThey").html("0");
        $("#whoAreThey").attr("title", "No one else is collaborating");
    }
    $(".notificationItem").each(function(index, el) {
        var pt = $(el).attr('postTime');
        if ((t - pt) > NOTIFICATION_TIMEOUT) {
            $(el).fadeOut(500, function() {
                $(el).remove();
            });
        }
    });
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
}
function removeAllCollaborators() {
    console.log("Removing all previous collaborators...");
    for (var prop in allCollabInfo) {
        if (allCollabInfo.hasOwnProperty(prop)) {
            var cInfo = allCollabInfo[prop];
            console.log("trying to remove: " + cInfo['name']);
            cInfo['timeLastSeen'] -= TIME_UNTIL_GONE;
        }
    }
    ifOnlineVerifyCollaboratorsAreStillHere_CleanNotifications_AutoSave();
}
// -----------------------------------------
// Diff-Match-Patch.
// -----------------------------------------
var patchQueue = [];
var patchingInProcess = false;
var previousText = "";
var dmp = new diff_match_patch();
dmp.Diff_Timeout = 1;
dmp.Diff_EditCost = 4;
var updateWithDiffPatchesLocal = function(id, patches, md5) {
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
        var localChangeJustSent = sendTextChange(); // make sure we send any outstanding changes before we apply remote patches.

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
                setFileStatusIndicator("changed");
            } else {
                setFileStatusIndicator("error");
                console.log("** OH NO: MD5 mismatch. this=" + newMD5 + ", wanted=" + md5);
                now.s_requestFullFileFromUserID(infile, id, function(fname, fdata, err, isSaved) {
                    if (fname != infile) {
                        console.log("Oh No! They sent me a file that I don't want: " + fname);
                        return;
                    }
                    console.log("### FULL FILE UPDATE (from remote user)...");
                    var patch_list = dmp.patch_make(previousText, fdata);
                    var patch_text = dmp.patch_toText(patch_list);
                    var patches = dmp.patch_fromText(patch_text);
                    var md5 = Crypto.MD5(fdata);
                    updateWithDiffPatchesLocal(id, patches, md5);
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
        updateWithDiffPatchesLocal(nextPatch.id, nextPatch.patches, nextPatch.md5);
    }
}
// -----------------------------------------
// Now.JS Client-side functions.
// -----------------------------------------
now.c_updateCollabCursor = function(id, name, range, changedByUser, fname) {
    
    if (id == now.core.clientId) {
        return;
    }
    console.log('recive cursor update from:'+name+' for file:'+fname);
    var cInfo = allCollabInfo[id];
    if (cInfo == undefined) {
        // first time seeing this user!
        allCollabInfo[id] = [];
        cInfo = allCollabInfo[id];
        cInfo['name'] = name;
        // let collaborator know I'm here.
        ifOnlineLetCollaboratorsKnowImHere();
    }
    cInfo['timeLastSeen'] = (new Date()).getTime();
    fname_stripped = fname.replace(/[-[\]{}()*+?.,\/\\^$|#\s]/g, "_");
    editor = Ext.getCmp(fname_stripped + '-tab').getEditor();
    var ses = editor.getSession();
    var rSel = Range.fromPoints(range.start, range.end);
    var rCur = Range.fromPoints(range.start, {row: range.start.row, column: range.start.column + 1});
    var lastSelID = cInfo['lastSelectionMarkerID'];
    if (lastSelID !== undefined) {
        ses.removeMarker(lastSelID);
    }
    var lastCursorID = cInfo['lastCursorMarkerID'];
    if (lastCursorID !== undefined) {
        ses.removeMarker(lastCursorID);
    }
    var uid = id;
    if (name.indexOf("_") > 0) {
        uid = parseInt(name.substring(name.indexOf("_") + 1), 10);
    }
    var userColor = userColorMap[(name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % userColorMap.length];
    cInfo['lastSelectionMarkerID'] = ses.addMarker(rSel, "collab_selection", "line", false); // range, clazz, type/fn(), inFront
    cInfo['lastCursorMarkerID'] = ses.addMarker(rCur, "collab_cursor", function(html, range, left, top, config) {
        html.push("<div class='collab_cursor' style='top: " + top + "px; left: " + left + "px; border-left-color: " + userColor + "; border-bottom-color: " + userColor + ";'><div class='collab_cursor_nametag' style='background: " + userColor + ";'>&nbsp;" + cInfo['name'] + "&nbsp;<div class='collab_cursor_nametagFlag' style='border-right-color: " + userColor + "; border-bottom-color: " + userColor + ";'></div></div>&nbsp;</div>");
    }, false); // range, clazz, type, inFront
    cInfo['isShown'] = true;
}
now.c_updateWithDiffPatches = function(id, patches, md5) {
    //console.log(patches);
    updateWithDiffPatchesLocal(id, patches, md5);
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
    if (fname == infile) {
        setFileStatusIndicator(status);
    } else {
        console.log("saw file status change for wrong file: " + fname);
    }
}

var alreadyConnected = false;
now.ready(function() {
    if (alreadyConnected) {
        // seeing ready after already being connected.. assume server was reset!
        //alert("editor server was reset... \nreloading page...");
        //window.location.reload();
    }
    nowIsOnline = true;
    alreadyConnected = true;
    console.log("Using NowJS -- this clientId: " + now.core.clientId);
    now.s_setTeamID(PROJECT);
    now.s_sendUserEvent("join"); // let everyone know who I am!
    setInterval(ifOnlineLetCollaboratorsKnowImHere, TIME_UNTIL_GONE / 3);
    var specifiedFileToOpen = getURLHashVariable("fname");

    now.core.on('disconnect', function() {
        console.log("DISCONNECT... Setting nowIsOnline to false"); // this.user.clientId
        nowIsOnline = false;
        //setFileStatusIndicator("offline");
    });
    now.core.on('connect', function() {
        console.log("CONNECT... Setting nowIsOnline to true"); // this.user.clientId
        nowIsOnline = true;
        //setFileStatusIndicator("default");
    });
});
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
        editor.setReadOnly(true);
        ignoreAceChange = true;
        editor.getSession().setValue(""); // clear the editor.
        initialFileloadTimeout = setTimeout(function() {
            initialStateIsWelcome = false;
        }, 3000);
        editor.setFadeFoldWidgets(false);
        if (infile != "") {
            // we're leaving the file we're in. let collaborators know.
            //now.s_leaveFile(infile);
        }
        now.s_getLatestFileContentsAndJoinFileGroup(fname, function(fname, fdata, err, isSaved) {
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
            // ----
            $("#topFileName").html(infile);
            // ----
            if ($("#recentFile_2").html() == infile) {
                $("#recentFile_2").html($("#recentFile_1").html()).attr("fname", $("#recentFile_1").attr('fname'));
                $("#recentFile_1").html($("#recentFile_0").html()).attr("fname", $("#recentFile_0").attr('fname'));
            } else {
                if ($("#recentFile_1").html() == infile) {
                    $("#recentFile_1").html($("#recentFile_0").html()).attr("fname", $("#recentFile_0").attr('fname'));
                } else {
                    $("#recentFile_3").html($("#recentFile_2").html()).attr("fname", $("#recentFile_2").attr('fname'));
                    $("#recentFile_2").html($("#recentFile_1").html()).attr("fname", $("#recentFile_1").attr('fname'));
                    $("#recentFile_1").html($("#recentFile_0").html()).attr("fname", $("#recentFile_0").attr('fname'));
                }
            }
            $("#recentFile_0").html(infile).attr("fname", infile);
            ignoreAceChange = true;
            editor.getSession().setValue(fdata.replace(/\t/g, "  "));
            // TODO: Auto-fold here...
            // addFold("...", new Range(8, 44, 13, 4));
            ignoreAceChange = false;
            editor.setReadOnly(false);
            // auto fold things that are code (html is an expection...)

            //autoFoldCodeProgressive();
            previousText = editor.getSession().getValue();
            if (isSaved) {
                setFileStatusIndicator("saved");
            } else {
                setFileStatusIndicator("changed");
            }
            removeAllCollaborators();
            ifOnlineLetCollaboratorsKnowImHere();
            setURLHashVariable("fname", infile);
            openIsPending = false;
        });
        initialFileloadTimeout = null;
        setFileStatusIndicator("unknown");
    }
}
function setFileStatusIndicator(status) {
    switch (status) {
        case "saved":
            {
                $("#fileStatusBlock").css({background: "#58C554", "border-radius": "1px", border: "none", margin: 0});
                fileIsUnsaved = false;
                break;
            }
        case "changed":
            {
                $("#fileStatusBlock").css({background: "none", "border-radius": "0px", border: "1px solid #CCC", "margin-left": "-1px", "margin-top": "-1px"});
                fileIsUnsaved = true;
                break;
            }
        case "error":
        case "offline":
            {
                $("#fileStatusBlock").css({background: "#F00", "border-radius": "1px", border: "none", margin: 0});
                break;
            }
        default:
            {
                $("#filStatusBlock").css({background: "#333", "border-radius": "1px", border: "none", margin: 0});
            }
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
var PROJECT = "dna2bpm/application/modules";
$(window).ready(function() {
    var getProject = getURLGetVariable("project");
    if (getProject) {
        PROJECT = getProject;
    }
    document.title = PROJECT;
    registerCloseEvent();
});




