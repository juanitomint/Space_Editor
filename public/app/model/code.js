Ext.define('Codespace.model.code', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name', 'line','vline','leaf','text','type'],
});