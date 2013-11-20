Ext.define('Codespace.store.SearchResults', {
    extend: 'Ext.data.Store',
    requires: 'Codespace.model.Station',
    model: 'Codespace.model.Station',

    autoLoad: true,
    
    // Overriding the model's default proxy
    proxy: {
        type: 'ajax',
        url: 'data/searchresults.json',
        reader: {
            type: 'json',
            root: 'results'
        }
    }
});