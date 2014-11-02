Ext.define('Codespace.view.TeamTree', {
    extend: 'Ext.tree.Panel',
    //xtype: 'tree-grid',
    alias: 'widget.teamtree',
    store: 'TeamTree',
    animate: false,
    rootVisible: false,
    useArrows: true,
    margin: 0,
    contextTeamMenu: Ext.create('Ext.menu.Menu', {
        title: 'Team Menu',
        scope: this,
        items: [
            {
                iconCls: 'fa fa-plus-square',
                text: 'Follow User',
                handler: function () {

                }
            }
        ]
    }),
    columns: [
        {
            text: '',
            flex: 1,
            sortable: true,
            dataIndex: 'color'
        },
        {
            xtype: 'treecolumn', //this is so we know which column will show the tree
            text: 'Users',
            sortable: true,
            dataIndex: 'name',
            flex: 3
        }, {
            text: 'status'
        }
    ]
    ,
    initComponent: function () {
//        Ext.apply(this, {
//            stateful: true,
//            stateId: this.id + '-state',
//            stateEvents: ['itemcollapse', 'itemexpand']
//
//
//        });
        this.callParent();
    }, //----end initComponent

    listeners: {
        keypress: function (e, t, eOpts) {
//            console.log('keypress');
        },
        itemcontextmenu: function (view, rec, node, index, e) {
            e.stopEvent();
            if (!rec.isLeaf()) {
                this.contextTeamMenu.showAt(e.getXY());
            } else {
                //this.contextUserMenu.showAt(e.getXY());
            }
            return false;
        },
        itemdblclick: function (me, rec, item, index, e, eOpts) {
            if (!rec.isLeaf()) {
                TeamOpen.execute();
                //TeamAdd(rec);
            } else {
                user = Ext.create('Codespace.model.user', rec.raw);
                UserAdd(user);
            }
//            //---if tab exists make it the active one
//            if (Ext.getCmp(record.data.id + '-tab')) {
//                Ext.getCmp('filetabs').setActiveTab(Ext.getCmp(record.data.id + '-tab'));
//                return;
//            }
//            node = me.getSelectionModel().getSelection()[0];
//            Codespace.app.createCodeTab(node);


        }
    }
});