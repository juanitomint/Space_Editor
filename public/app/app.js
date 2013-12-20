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
var ProjectDel = function(rec) {
    Ext.MessageBox.confirm('Delete Project', 'Are you sure to delete:<br>' + rec.get('name'), function(btn, text) {
        if (btn == 'yes') {
            now.s_project_delete(rec.data, function(errs) {
                if (errs) {
                    console.log(errs);
                    Ext.Msg.alert('Status', 'Error Deleting: ' + fname + '<br/>' + errs[0] + '<br/>');
                } else {
                    Ext.getCmp('ProjectsTree').store.load(function() {
                    });
                }


            });
        }
    }
    );
}
var ProjectAdd = function(rec) {
    Ext.create('widget.window', {
        title: 'Add new Project',
        closable: true,
        closeAction: 'destroy',
        width: 400,
        minWidth: 250,
        height: 152,
        layout: 'fit',
        bodyPadding: 5,
        rec: rec,
        items: [{
                xtype: 'form',
                id: 'ProjectAddForm',
                layout: {
                    type: 'vbox',
                    align: 'stretch'  // Child items are stretched to full width
                },
                items: [
                    {
                        xtype: 'textfield',
                        labelWidth: 120,
                        labelAlign: 'right',
                        fieldLabel: 'Project Name:',
                        name: 'name',
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        labelWidth: 120,
                        labelAlign: 'right',
                        fieldLabel: 'Project relative path:',
                        name: 'path',
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        labelWidth: 120,
                        labelAlign: 'right',
                        fieldLabel: 'Project url:',
                        name: 'url',
                        allowBlank: false,
                        vtype: 'url'
                    }
                ],
                bbar: [
                    {
                        text: 'Open',
                        iconCls: 'fa fa-folder-open',
                        handler: function() {
                            var sm = Ext.getCmp('ProjectsTree').getSelectionModel();
                            var rec = sm.getSelection()[0];
                            window.location = '?project=' + rec.data['path'];

                        }
                    },
                    '->',
                    {
                        xtype: 'button',
                        iconCls: 'fa fa-save',
                        text: 'save',
                        handler: function() {
                            project = this.up('form').getValues();
                            now.s_project_save(project, function(errs) {
                                if (errs) {
                                    console.log(errs);
                                    Ext.MessageBox.show({
                                        title: 'Error!',
                                        msg: 'Error branch:<br/>' + errs[0] + '<br/>',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.ERROR
                                    });
                                } else {
                                    //----create/save succesfull
                                    Ext.getCmp('ProjectsTree').store.load();
                                }
                            });
                            this.up('window').destroy();
                        }
                    }
                ]
            }],
        listeners: {
            show: function() {
                rec = this.rec;
                form = this.down('form');
                if (rec) {
                    form.loadRecord(rec);
                }
            }
        }
    }).show(); //---end show;
};
var UserRemoveBtn = Ext.create('Ext.Action', {
    text: 'Remove',
    iconCls: 'fa fa-minus-square',
    handler: function() {
        var sm = Ext.getCmp('ProjectsTree').getSelectionModel();
        var user = sm.getSelection()[0];
        var project = user.parentNode;
        Ext.MessageBox.confirm('Delete Project', 'Are you sure to delete:<br>' + rec.get('name'), function(btn, text) {
            if (btn == 'yes') {
                now.s_user_delete(user.raw, project.raw, function(errs) {
                    if (errs) {
                        console.log(errs);
                        Ext.MessageBox.show({
                            title: 'Error!',
                            msg: 'Error Deleting:<br/>' + errs[0] + '<br/>',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    } else {
                        //----remove from treree succesfull
                        user.remove();
                    }
                });
            }
        });
        if (this.up('window'))
            this.up('window').destroy();
    }
});
var UserAddBtn = Ext.create('Ext.Action', {
    iconCls: 'fa fa-save',
    text: 'save',
    handler: function() {
        var sm = Ext.getCmp('ProjectsTree').getSelectionModel();
        var project = sm.getSelection()[0].data;
        user = this.up('form').getValues();
        now.s_user_save(user, project, function(errs) {
            if (errs) {
                console.log(errs);
                Ext.MessageBox.show({
                    title: 'Error!',
                    msg: 'Error adding user:<br/>' + errs[0] + '<br/>',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            } else {
                //----create/save succesfull
                Ext.getCmp('ProjectsTree').store.load();
            }
        });
        if (this.up('window'))
            this.up('window').destroy();
    }
});
var UserAdd = function(rec) {
    Ext.create('widget.window', {
        title: 'Add User',
        closable: true,
        closeAction: 'destroy',
        width: 400,
        minWidth: 250,
        height: 152,
        layout: 'fit',
        bodyPadding: 5,
        rec: rec,
        items: [{
                xtype: 'form',
                id: 'UserAddForm',
                layout: {
                    type: 'vbox',
                    align: 'stretch'  // Child items are stretched to full width
                },
                items: [
                    {
                        xtype: 'textfield',
                        labelWidth: 120,
                        labelAlign: 'right',
                        fieldLabel: 'User Name:',
                        name: 'name',
                        allowBlank: false,
                    },
                    {
                        xtype: 'textfield',
                        labelWidth: 120,
                        labelAlign: 'right',
                        fieldLabel: 'Password:',
                        inputType: 'password',
                        name: 'passw'
                    },
                    {
                        xtype: 'textfield',
                        labelWidth: 120,
                        labelAlign: 'right',
                        fieldLabel: 'email:',
                        name: 'mail',
                        allowBlank: false,
                        vtype: 'email'
                    }
                ],
                bbar: [
                    UserRemoveBtn,
                    '->',
                    UserAddBtn
                ]
            }],
        listeners: {
            show: function() {
                rec = this.rec;
                form = this.down('form');
                if (rec) {
                    form.loadRecord(rec);
                }
            }
        }
    }).show(); //---end show;
};


var GitBranch = function() {
    now.s_git_branch(function(errs, branch) {
        console.log("Git branch recived");
        if (errs) {
            console.log(errs);
//            Ext.MessageBox.show({
//                title: 'Error!',
//                msg: 'Error branch:<br/>' + errs[0] + '<br/>',
//                buttons: Ext.MessageBox.OK,
//                icon: Ext.MessageBox.ERROR
//            });
        } else {
            tree = Ext.getCmp('FileTree');
            //---get the 1st tree node
            Ext.getCmp('TreeTab').setTitle(tree.title = tree.getRootNode().childNodes[0].data.name + ' [' + branch.name + ']');
            tree.branch = branch.name;
        }
    });
};
var GitInit = Ext.create('Ext.Action', {
    text: 'Init',
    iconCls: 'fa fa-check',
    handler: function() {
        now.s_git_init(function(errs) {
            console.log("Git Init");
            if (errs) {
                console.log(errs);
//            Ext.MessageBox.show({
//                title: 'Error!',
//                msg: 'Error branch:<br/>' + errs[0] + '<br/>',
//                buttons: Ext.MessageBox.OK,
//                icon: Ext.MessageBox.ERROR
//            });
            } else {
                GitStatus.execute();
            }
        });
    }
});

var GitStatus = Ext.create('Ext.Action', {
    iconCls: 'fa fa-refresh',
    text: 'Status',
    handler: function(widget, event) {
        tree = Ext.getCmp('FileTree');
        now.s_git_status(function(errs, status) {
            console.log("Git status recived");
            if (errs) {
                console.log(errs);
//                Ext.MessageBox.show({
//                    title: 'Error!',
//                    msg: 'Error commiting:<br/>' + errs[0] + '<br/>',
//                    buttons: Ext.MessageBox.OK,
//                    icon: Ext.MessageBox.ERROR
//                });
            } else {
                tree.status = status;
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
                            cls = (data[file].type == 'UU') ? 'git-status-conflict' : cls;
                            node.data = Ext.Object.merge(node.data, data[file]);
                            node.set('cls', cls);
                        }
                    }
                }
                //----update git branch
                GitBranch();
            }
        });
    }
});
var GitCheckout = Ext.create('Ext.Action', {
    iconCls: 'fa fa-hand-o-left',
    text: 'Checkout',
    handler: function(widget, event) {
        tree = Ext.getCmp('FileTree');
        var n = tree.getSelectionModel().getSelection()[0];
        var paths = [];
        sel = tree.selModel.getSelection();
        sel.forEach(function(node) {
            paths.push(node.data.path.replace(/^\//, ''));
        });
        Ext.MessageBox.confirm('Checkout from Head', 'Are you sure you want back:<br>' + paths.join('<br/>'), function(btn, text) {
            if (btn == 'yes') {
                console.log('About to checkout', paths);
                now.s_git_checkout(paths, function(errs) {
                    console.log("checkout finished.. any errors?");
                    if (errs) {
                        console.log(errs);
                        Ext.MessageBox.show({
                            title: 'Error!',
                            msg: 'Error in checkout:<br/>' + errs[0] + '<br/>',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    } else {
                        console.log("Commit Ok!");
                        GitStatus.execute();
                        tree.getSelectionModel().deselectAll();
                        //---commit ok
                    }
                });
            }
        }
        );
    }
});
var GitCommit = Ext.create('Ext.Action', {
    iconCls: 'fa fa-hand-o-right',
    text: 'Commit',
    handler: function(widget, event) {
        tree = Ext.getCmp('FileTree');
        var n = tree.getSelectionModel().getSelection()[0];
        Ext.MessageBox.prompt(
                {
                    title: 'Git Commit',
                    msg: 'Provide a commit description::',
                    width: 300,
                    buttons: Ext.MessageBox.OKCANCEL,
                    multiline: true,
                    animateTarget: 'GitCommit',
                    fn: function(btn, text) {
                        if (btn == 'ok' && text) {
                            var paths = [];
                            sel = tree.selModel.getSelection();
                            sel.forEach(function(node) {
                                paths.push(node.data.path.replace(/^\//, ''));
                            });
                            console.log('About to commit', paths);
                            now.s_git_commit(text, paths, function(errs) {
                                console.log("Commit finished.. any errors?");
                                if (errs) {
                                    console.log(errs);
                                    Ext.MessageBox.show({
                                        title: 'Error!',
                                        msg: 'Error commiting:<br/>' + errs[0] + '<br/>',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.ERROR
                                    });
                                } else {
                                    console.log("Commit Ok!");
                                    GitStatus.execute();
                                    tree.getSelectionModel().deselectAll();
                                    //---commit ok
                                }
                            });
                        }
                    }
                }
        ); //---end message box
    }
});
var GitAdd = Ext.create('Ext.Action', {
    iconCls: 'fa fa-plus-square',
    text: 'Add Items',
    handler: function(widget, event) {
        tree = Ext.getCmp('FileTree');
        var n = tree.getSelectionModel().getSelection()[0];
        var paths = [];
        sel = tree.selModel.getSelection();
        sel.forEach(function(node) {
            paths.push(node.data.path.replace(/^\//, ''));
        });
        Ext.MessageBox.confirm('Add files to repository', 'You are about to add:<br>' + paths.length + ' Items', function(btn, text) {
            if (btn == 'yes') {
                var paths = [];
                sel = tree.selModel.getSelection();
                sel.forEach(function(node) {
                    paths.push(node.data.path.replace(/^\//, ''));
                });
                console.log('About to commit', paths);
                now.s_git_add(paths, function(errs) {
                    console.log("add finished.. any errors?");
                    if (errs) {
                        console.log(errs);
                        Ext.MessageBox.show({
                            title: 'Error!',
                            msg: 'Error adding:<br/>' + errs[0] + '<br/>',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    } else {
                        console.log("add Ok!");
                        GitStatus.execute();
                        tree.getSelectionModel().deselectAll();
                        //---update branch if posible
                    }
                });
            }
        }
        );
    }
});
var GitRemove = Ext.create('Ext.Action', {
    iconCls: 'fa fa-minus-square',
    text: 'Remove Items',
    handler: function(widget, event) {
        tree = Ext.getCmp('FileTree');
        var n = tree.getSelectionModel().getSelection()[0];
        var paths = [];
        sel = tree.selModel.getSelection();
        sel.forEach(function(node) {
            paths.push(node.data.path.replace(/^\//, ''));
        });
        Ext.MessageBox.confirm('Remove files from repository', 'You are about to remove:<br>' + paths.length + ' items', function(btn, text) {
            if (btn == 'yes') {
                var paths = [];
                sel = tree.selModel.getSelection();
                sel.forEach(function(node) {
                    paths.push(node.data.path.replace(/^\//, ''));
                });
                console.log('About to commit', paths);
                now.s_git_remove(paths, function(errs) {
                    console.log("add finished.. any errors?");
                    if (errs) {
                        console.log(errs);
                        Ext.MessageBox.show({
                            title: 'Error!',
                            msg: 'Error adding:<br/>' + errs[0] + '<br/>',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    } else {
                        console.log("add Ok!");
                        GitStatus.execute();
                        tree.getSelectionModel().deselectAll();
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
                        if (errs) {
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
        if (n) {
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
                Ext.MessageBox.alert('Error!', "Can't delete File here");
            }
        } else {
            //---show message
            Ext.MessageBox.alert('Error!', "Nothing selected!");
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
    stores: ['FileTree', 'ProjectTree'],
    //,controllers: ['Station', 'Song']
    launch: function() {
        //Ext.getCmp('utiltabs').setActiveTab(1);
        //Ext.getCmp('utiltabs').setActiveTab(0);
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
            if (!Ext.getCmp(node.data.id + '-tab')) {
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
                ); ///-----end create tab
                tabs.add(tab);
                tabs.setActiveTab(tab);
                Codespace.app.updateHash();
            }
        }
    }

});