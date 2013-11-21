Ext.define('Codespace.store.FileTree', {
    extend: 'Ext.data.TreeStore',
    autoLoad: true,
    model: 'Codespace.model.file',
    proxy: {
        type: 'ajax',
        method: 'GET',
        noCache: false, //---get rid of the ?dc=.... in urls
        url: '/getFileTree?project=' + PROJECT,
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
