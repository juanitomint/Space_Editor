Ext.define('Codespace.store.FileTree', {
    extend: 'Ext.data.TreeStore',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        method: 'GET',
        noCache: false, //---get rid of the ?dc=.... in urls
        url: 'data/sample-tree.json',
        reader: {
            type: 'json'
        }
    },
    sorters: [{
            property: 'leaf',
            direction: 'ASC'
        }, {
            property: 'text',
            direction: 'ASC'
        }],
    listeners: {
        init: function() {
            // this.store.load()
        }
    }
});
