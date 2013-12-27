Ext.define('Codespace.view.ProjectTree', {
    extend: 'Ext.tree.Panel',
    //xtype: 'tree-grid',
    alias: 'widget.projecttree',
    store: 'ProjectTree',
    multiSelect: true,
//    queryMode: 'local',
    animate: false,
    rootVisible: false,
    useArrows: true,
    margin: 0,
    contextProjectMenu: Ext.create('Ext.menu.Menu', {
        title: 'Project Menu',
        scope: this,
        items: [
            ProjectOpen,
            ProjectAdd,
            {
                iconCls: 'fa fa-plus-square',
                text: 'Add User',
                handler: function() {
                    Ext.getCmp('ProjectsTree').user = null;
                    UserAdd();
                }
            },
            {
                iconCls: 'fa fa-minus-square',
                text: 'Delete',
                handler: function() {
                    var sm = Ext.getCmp('ProjectsTree').getSelectionModel();
                    var rec = sm.getSelection()[0];
                    sm.deselectAll();
                    ProjectDel(rec);
                }
            }
        ]
    }),
    contextUserMenu: Ext.create('Ext.menu.Menu', {
        title: 'User Menu',
        scope: this,
        items: [
            {
                text: 'Edit',
                iconCls: 'fa fa-edit',
                handler: function() {
                    var sm = Ext.getCmp('ProjectsTree').getSelectionModel();
                    var rec = sm.getSelection()[0];
                    user = Ext.create('Codespace.model.user', rec.raw);
                    UserAdd(user);
                }
            },
            UserRemoveBtn,
        ]
    }),
    columns: [
        {
            xtype: 'treecolumn', //this is so we know which column will show the tree
            text: 'Projects',
            sortable: true,
            dataIndex: 'name',
            flex: 1
        }, {
            text: 'status'
        }
    ]
    ,
    bbar: [
        {
            iconCls: 'fa fa-refresh',
            text: 'Reload',
            handler: function() {
                Ext.getCmp('ProjectsTree').store.load();

            }
        }
        , {
            iconCls: 'fa fa-plus-square',
            text: 'Add',
            handler: function() {
                var sm = Ext.getCmp('ProjectsTree').getSelectionModel();
                sm.deselectAll();
                Ext.getCmp('ProjectsTree').rec = null;
                ProjectAdd.execute();
            }
        }
    ],
    initComponent: function() {
//        Ext.apply(this, {
//            stateful: true,
//            stateId: this.id + '-state',
//            stateEvents: ['itemcollapse', 'itemexpand']
//
//
//        });
        this.callParent();
    }, //----end initComponent
    getState: function() {
        var nodes = [], state = this.callParent();

        var getPath = function(node, field, separator) {
            field = field || node.idProperty;
            separator = separator || '/';
            var path = [node.get(field)], parent = node.parentNode;
            while (parent) {
                path.unshift(parent.get(field));
                parent = parent.parentNode;
            }
            return separator + path.join(separator);
        };
        this.getRootNode().eachChild(function(child) {
            // function to store state of tree recursively 
            var storeTreeState = function(node, expandedNodes) {
                if (node.isExpanded() && node.childNodes.length > 0) {
                    expandedNodes.push(getPath(node, 'id'));
                    node.eachChild(function(child) {
                        storeTreeState(child, expandedNodes);
                    });
                }
            };
            storeTreeState(child, nodes);
        });

        Ext.apply(state, {
            expandedNodes: nodes
        });
        return state;

    },
    applyState: function(state) {
        var nodes = state.expandedNodes || [],
                len = nodes.length;

        this.collapseAll();

        for (var i = 0; i < len; i++) {

            if (typeof nodes[i] != 'undefined') {

                this.expandPath(nodes[i], 'id');

            }

        }

        this.callParent(arguments);

    },
    listeners: {
        keypress: function(e, t, eOpts) {
            console.log('keypress');
        },
        itemcontextmenu: function(view, rec, node, index, e) {
            e.stopEvent();
            if (rec.isLeaf()) {
                this.contextUserMenu.showAt(e.getXY());
            } else {
                this.contextProjectMenu.showAt(e.getXY());
            }
            return false;
        },
        itemdblclick: function(me, rec, item, index, e, eOpts) {
            if (!rec.isLeaf()) {
                ProjectOpen.execute();
                //ProjectAdd(rec);
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