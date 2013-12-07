Ext.define('Codespace.view.FileTree', {
    extend: 'Ext.tree.Panel',
    xtype: 'tree-grid',
    alias: 'widget.filetree',
    store: 'FileTree',
//    queryMode: 'local',
    animate: false,
    rootVisible: false,
    useArrows: true,
    margin: 0,
    contextMenu: Ext.create('Ext.menu.Menu', {
        title: 'File Menu',
        scope: this,
        items: [
            //----------NEW FOLDER 
            Ext.create('Ext.Action', {
                iconCls: 'fa fa-folder',
                text: 'Add Folder',
                handler: function(widget, event) {
                    tree = Ext.getCmp('FileTree');
                    var n = tree.getSelectionModel().getSelection()[0];
                    if (!n.isLeaf()) {
                        Ext.MessageBox.prompt('New Folder', 'Provide a Folder name:', function(btn, text) {
                            if (btn == 'ok' && text) {
                                path=n.data.path + '/' + text
                                now.s_createNewFolder(path, function(fname, errs) {
                                    console.log("Created file.. any errors?");
                                    if (errs) {
                                        console.log(errs);
                                        Ext.Msg.alert('Status', 'Error creating file: ' + fname + '<br/>' + errs.code+ '<br/>');
                                    } else {
                                        node = {
                                            id: text,
                                            name: text + ' <span class="text-new">[new]</span>',
                                            leaf: false,
                                            path: path,
                                            loaded: true
                                        };
                                        n.appendChild(node);
                                        n.set('leaf', false);
                                        closeFileBrowser();
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
            }),
            'Folder Add',
            'Folder Delete',
            'File Add'
        ]
    }),
    columns: [
        {
            text: 'Users',
            flex: 1,
            sortable: true,
            dataIndex: 'users'
        },
        {
            xtype: 'treecolumn', //this is so we know which column will show the tree
            text: 'Files',
            flex: 3,
            sortable: true,
            dataIndex: 'name'
        },
        {
            //we must use the templateheader component so we can use a custom tpl
            xtype: 'templatecolumn',
            text: 'Size',
            flex: 1,
            sortable: true,
            dataIndex: 'filesize',
            align: 'center',
            //add in the custom tpl for the rows
            tpl: Ext.create('Ext.XTemplate', '{filesize:this.bytesToSize}', {
                bytesToSize: function(bytes) {
                    precision = 2;
                    if (bytes) {
                        bytes = parseInt(bytes);
                        var kilobyte = 1024;
                        var megabyte = kilobyte * 1024;
                        var gigabyte = megabyte * 1024;
                        var terabyte = gigabyte * 1024;
                        if ((bytes >= 0) && (bytes < kilobyte)) {
                            return bytes + ' B';
                        } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
                            return (bytes / kilobyte).toFixed(precision) + ' KB';
                        } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
                            return (bytes / megabyte).toFixed(precision) + ' MB';
                        } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
                            return (bytes / gigabyte).toFixed(precision) + ' GB';
                        } else if (bytes >= terabyte) {
                            return (bytes / terabyte).toFixed(precision) + ' TB';
                        } else {
                            return bytes + ' B';
                        }
                    }
                }
            }
            )
        }
    ]
    ,
    initComponent: function() {
        this.callParent();
    }, //----end initComponent
    listeners: {
        itemcontextmenu: function(view, rec, node, index, e) {
            e.stopEvent();
            this.contextMenu.showAt(e.getXY());
            return false;
        },
        itemdblclick: function(me, record, item, index, e, eOpts) {
            //---if tab exists make it the active one
            if (Ext.getCmp(record.data.id + '-tab')) {
                Ext.getCmp('filetabs').setActiveTab(Ext.getCmp(record.data.id + '-tab'));
                return;
            }
            node = me.getSelectionModel().getSelection()[0];
            Codespace.app.createCodeTab(node);


        }
    }
});