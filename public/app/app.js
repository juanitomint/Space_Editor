Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
    expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)), //7 days from now
}));
Ext.application({
    name: 'Codespace',
    autoCreateViewport: true,
    models: ['file'],
    stores: ['FileTree'],
    //,controllers: ['Station', 'Song']
    launch: function() {
        //load files

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
            parser = extension_map[exten]
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
                                    setFileStatusIndicator(this.path,this.status);
                                    

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
                                    fname=Ext.getCmp('filetabs').getActiveTab().path;
                                    if (!ignoreAceChange) {
                                        if (textChangeTimeout !== null) {
                                            clearTimeout(textChangeTimeout);
                                            textChangeTimeout = null;
                                        } else {
                                            setFileStatusIndicator(fname,"changed");
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