Ext.application({
    name: 'Codespace',
    
    autoCreateViewport: true,
    
//    models: ['Station', 'Song'],    
    stores: ['FileTree', 'RecentSongs', 'SearchResults'],
    //,controllers: ['Station', 'Song']
    launch:function(){
        //load files
        Ext.getCmp('FileTree').store.load();
    }
});