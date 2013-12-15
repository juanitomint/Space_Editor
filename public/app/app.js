Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
    expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)), //7 days from now
}));
//---ext actions
function clearCls(node) {
    node.eachChild(function(n) {
        n.set('cls', '');
        if (n.childNodes.length) {
            clearCls(n);
        }
    });
}
var GitStatus = Ext.create('Ext.Action', {
    iconCls: 'fa fa-refresh',
    text: 'Status',
    handler: function(widget, event) {
        tree = Ext.getCmp('FileTree');
        now.s_git_status(function(errs, status) {
            console.log("Git status recived");
            if (errs) {
                console.log(errs);
                Ext.MessageBox.show({
                    title: 'Error!',
                    msg: 'Error commiting:<br/>' + errs[0] + '<br/>',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            } else {
                clearCls(tree.getRootNode());
                var data = status.files;
                for (var file in data) {
                    if (data.hasOwnProperty(file)) {
                        //---remove trailing /
                        id = '/' + file.replace(/\/$/, '')
                        id = id.replace(/[-[\]{}()*+?.,\/\\^$|#\s]/g, "_");
                        node = tree.store.getById(id);
                        if (node) {
                            cls = (data[file].tracked) ? 'git-status-modified' : 'git-status-untracked';
                            node.data = Ext.Object.merge(node.data, data[file]);
                            node.set('cls', cls);
                        }
                    }
                }
            }
        });

    }
});
var GitCommit = Ext.create('Ext.Action', {
    iconCls: 'fa fa-check',
    text: 'Commit',
    handler: function(widget, event) {
        tree = Ext.getCmp('FileTree');
        var n = tree.getSelectionModel().getSelection()[0];

        Ext.MessageBox.prompt('Git Commit', 'Provide a Folder name:', function(btn, text) {
            if (btn == 'ok' && text) {
                var paths = [];
                sel = tree.selModel.getSelection();
                sel.forEach(function(node) {
                    paths.push(node.data.path);
                });

                now.s_git_commit(text, paths, function(fname, errs) {
                    console.log("Created file.. any errors?");
                    if (errs) {
                        console.log(errs);
                        Ext.MessageBox.show({
                            title: 'Error!',
                            msg: 'Error commiting:<br/>' + errs[0] + '<br/>',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    } else {
                        //---commit ok
                    }
                });
            }
        }
        );
    }
});
var CreateFolder = Ext.create('Ext.Action', {
    iconCls: 'fa fa-folder',
    text: 'Add Folder',
    handler: function(widget, event) {
        tree = Ext.getCmp('FileTree');
        var n = tree.getSelectionModel().getSelection()[0];
        if (!n.isLeaf()) {
            Ext.MessageBox.prompt('New Folder', 'Provide a Folder name:', function(btn, text) {
                if (btn == 'ok' && text) {
                    path = n.data.path + '/' + text
                    now.s_createNewFolder(path, function(fname, errs) {
                        console.log("Created file.. any errors?");
                        if (errs) {
                            console.log(errs);
                            Ext.MessageBox.show({
                                title: 'Error!',
                                msg: 'Error creating folder: ' + fname + '<br/>' + errs[0] + '<br/>',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        } else {
                            fname_stripped = path.replace(/[-[\]{}()*+?.,\/\\^$|#\s]/g, "_");
                            node = {
                                id: fname_stripped,
                                name: text + ' <span class="text-new">[new]</span>',
                                leaf: false,
                                path: path,
                                loaded: true
                            };
                            n.appendChild(node);
                            n.set('leaf', false);
                        }
                    });
                }
            }
            );
        } else {
            //---show message
            Ext.MessageBox.alert('Error!', "'Can't add a Folder here");
        }
    }
});
var DeleteFolder = Ext.create('Ext.Action', {
    iconCls: 'fa fa-ban',
    text: 'Delete Folder',
    handler: function(widget, event) {
        tree = Ext.getCmp('FileTree');
        var n = tree.getSelectionModel().getSelection()[0];
        if (!n.isLeaf()) {
            Ext.MessageBox.confirm('Delete Folder', 'Are you sure to delete:<br>' + n.data.path, function(btn, text) {
                if (btn == 'yes') {
                    path = n.data.path;
                    now.s_deleteFolder(path, function(fname, errs) {
                        console.log("Created file.. any errors?");
                        if (errs.length) {
                            console.log(errs);
                            Ext.Msg.alert('Status', 'Error Deleting: ' + fname + '<br/>' + errs[0] + '<br/>');
                        } else {
                            n.remove();
                        }


                    });
                }
            }
            );
        } else {
            //---show message
            Ext.MessageBox.alert('Error!', "'Can't add a Folder here");
        }
    }
});
var DeleteFile = Ext.create('Ext.Action', {
    iconCls: 'fa fa-ban',
    text: 'Delete File',
    handler: function(widget, event) {
        tree = Ext.getCmp('FileTree');
        var n = tree.getSelectionModel().getSelection()[0];
        if (n.isLeaf()) {
            Ext.MessageBox.confirm('Delete File', 'Are you sure to delete:<br>' + n.data.path, function(btn, text) {
                if (btn == 'yes') {
                    path = n.data.path;
                    now.s_deleteFile(path, function(fname, errs) {
                        console.log("Created file.. any errors?");
                        if (errs.length) {
                            console.log(errs);
                            Ext.Msg.alert('Status', 'Error Deleting: ' + fname + '<br/>' + errs[0] + '<br/>');
                        } else {
                            n.remove();
                        }


                    });
                }
            }
            );
        } else {
            //---show message
            Ext.MessageBox.alert('Error!', "'Can't delete File here");
        }
    }
});
var CreateFile = Ext.create('Ext.Action', {
    iconCls: 'fa fa-file',
    text: 'New File',
    handler: function(widget, event) {
        tree = Ext.getCmp('FileTree');
        var n = tree.getSelectionModel().getSelection()[0];
        if (!n.isLeaf()) {
            Ext.MessageBox.prompt('New File', 'Provide a File name:', function(btn, text) {
                if (btn == 'ok' && text) {
                    path = n.data.path + '/' + text
                    now.s_createNewFile(path, function(fname, errs) {
                        console.log("Created file.. any errors?");
                        if (errs) {
                            console.log(errs);
                            Ext.MessageBox.show({
                                title: 'Error!',
                                msg: 'Error creating file: ' + fname + '<br/>' + errs[0] + '<br/>',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        } else {
                            fname_stripped = path.replace(/[-[\]{}()*+?.,\/\\^$|#\s]/g, "_");
                            node = {
                                id: fname_stripped,
                                name: text + ' <span class="text-new">[new]</span>',
                                leaf: true,
                                path: path,
                                loaded: true
                            };
                            n.appendChild(node);
                        }
                    });
                }
            }
            );
        } else {
            //---show message
            Ext.MessageBox.alert('Error!', "'Can't add a Folder here");
        }
    }
});
var DeleteNode = Ext.create('Ext.Action', {
    iconCls: 'fa fa-ban',
    text: 'Delete File',
    handler: function(widget, event) {
        tree = Ext.getCmp('FileTree');
        var n = tree.getSelectionModel().getSelection()[0];
        if (n.isLeaf()) {
            Ext.MessageBox.confirm('Delete File', 'Are you sure to delete:<br>' + n.data.path, function(btn, text) {
                if (btn == 'yes') {
                    path = n.data.path;
                    now.s_deleteFile(path, function(fname, errs) {
                        console.log("Created file.. any errors?");
                        if (errs.length) {
                            console.log(errs);
                            Ext.Msg.alert('Status', 'Error Deleting: ' + fname + '<br/>' + errs[0] + '<br/>');
                        } else {
                            n.remove();
                        }


                    });
                }
            }
            );
        } else {
            Ext.MessageBox.confirm('Delete Folder', 'Are you sure to delete:<br>' + n.data.path, function(btn, text) {
                if (btn == 'yes') {
                    path = n.data.path;
                    now.s_deleteFolder(path, function(fname, errs) {
                        console.log("Created file.. any errors?");
                        if (errs.length) {
                            console.log(errs);
                            Ext.Msg.alert('Status', 'Error Deleting: ' + fname + '<br/>' + errs[0] + '<br/>');
                        } else {
                            n.remove();
                        }


                    });
                }
            }
            );
        }
    }
});
////////////////////////////////////////////////////////////////////////////////
///////////////////////////////BEGIN APP////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
Ext.application({
    name: 'Codespace',
    autoCreateViewport: true,
    models: ['file'],
    stores: ['FileTree'],
    //,controllers: ['Station', 'Song']
    launch: function() {
        Ext.getCmp('utiltabs').setActiveTab(1);
        Ext.getCmp('utiltabs').setActiveTab(0);
        //register into the project and join the group.
        now.s_setTeamID(PROJECT);
        now.s_sendUserEvent("join"); // let everyone know who I am!
        setInterval(ifOnlineLetCollaboratorsKnowImHere, TIME_UNTIL_GONE / 3);

    },
    setToolbarSettings: function(me) {
        if (me) {
            Ext.getCmp('EditorToolbar').setDisabled(false);
            Ext.getCmp('CodeFolding').setValue(me.codeFolding);
            Ext.getCmp('WrapLines').setValue(me.useWrapMode);
            Ext.getCmp('HighlightActiveLine').setValue(me.highlightActiveLine);
            Ext.getCmp('ShowInvisibles').setValue(me.showInvisible);
            Ext.getCmp('FontSize').setValue(me.fontSize);
            Ext.getCmp('EditorTheme').setValue(me.theme);
        } else {
            Ext.getCmp('EditorToolbar').setDisabled(true);
        }

    },
    resizeTabs: function() {
        tabs = Ext.getCmp('filetabs');
        tabs.items.each(function(tab) {
            if (tab.getEditor()) {
                tab.getEditor().resize();
            }
        });

    },
    updateHash: function() {
        fhash = [];
        Ext.getCmp('filetabs').items.each(function(tab) {
            fhash.push(tab.path);
        });
        window.location.hash = 'fname=' + fhash.join(',');
    },
    createCodeTab: function(node) {

        extension_map = {
            js: 'javascript',
            php: 'php',
            css: 'css',
            less: 'less',
            html: 'html',
            htm: 'html',
            xml: 'xml',
            json: 'jscript',
            svg: 'svg',
            py: 'python',
            pl: 'perl'
        };
        //---only do something if its leaf
        if (node && node.isLeaf()) {

            tabs = Ext.getCmp('filetabs');
            f = node.data.path.split('.');
            exten = f[f.length - 1];
            parser = (extension_map[exten]) ? extension_map[exten] : 'textile';
            tab = Ext.create('widget.AceEditor.WithToolbar',
                    {
                        xtype: 'AceEditor.WithToolbar',
                        id: node.data.id + '-tab',
                        closable: true,
                        title: node.data.name,
                        path: node.data.path,
                        theme: 'chrome',
                        parser: parser,
                        fontSize: '15px',
                        highlightActiveLine: true,
                        codeFolding: true,
                        useWrapMode: false,
                        showInvisible: false,
                        printMargin: false,
                        listeners: {
                            activate: function() {
                                if (this.getEditor()) {
                                    Codespace.app.setToolbarSettings(this);
                                    this.getEditor().resize();
                                    setFileStatusIndicator(this.path, this.status);


                                }
                            },
                            editorcreated: function() {
                                console.log("editor Created!");
                                console.log("Getting data for:" + this.path);
                                console.log("Using NowJS -- this clientId: " + now.core.clientId);
                                now.s_sendUserEvent("join"); // let everyone know who I am!
                                editor = this.getEditor();
                                //---bind change Event
                                editor.getSession().on('change', function(a, b, c) {
                                    fname = Ext.getCmp('filetabs').getActiveTab().path;
                                    if (!ignoreAceChange) {
                                        if (textChangeTimeout !== null) {
                                            clearTimeout(textChangeTimeout);
                                            textChangeTimeout = null;
                                        } else {
                                            setFileStatusIndicator(fname, "changed");
                                        }
                                        timeOfLastLocalKepress = (new Date()).getTime();
                                        textChangeTimeout = setTimeout(function() {
                                            if (!nowIsOnline) {
                                                return;
                                            }

                                            sendTextChange(fname);
                                        }, 350);
                                    }
                                });
                                //---bind
                                editor.getSession().selection.on('changeCursor', function(a) {
                                    var range = editor.getSelectionRange();
                                    if (cursorChangeTimeout !== null) {
                                        clearTimeout(cursorChangeTimeout);
                                        cursorChangeTimeout = null;
                                    }
                                    cursorChangeTimeout = setTimeout(ifOnlineLetCollaboratorsKnowImHere, 350);
                                });
                                setInterval(ifOnlineLetCollaboratorsKnowImHere, TIME_UNTIL_GONE / 3);
                                var specifiedFileToOpen = this.path;
                                if (specifiedFileToOpen) {
                                    openFileFromServer(specifiedFileToOpen, true, this.getEditor());
                                    Ext.getCmp('filetabs').setActiveTab(this);
                                    Codespace.app.setToolbarSettings(this);
                                } else {
                                    // error openFileFromServer("app.js", true);
                                }
                            },
                            destroy: function() {
                                ///----unsuscribe
                                Codespace.app.setToolbarSettings(Ext.getCmp('filetabs').getActiveTab());
                                now.s_leaveFile(this.path);
                                Codespace.app.updateHash();
                            }
                        }
                    }
            );///-----end create tab
            tabs.add(tab);
            tabs.setActiveTab(tab);
            Codespace.app.updateHash();

        }
    }

});