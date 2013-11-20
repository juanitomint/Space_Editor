Ext.application({
    name: 'Codespace',
    
    autoCreateViewport: true,
    
//    models: ['Station', 'Song'],    
    stores: ['FileTree'],
    //,controllers: ['Station', 'Song']
    launch:function(){
        //load files
        //Ext.getCmp('FileTree').store.load();
    }
});