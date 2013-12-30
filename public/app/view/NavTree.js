Ext.define('Codespace.view.NavTree', {
    extend: 'Ext.tree.Panel',
    xtype: 'tree-grid',
    alias: 'widget.navtree',
    store: 'NavTree',
//    queryMode: 'local',
    animate: false,
    rootVisible: false,
    useArrows: true,
    margin: 0,
    columns: [
        {
            text: 'Line',
            flex: 1,
            dataIndex: 'vline',
        },
        {
            xtype: 'treecolumn', //this is so we know which column will show the tree
            text: "</>",
            flex: 3,
            sortable: true,
            dataIndex: 'text'

        },
        {
            text: 'type',
            flex: 1,
            dataIndex: 'type',
        }
    ],
    listeners: {
        itemdblclick: function(me, record, item, index, e, eOpts) {
            e.stopEvent();
            if (record.isLeaf())
                editor.scrollToLine(record.data.line);
        }
    },
    plugins: [
        {
            ptype: 'treefilter',
            allowParentFolders: true,
            collapseOnClear: false,
        }
    ],
    ////////////////////////////////////////////////////////////////////////////
    /////////////////////   DOCKERS      ///////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    tbar: {
        layout: 'fit',
        items: [{
                xtype: 'trigger',
                triggerCls: 'x-form-clear-trigger',
                onTriggerClick: function() {
                    this.reset();
                    this.focus();
                }
                , listeners: {
                    change: function(field, newVal) {
                        var tree = Ext.getCmp('NavTree');
                        tree.filter(newVal, 'text');
                    }
                    , buffer: 250
                }
            }]
    },
    //---end tbar
    bbar: [
        {
            iconCls: 'fa fa-refresh',
            text: 'Reload',
            handler: AnalizeCode
        }
    ]
});