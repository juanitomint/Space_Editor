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
    initComponent: function() {
        Ext.apply(this, {
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
        }); //---End apply
        this.callParent();
    }, //----end initComponent
    listeners: {
        itemdblclick: function(me, record, item, index, e, eOpts) {
            //---if tab exists make it the active one
            if(Ext.getCmp(record.data.id + '-tab')){
                 Ext.getCmp('filetabs').setActiveTab(Ext.getCmp(record.data.id + '-tab'));
                return;
            }
            node = me.getSelectionModel().getSelection()[0];
            Codespace.app.createCodeTab(node);
            
            
        }
    }
});