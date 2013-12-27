Ext.define('Codespace.store.FileTree', {
    extend: 'Ext.data.TreeStore',
    model: 'Codespace.model.file',
    root: {
        expanded: true,
        children: []
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
                    console.log('Open from#:' + files[i]);
                    fname_stripped = files[i].replace(/[-[\]{}()*+?.,\/\\^$|#\s]/g, "_");
                    node = this.getNodeById(fname_stripped);
                    Codespace.app.createCodeTab(node);
                }
            }

        },
        init: function() {

        }
    }
});
