Ext.define('Codespace.view.Viewport', {
    extend: 'Ext.container.Viewport',
    title: 'Border Layout',
    layout: 'border',
    requires: [
        'Codespace.view.FileTree',
    ],
    initComponent: function() {
        this.items = [
//            {
//                region: 'north',
//                html: '<h1>CodeSpace</h1>'
//
//            },
            {
                title: 'East Region is resizable',
                region: 'east', // position for region
                xtype: 'panel',
                width: 300,
                split: true, // enable resizing
                collapsible: true, // make collapsible
                html: 'EAST',
            }, {
                // xtype: 'panel' implied by default
                region: 'west',
                xtype: 'panel',
                layout: 'border',
                split: true, // enable resizing
                width: 300,
                collapsible: true, // make collapsible
                id: 'west-region-container',
                title: 'FileTree',
                items: [
                    //----left-side
                    {
                        region: 'center',
                        xtype: 'filetree',
                        id: 'FileTree'
                    },
                    {
                        title: 'Projects',
                        region: 'south',
                        collapsible: true,
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
                items: [
                    //----editor
                    {
                        region: 'center', // center region is required, no width/height specified
                        xtype: 'tabpanel',
                        items: [
                            //----file-tabs
                            {
                                title: 'Foo.js',
                                closable: true
                            }, {
                                title: 'Bar.php',
                                tabConfig: {
                                    title: 'Custom Title',
                                    tooltip: 'A button tooltip',
                                    closable: true
                                }
                            }
                            //----file-tabs
                        ]
                    },
                    //----toolbar
                    {
                        region: 'south',
                        items: [
                            //------Toolbar items
                            Ext.create('Ext.toolbar.Toolbar', {
                                renderTo: document.body,
                                width: 500,
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