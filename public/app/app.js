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
            /*
             //----clear all
             Ext.getCmp('CodeFolding').setValue(false);
             Ext.getCmp('WrapLines').setValue(false);
             Ext.getCmp('HighlightActiveLine').setValue(false);
             Ext.getCmp('ShowInvisibles').setValue(false); 
            
             console.log('-----------------------------------------------');
             console.log('toolbar for file:', me.path);
             console.log('-----------------------------------------------');
             console.log('codeFolding', me.codeFolding);
             console.log('WrapLines', me.useWrapMode);
             console.log('HighlightActiveLine', me.highlightActiveLine);
             console.log('ShowInvisibles', me.showInvisible);
             console.log('FontSize', me.fontSize);
             console.log('EditorTheme', me.theme);
             console.log('Object', me);
             console.log('-----------------------------------------------');
             */

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