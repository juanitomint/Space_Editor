Ext.define('Codespace.model.file', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name', 'path', 'filesize','leaf','users'],
});