Ext.define('Codespace.view.ToolBar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'toolbar',
    alias: 'widget.maintoolbar',
    items: [
        '<span class="codespace">CodeSpace</span>',
        {
            text: 'File',
            xtype: 'splitbutton',
            menu: new Ext.menu.Menu({
                items: [
                    {text: 'New'},
                    {text: 'Save'},
                    {text: 'Close'}
                ]
            })
        },
        {
            text: 'Edit',
            xtype: 'splitbutton',
            menu: new Ext.menu.Menu({
                items: [
                    {text: 'Undo'},
                    {text: 'Redo'},
                    {text: 'Select All'}
                ]
            })
        },
        {
            text: 'Git',
            xtype: 'splitbutton',
            menu: new Ext.menu.Menu({
                items: [
                    {text: 'Commit'},
                    {text: 'Checkout'},
                    {text: 'Pull'},
                    {text: 'Push'}
                ]
            })
        },
        '->',
        {
            xtype: 'toolbar',
            id: 'EditorToolbar',
            disabled: true,
            items: [
                //-----Editor Theme----
                'Editor Theme',
                {
                    xtype: 'combo',
                    mode: 'local',
                    id: 'ThemeeCombo',
                    triggerAction: 'all',
                    editable: false,
                    name: 'Theme',
                    displayField: 'name',
                    valueField: 'value',
                    queryMode: 'local',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name',
                            'value'],
                        data: [{
                                value: 'ambiance',
                                name: 'Ambiance'
                            },
                            {
                                value: 'chrome',
                                name: 'Chrome'
                            },
                            {
                                value: 'clouds',
                                name: 'Clouds'
                            },
                            {
                                value: 'clouds_midnight',
                                name: 'Clouds Midnight'
                            },
                            {
                                value: 'cobalt',
                                name: 'Cobalt'
                            },
                            {
                                value: 'crimson_editor',
                                name: 'Crimson Editor'
                            },
                            {
                                value: 'dawn',
                                name: 'Dawn'
                            },
                            {
                                value: 'dreamweaver',
                                name: 'Dreamweaver'
                            },
                            {
                                value: 'eclipse',
                                name: 'Eclipse'
                            },
                            {
                                value: 'idle_fingers',
                                name: 'idleFingers'
                            },
                            {
                                value: 'kr_theme',
                                name: 'krTheme'
                            },
                            {
                                value: 'merbivore',
                                name: 'Merbivore'
                            },
                            {
                                value: 'merbivore_soft',
                                name: 'Merbivore Soft'
                            },
                            {
                                value: 'mono_industrial',
                                name: 'Mono Industrial'
                            },
                            {
                                value: 'monokai',
                                name: 'Monokai'
                            },
                            {
                                value: 'pastel_on_dark',
                                name: 'Pastel on dark'
                            },
                            {
                                value: 'solarized_dark',
                                name: 'Solarized Dark'
                            },
                            {
                                value: 'solarized_light',
                                name: 'Solarized Light'
                            },
                            {
                                value: 'textmate',
                                name: 'TextMate'
                            },
                            {
                                value: 'twilight',
                                name: 'Twilight'
                            },
                            {
                                value: 'tomorrow',
                                name: 'Tomorrow'
                            },
                            {
                                value: 'tomorrow_night',
                                name: 'Tomorrow Night'
                            },
                            {
                                value: 'tomorrow_night_blue',
                                name: 'Tomorrow Night Blue'
                            },
                            {
                                value: 'tomorrow_night_bright',
                                name: 'Tomorrow Night Bright'
                            },
                            {
                                value: 'tomorrow_night_eighties',
                                name: 'Tomorrow Night 80s'
                            },
                            {
                                value: 'vibrant_ink',
                                name: 'Vibrant Ink'
                            }]
                    }),
                    listeners: {
                        change: function(field, value)
                        {
                            me=Ext.getCmp('filetabs').getActiveTab();
                            me.theme = value;
                            me.setTheme(me.theme);
                        }
                    }
                },
                //-----END Editor Theme----
                {
                    text: 'Show Invisibles',
                    id: 'ShowInvisibles',
                    handler: function()
                    {
                        me=Ext.getCmp('filetabs').getActiveTab();
                        me.showInvisible = (me.showInvisible) ? false : true;
                        me.editor.setShowInvisibles(me.showInvisible);
                    },
                    
                },
                {
                    text: 'Wrap Lines',
                    id: 'WrapLines',
                    handler: function()
                    {
                        me=Ext.getCmp('filetabs').getActiveTab();
                        me.useWrapMode = (me.useWrapMode) ? false : true;
                        me.editor.getSession().setUseWrapMode(me.useWrapMode);
                    },
                   
                    
                },
                {
                    text: 'Code Folding',
                    id: 'CodeFolding',
                    handler: function()
                    {
                        me=Ext.getCmp('filetabs').getActiveTab();
                        me.codeFolding = (me.codeFolding) ? false : true;
                        me.editor.setShowFoldWidgets(me.codeFolding);
                    },
                   
                    
                },
                {
                    text: 'Highlight Active Line',
                    id: 'HighlightActiveLine',
                    handler: function()
                    {
                        me=Ext.getCmp('filetabs').getActiveTab();
                        me.highlightActiveLine = (me.highlightActiveLine) ? false : true;
                        me.editor.setHighlightActiveLine(me.highlightActiveLine);
                    },
                   
                    
                },
            ]
        },
        //----END Editor Toolbar
    ]
});