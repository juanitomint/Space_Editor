Ext.define('Codespace.store.ProjectTree', {
    extend: 'Ext.data.TreeStore',
    autoLoad: true,
    model: 'Codespace.model.file',
    proxy: {
        type: 'ajax',
        method: 'GET',
        noCache: false, //---get rid of the ?dc=.... in urls
        url: '/getProjectsTree',
        reader: {
            type: 'json'
        }
    },
    sorters: [{
            property: 'leaf',
            direction: 'ASC'
        }, {
            property: 'name',
            direction: 'ASC'
        }],
    listeners: {
        load: function() {
        //    this.expandAll();
        },
        init: function() {
            // this.store.load()
        }
    }
});
