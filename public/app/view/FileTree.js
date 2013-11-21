Ext.define('Codespace.view.FileTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.filetree',
    store: 'FileTree',
//    queryMode: 'local',
    animate: false,
    rootVisible: false,
    useArrows: true,
    listeners: {
        itemdblclick: function(me, record, item, index, e, eOpts) {
            n = me.getSelectionModel().getSelection()[0];
            extension_map = {
                js: 'javascript',
                php: 'php',
                css: 'css',
                less: 'less',
                json: 'json',
                html: 'html',
                xml: 'xml',
                json:'json',
                        svg: 'svg',
                py: 'python',
                pl: 'perl'
            };
            //---only do something if its leaf
            if (n && n.isLeaf()) {
                tabs = Ext.getCmp('filetabs');
                tabs.add(
                        {
                            xtype: 'AceEditor.WithToolbar',
                            id: record.data.id,
                            closable: true,
                            title: record.data.text,
                            path: record.raw.path,
                            theme: 'twilight',
                            parser: 'javascript',
                            showInvisible: false,
                            printMargin: false,
                            listeners: {
                                editorcreated: function() {
                                    console.log("Getting data for:" + this.path);
                                    console.log("Using NowJS -- this clientId: " + now.core.clientId);
                                    now.s_sendUserEvent("join"); // let everyone know who I am!
                                    setInterval(ifOnlineLetCollaboratorsKnowImHere, TIME_UNTIL_GONE / 3);
                                    var specifiedFileToOpen = this.path;
                                    if (specifiedFileToOpen) {
                                        openFileFromServer(specifiedFileToOpen, true);
                                    } else {
                                        // error openFileFromServer("app.js", true);
                                    }
                                }
                            }
                        }
                ).show();
            }
        }
    }
});