Ext.define('Codespace.model.code', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name', 'line','leaf','text','type'],
});