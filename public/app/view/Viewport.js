var resizeTabs= function() {
                    tabs = Ext.getCmp('filetabs');
                    tabs.items.each(function(tab) {
                        if (tab.getEditor()) {
                            tab.getEditor().resize();
                        }
                    });

                }
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
                xtype: 'maintoolbar'

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
                    resize: resizeTabs,
                    collapse: resizeTabs,
                    expand: resizeTabs
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
                    resize: resizeTabs,
                    collapse: resizeTabs,
                    expand: resizeTabs
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
                    {
                        region: 'south',
                        items: [
                            //------Toolbar items
                            Ext.create('Ext.toolbar.Toolbar', {
                                renderTo: document.body,
                                items: [
                                    {
                                        // xtype: 'button', // default for Toolbars
                                        text: 'commit'
                                    },
                                    {
                                        xtype: 'splitbutton',
                                        text: 'git',
                                        menu: new Ext.menu.Menu({
                                            items: [
                                                // these will render as dropdown menu items when the arrow is clicked:
                                                {text: 'Commit', handler: function() {
                                                        alert("Item 1 clicked");
                                                    }},
                                                {text: 'revert', handler: function() {
                                                        alert("Item 2 clicked");
                                                    }}
                                            ]})
                                    },
                                    // begin using the right-justified button container
                                    '->', // same as { xtype: 'tbfill' }
                                    {
                                        xtype: 'textfield',
                                        name: 'field1',
                                        emptyText: 'enter search term'
                                    },
                                    // add a vertical separator bar between toolbar items
                                    '-', // same as {xtype: 'tbseparator'} to create Ext.toolbar.Separator
                                    'text 1', // same as {xtype: 'tbtext', text: 'text1'} to create Ext.toolbar.TextItem
                                    {xtype: 'tbspacer'}, // same as ' ' to create Ext.toolbar.Spacer
                                    'text 2',
                                    {xtype: 'tbspacer', width: 50}, // add a 50px space
                                    'text 3'
                                ]
                            })
                                    //------Toolbar items
                        ]

                    }
                ]
                        //----end items
            }];
        this.callParent();
    }
});