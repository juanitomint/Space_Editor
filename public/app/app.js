Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
    expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)), //7 days from now
}));
Ext.application({
    name: 'Codespace',
    autoCreateViewport: true,
    models: ['file'],
    stores: ['FileTree'],
    //,controllers: ['Station', 'Song']
    launch: function() {
        //load files
        
    },
    setToolbarSettings: function(me) {
        if (me) {
            Ext.getCmp('EditorToolbar').setDisabled(false);
            Ext.getCmp('CodeFolding').setValue(me.codeFolding);
            Ext.getCmp('WrapLines').setValue(me.useWrapMode);
            Ext.getCmp('HighlightActiveLine').setValue(me.highlightActiveLine);
            Ext.getCmp('ShowInvisibles').setValue(me.showInvisible);
            Ext.getCmp('FontSize').setValue(me.fontSize);
            Ext.getCmp('EditorTheme').setValue(me.theme);
        } else {
            Ext.getCmp('EditorToolbar').setDisabled(true);
        }

    },
    resizeTabs: function() {
        tabs = Ext.getCmp('filetabs');
        tabs.items.each(function(tab) {
            if (tab.getEditor()) {
                tab.getEditor().resize();
            }
        });

    }

});