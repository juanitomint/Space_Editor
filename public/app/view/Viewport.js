Ext.define('Codespace.view.Viewport', {
    extend: 'Ext.container.Viewport',
    title: 'Border Layout',
    layout: 'border',
    requires: [
        //'app.view.WithToolbar',
        'Codespace.view.FileTree',
        'Codespace.view.ProjectTree',
        'Codespace.view.FileCode',
        'Codespace.view.ToolBar',
    ],
    initComponent: function() {
        this.items = [
            {
                region: 'north',
                xtype: 'maintoolbar',
                id: 'MainToolbar'

            },
            //----util Panel
            {
                title: '<i class="fa fa-comment"></i> (2)',
                region: 'east', // position for region
                id: 'util-panel',
                xtype: 'panel',
                width: 300,
                split: true, // enable resizing
                collapsible: true, // make collapsible
                collapsed: false,
                layout: 'fit',
                items: [
                    {
                        id: 'utiltabs',
                        xtype: 'tabpanel',
                        items: [
                            //----chat tab
                            {
                                title: 'chat',
                                id: 'chat-tab',
                                autoScroll: true,
                                overflowY: 'scroll',
                                bodyCls: 'discussion',
                                html: '<ol id="chat-ol" class="discussion"></ol>'
                            },
                            {
                                title: 'Team <span id="contacts-count"></span>',
                                id: 'contacts-tab',
                                bodyCls: 'discussion',
                                autoScroll: true,
                                overflowY: 'scroll',
                                html: '<ol id="contact-ol" class="discussion"></ol>'
                            }
                            //----chat tab
                        ]
                    }

                ],
                listeners: {
                    resize: Codespace.app.resizeTabs,
                    collapse: Codespace.app.resizeTabs,
                    expand: Codespace.app.resizeTabs
                },
                bbar: [
                    {
                        id: 'chat-input',
                        xtype: 'textareafield',
                        name: 'message',
                        height: 40,
                        enableKeyEvents: true,
                        width: '100%',
                        listeners: {
                            keypress: function(field, e) {
                                if (e.getKey() == e.ENTER) {
                                    now.s_teamMessageBroadcast("personal", this.value);
                                    this.setValue();
                                    e.stopEvent();
                                }
                            },
                            specialkey: function(field, e) {
                                // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                                // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                                if (e.getKey() == e.ESC) {
                                    //----collapse chat tab
                                    Ext.getCmp('util-panel').collapse();
                                }
                            }
                        }
                    }
                ]
            },
            //-----FILE & project
            {
                // xtype: 'panel' implied by default
                xtype: 'panel',
                width: 300,
                split: true, // enable resizing
                collapsible: true, // make collapsible
                collapsed: false,
                layout: 'fit',
                region: 'west',
                listeners: {
                    resize: Codespace.app.resizeTabs,
                    collapse: Codespace.app.resizeTabs,
                    expand: Codespace.app.resizeTabs
                },
                items: [
                    {
                        id: 'LeftTabs',
                        xtype: 'tabpanel',
                        items: [
                          //----tree panel
                            {
                                xtype: 'panel',
                                layout: 'border',
                                id: 'TreeTab',
                                split: true, // enable resizing
                                width: 300,
                                collapsible: true, // make collapsible
                                title: PROJECT,
                                items: [
                                    //----left-side
                                    {
                                        region: 'center',
                                        xtype: 'filetree',
                                        border: 0,
                                        id: 'FileTree',
                                        /*
                                         plugins: [
                                         {
                                         ptype: 'treefilter',
                                         allowParentFolders: true,
                                         collapseOnClear: false,
                                         }
                                         ],*/
                                        viewConfig: {
                                            stateful: true,
                                            stateId: 'FileTree',
                                            plugins: [
                                                {
                                                    ptype: 'treeviewdragdrop',
                                                    containerScroll: true
                                                }
                                            ]
                                        },
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
                                                            var tree = Ext.getCmp('FileTree');
                                                            tree.filter(newVal, 'name');
                                                        }
                                                        , buffer: 250
                                                    }
                                                }]
                                        }
                                        //---end tbar
                                    },
                                    {
                                        title: 'Navigator',
                                        region: 'south',
                                        collapsible: true,
                                        collapsed: true,
                                        height: '35%',
                                        html: "navtree"

                                    }
                                    //----left-side
                                ]},
                                //----project panel
                            {
                                title: 'Projects',
                                id: 'ProjectsTab',
                                items: [
                                    {
                                        xtype: 'projecttree',
                                        border: 0,
                                        id: 'ProjectsTree',
                                    }
                                    //---end project tree
                                ]
                            }
                            //---end Project Tab
                        ]
                    },
                    
                ]
                    //----end tab items
            },
            {
//                title: 'Center Region',
                region: 'center', // center region is required, no width/height specified
                xtype: 'panel',
                layout: 'border',
                listeners: {
                    resize: function() {

                    }
                },
                items: [
                    //----editor
                    {
                        id: 'filetabs',
                        region: 'center', // center region is required, no width/height specified
                        xtype: 'tabpanel',
                        items: []
                    },
                    //----toolbar
                    /*
                     {
                     region: 'south',
                     items: [
                     
                     ]
                     
                     }
                     */
                ]
                        //----end items
            }];
        this.callParent();
    }
});