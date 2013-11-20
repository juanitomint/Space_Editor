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
            //---only do something if its leaf
            if (n && n.isLeaf()) {
                tabs = Ext.getCmp('filetabs');

                tabs.add({
                    title: record.data.text,
                    closable: true,
                    html: '<?php session_start(); ?>'
                }).show();
                //editor = ace.edit(record.data.id + "Code");
            }
        }
    }
});