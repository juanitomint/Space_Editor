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
        load: function() {
            now.s_updateTree();
            GitStatus.execute();
            if (location.hash) {
                queryString = Ext.Object.fromQueryString(window.location.hash);
                files = queryString['#fname'].split(',');
                now.s_setTeamID(PROJECT);
                for (i in files) {
                    console.log('Open from#:'+files[i]);
                    fname_stripped = files[i].replace(/[-[\]{}()*+?.,\/\\^$|#\s]/g, "_");
                    node = this.getNodeById(fname_stripped);
                    Codespace.app.createCodeTab(node);
                }
            }
        },
        init: function() {
            // this.store.load()
        }
    }
});
