Ext.define('Codespace.store.TeamTree', {
    extend: 'Ext.data.TreeStore',
    autoLoad: true,
    model: 'Codespace.model.team',
    proxy: {
        type: 'memory',
        data: {
            success: true,
            children: [{
                    name: 'juanignacio@gmail.com',
                    leaf: false, // this is a branch   
                    iconCls: 'icon-user',
                    expanded: false,
                    children: [{
                            name: 'git/controllers/git.php',
                            leaf: true // this is a leaf node. It can't have children. Sad! :-(   
                        }, {
                            name: 'bpm/controllers/bpm.php',
                            leaf: true
                        }, {
                            name: 'index.php',
                            leaf: true
                        }]
                }]
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
        init: function () {
            // this.store.load()
        }
    }
});
