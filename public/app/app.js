Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
    expires: new Date(new Date().getTime()+(1000*60*60*24*7)), //7 days from now
}));
Ext.application({
    name: 'Codespace',
    
    autoCreateViewport: true,
    
    models: ['file'],    
    stores: ['FileTree'],
    //,controllers: ['Station', 'Song']
    launch:function(){
        //load files
        //Ext.getCmp('FileTree').store.load();
    },
    setToolbarSettings: function(me){
      
     Ext.getCmp('Code Folding').setChecked(me.codeFolding);
     (me.highlightActiveLine);
     (me.useWrapMode);
     (me.showInvisible)
    }
    
});