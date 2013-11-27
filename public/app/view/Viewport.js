Ext.define('Codespace.view.Viewport', {
    extend: 'Ext.container.Viewport',
    title: 'Border Layout',
    layout: 'border',
    requires: [
        //'app.view.WithToolbar',
        'Codespace.view.FileTree',
        'Codespace.view.FileCode',
        'Codespace.view.ToolBar',
    ],
    initComponent: function() {
        this.items = [
            {
                region: 'north',
                xtype: 'maintoolbar',
                id: 'MainToolbar'

            },
            {
                title:'<i class="fa fa-comment"></i> (2)',
                region: 'east', // position for region
                xtype: 'panel',
                width: 300,
                split: true, // enable resizing
                collapsible: true, // make collapsible
                collapsed: false,
                items: [
                    {
                        id: 'utiltabs',
                        xtype: 'tabpanel',
                        items: [
                            //----chat tab
                            {
                                title: 'chat',
                                id: 'chat-tab',
                                iconCls: 'fa fa-comments',
                                scroll: 'vertical',
                                overflowY:'scroll',
                                html: '<ol class="discussion">\n\
    <li class="other">\n\
      <div class="avatar">\n\
        <img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/5/profile/profile-80_9.jpg" />\n\
      </div>\n\
      <div class="messages">\n\
        <p>yeah, they do early flights cause they connect with big airports.  they wanna get u to your connection</p>\n\
        <time datetime="2009-11-13T20:00">Timothy • 51 min</time>\n\
      </div>\n\
    </li>\n\
    <li class="self">\n\
      <div class="avatar">\n\
        <img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/3/profile/profile-80_20.jpg" />\n\
      </div>\n\
      <div class="messages">\n\
        <p>That makes sense.</p>\n\
        <p>It\'\s a pretty small airport.</p>\n\
        <time datetime="2009-11-13T20:14">37 mins</time>\n\
      </div>\n\
    </li>\n\
    <li class="other">\n\
      <div class="avatar">\n\
        <img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/5/profile/profile-80_9.jpg" />\n\
      </div>\n\
      <div class="messages">\n\
        <p>that mongodb thing looks good, huh?</p>\n\
        <p>\n\
          tiny master db, and huge document store</p>\n\
      </div>\n\
    </li>\n\
    <li class="other">\n\
      <div class="avatar">\n\
        <img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/5/profile/profile-80_9.jpg" />\n\
      </div>\n\
      <div class="messages">\n\
        <p>yeah, they do early flights cause they connect with big airports.  they wanna get u to your connection</p>\n\
        <time datetime="2009-11-13T20:00">Timothy • 51 min</time>\n\
      </div>\n\
    </li>\n\
    <li class="self">\n\
      <div class="avatar">\n\
        <img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/3/profile/profile-80_20.jpg" />\n\
      </div>\n\
      <div class="messages">\n\
        <p>That makes sense.</p>\n\
        <p>It\'\s a pretty small airport.</p>\n\
        <time datetime="2009-11-13T20:14">37 mins</time>\n\
      </div>\n\
    </li>\n\
    <li class="other">\n\
      <div class="avatar">\n\
        <img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/5/profile/profile-80_9.jpg" />\n\
      </div>\n\
      <div class="messages">\n\
        <p>that mongodb thing looks good, huh?</p>\n\
        <p>\n\
          tiny master db, and huge document store</p>\n\
      </div>\n\
    </li>\n\
    <li class="other">\n\
      <div class="avatar">\n\
        <img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/5/profile/profile-80_9.jpg" />\n\
      </div>\n\
      <div class="messages">\n\
        <p>yeah, they do early flights cause they connect with big airports.  they wanna get u to your connection</p>\n\
        <time datetime="2009-11-13T20:00">Timothy • 51 min</time>\n\
      </div>\n\
    </li>\n\
    <li class="self">\n\
      <div class="avatar">\n\
        <img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/3/profile/profile-80_20.jpg" />\n\
      </div>\n\
      <div class="messages">\n\
        <p>That makes sense.</p>\n\
        <p>It\'\s a pretty small airport.</p>\n\
        <time datetime="2009-11-13T20:14">37 mins</time>\n\
      </div>\n\
    </li>\n\
    <li class="other">\n\
      <div class="avatar">\n\
        <img src="http://s3-us-west-2.amazonaws.com/s.cdpn.io/5/profile/profile-80_9.jpg" />\n\
      </div>\n\
      <div class="messages">\n\
        <p>that mongodb thing looks good, huh?</p>\n\
        <p>\n\
          tiny master db, and huge document store</p>\n\
      </div>\n\
    </li>\n\
  </ol>'
                            }
                            //----chat tab
                        ]
                    }

                ],
                listeners: {
                    resize: Codespace.app.resizeTabs,
                    collapse: Codespace.app.resizeTabs,
                    expand: Codespace.app.resizeTabs
                },
                bbar: [
                    {
                        xtype: 'textfield',
                        name: 'say',
                        emptyText: 'type your message here'
                    }
                ]
            }, {
                // xtype: 'panel' implied by default
                region: 'west',
                xtype: 'panel',
                layout: 'border',
                split: true, // enable resizing
                width: 300,
                collapsible: true, // make collapsible
                id: 'west-region-container',
                title: PROJECT,
                listeners: {
                    resize: Codespace.app.resizeTabs,
                    collapse: Codespace.app.resizeTabs,
                    expand: Codespace.app.resizeTabs
                },
                items: [
                    //----left-side
                    {
                        region: 'center',
                        xtype: 'filetree',
                        border: 0,
                        id: 'FileTree',
                        viewConfig: {
                            stateful: true,
                            stateId: 'FileTree'
                        }
                    },
                    {
                        title: 'Projects',
                        region: 'south',
                        collapsible: true,
                        collapsed: true,
                        height: '35%',
                        html: "PROJECTS"

                    }
                    //----left-side
                ]
            }, {
//                title: 'Center Region',
                region: 'center', // center region is required, no width/height specified
                xtype: 'panel',
                layout: 'border',
                listeners: {
                    resize: function() {

                    }
                },
                items: [
                    //----editor
                    {
                        id: 'filetabs',
                        region: 'center', // center region is required, no width/height specified
                        xtype: 'tabpanel',
                        items: []
                    },
                    //----toolbar
                    /*
                     {
                     region: 'south',
                     items: [
                     
                     ]
                     
                     }
                     */
                ]
                        //----end items
            }];
        this.callParent();
    }
});