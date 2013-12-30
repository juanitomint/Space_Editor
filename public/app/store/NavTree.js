Ext.define('Codespace.store.NavTree', {
    extend: 'Ext.data.TreeStore',
    model: 'Codespace.model.code',
    root: {
        text: 'Code',
        expanded: true,
        line: '',
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
        beforeload: function() {
            //Ext.getCmp('NavTree').setLoading(true);
        },
        init: function() {

        }
    }
});
