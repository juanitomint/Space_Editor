Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
Ext.application({
    name: 'Codespace',
    
    autoCreateViewport: true,
    
    models: ['file'],    
    stores: ['FileTree'],
    //,controllers: ['Station', 'Song']
    launch:function(){
        //load files
        //Ext.getCmp('FileTree').store.load();
    }
});