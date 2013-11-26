Ext.define('Codespace.view.Viewport', {
    extend: 'Ext.container.Viewport',
    title: 'Border Layout',
    layout: 'border',
    requires: [
        //'app.view.WithToolbar',
        'Codespace.view.FileTree',
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
            {
                title: 'East Region is resizable',
                region: 'east', // position for region
                xtype: 'panel',
                width: 300,
                split: true, // enable resizing
                collapsible: true, // make collapsible
                collapsed: true,
                html: 'EAST',
                listeners: {
                    resize: Codespace.app.resizeTabs,
                    collapse: Codespace.app.resizeTabs,
                    expand: Codespace.app.resizeTabs
                },
                bbar: [
                    {
                        xtype: 'textfield',
                        name: 'say',
                        emptyText: 'type your message here'
                    }
                ]
            }, {
                // xtype: 'panel' implied by default
                region: 'west',
                xtype: 'panel',
                layout: 'border',
                split: true, // enable resizing
                width: 300,
                collapsible: true, // make collapsible
                id: 'west-region-container',
                title: PROJECT,
                listeners: {
                    resize: Codespace.app.resizeTabs,
                    collapse: Codespace.app.resizeTabs,
                    expand: Codespace.app.resizeTabs
                },
                items: [
                    //----left-side
                    {
                        region: 'center',
                        xtype: 'filetree',
                        border: 0,
                        id: 'FileTree',
                        viewConfig: {
                            stateful: true,
                            stateId: 'FileTree'
                        }
                    },
                    {
                        title: 'Projects',
                        region: 'south',
                        collapsible: true,
                        collapsed: true,
                        height: '35%',
                        html: "PROJECTS"

                    }
                    //----left-side
                ]
            }, {
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