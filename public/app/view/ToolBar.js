Ext.define('Codespace.view.ToolBar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'codespace.toolbar',
    alias: 'widget.maintoolbar',
    items: [
        '<span class="codespace"><i class="fa fa-code"></i> CodeSpace</span>',
        {
            text: 'File',
            xtype: 'splitbutton',
            menu: new Ext.menu.Menu({
                items: [
                    CreateFile,
                    {
                        text: 'Save',
                        iconCls: 'fa fa-save',
                        cmdTxt: 'Ctrl+s',
                        handler: function() {
                            me = Ext.getCmp('filetabs').getActiveTab();
                            saveFileToServer(me.path, me.editor.getSession().getValue());
                            GitStatus.execute();
                        }
                    },
                    {
                        text: 'Close',
                        iconCls: 'fa fa-times',
                        handler: function() {
                            Ext.getCmp('filetabs').getActiveTab().close();
                        }
                    },
                    DeleteFile
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
                    GitStatus,
                    GitCommit,
                    GitCheckout,
                    GitAdd,
                    GitRemove,
                    {
                        xtype: 'menuseparator'
                    },
                    GitInit,
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
                    id: 'EditorTheme',
                    xtype: 'combo',
                    mode: 'local',
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
                            me = Ext.getCmp('filetabs').getActiveTab();
                            me.theme = value;
                            me.setTheme(me.theme);
                        }
                    }
                },
                //-----END Editor Theme----
                //-----Checkboxes

                {
                    id: 'ShowInvisibles',
                    checked: false,
                    xtype: 'checkbox',
                    handler: function(widget, newValue, oldValue, eOpts)
                    {

                        me = Ext.getCmp('filetabs').getActiveTab();
                        me.showInvisible = (widget.checked) ? true : false;
                        me.editor.setShowInvisibles(me.showInvisible);
                    },
                },
                'Show Invisibles',
                {
                    text: 'Wrap Lines',
                    id: 'WrapLines',
                    checked: false,
                    xtype: 'checkbox',
                    handler: function(widget, newValue, oldValue, eOpts)
                    {
                        me = Ext.getCmp('filetabs').getActiveTab();
                        me.useWrapMode = (widget.checked) ? true : false;
                        me.editor.getSession().setUseWrapMode(me.useWrapMode);
                    },
                }, 'Wrap Lines',
                {
                    text: 'Code Folding',
                    id: 'CodeFolding',
                    checked: false,
                    xtype: 'checkbox',
                    handler: function(widget, newValue, oldValue, eOpts)
                    {
                        me = Ext.getCmp('filetabs').getActiveTab();
                        me.codeFolding = (widget.checked) ? true : false;
                        me.editor.setShowFoldWidgets(me.codeFolding);
                    },
                }, 'Code Folding',
                {
                    text: 'Highlight Active Line',
                    id: 'HighlightActiveLine',
                    xtype: 'checkbox',
                    checked: false,
                    handler: function(widget, newValue, oldValue, eOpts)
                    {
                        me = Ext.getCmp('filetabs').getActiveTab();
                        me.highlightActiveLine = (widget.checked) ? true : false;
                        me.editor.setHighlightActiveLine(me.highlightActiveLine);
                    },
                    //-----END Checkboxes


                },
                'Active Line',
                'Font Size:',
                {
                    id: 'FontSize',
                    fieldStyle: 'text-align: right',
                    hideLabel: true,
                    xtype: 'numberfield',
                    //value: me.fontSize,
                    minValue: 6,
                    maxValue: 72,
                    flex: 0,
                    plain: true,
                    listeners: {
                        change: function(field, value)
                        {
                            me = Ext.getCmp('filetabs').getActiveTab();
                            me.fontSize = value;
                            me.setFontSize(me.fontSize + "px");
                        }
                    }
                }


            ]
        },
        //-----logout
        {
            text: Ext.util.Cookies.get('_username')+'&nbsp;<i class="fa fa-power-off"></i>',
            handler: function() {
                window.location = '/logout'
            }
        }
        //----END Editor Toolbar
    ]
});