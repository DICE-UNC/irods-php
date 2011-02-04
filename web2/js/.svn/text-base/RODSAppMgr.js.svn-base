// Create user extensions namespace (Ext.ux)
Ext.namespace('RODS');

RODS.AppMgr = function(cfg){
  if (!cfg)
  {
    cfg = {};
  }
  var default_config = {
    //add more if needed  
    cls: 'z-desktop',
    hideBorders: true,
    items:[
      
    ]
  };
  
  if (CLIENT_LOG)
  {
    default_config.items.push({
      xtype: 'window',
        id: 'log-window',
        title: 'Logs',
        layout: 'fit',
        //items: LogPanel,
        /*
        items: {
          id: 'log-panel', 
          xtype: 'loggrid', 
          minHeight: 200
        },*/
        items: new RODS.LogGridPanel({
          id: 'log-panel', 
          xtype: 'loggrid', 
          minHeight: 200
        }),
        closeAction: 'hide',
        closable: true,
        //renderTo: this.center_container,
        width: 640,
        height: 300
      
    });
  }  
  
  Ext.applyIf(cfg, default_config);
  RODS.AppMgr.superclass.constructor.call(this, cfg);
  
};

Ext.extend(RODS.AppMgr, Ext.Container, {  
  browsers : [],
  images : {},
  initComponents : function()
  {
    RODS.AppMgr.superclass.initComponent.call(this);
    this.addEvents({
      'RURI_changed': true
    });
    
    
  }, // end of init
  
  setRURI : function(ruri)
  {
    if ( (this.ruri)&&(this.ruri==ruri) )
      return;
    var browser=this.getBrowserByRURI(ruri);
    if (browser)
    {
      if (browser.hidden)
        browser.show();
      browser.setActive(true);
      browser.toFront();
      browser.setRURI(ruri);
    }
  },
  
  RURIChangeHandler : function (ruri){
    if ( (this.ruri)&&(this.ruri==ruri) )
      return;
    this.ruri=ruri;
    this.fireEvent('RURI_changed', ruri);
  },
  
  addApp : function (_appwin, callerwin){
    _appwin.appMgr=this;
    var appwin=this.add(_appwin);
    appwin.render(this.getEl());  
    appwin.show();
    if (callerwin)
    {
      /*
      if (callerwin.maximized)
      {
        callerwin.toggleMaximize();
        callerwin.center();
      }
      */
      if (!callerwin.maximized)
        appwin.alignTo(callerwin.getEl(),'tl',[40, 40]);
    }
    //this.doLayout();
    return appwin;
  },
  
  addRODSItems : function(collstats){
    for (var i=0; i<this.browsers.length; i++)
    {
      this.browsers[i].addRODSItems(collstats);
    }
  },
  
  removeRODSItems : function(ruris){
    for (var i=0; i<this.browsers.length; i++)
    {
      this.browsers[i].removeRODSItems(ruris);
    }
  },
  
  addBrowser : function (ruri, callerwin){
    var browser=this.addApp({
        xtype: 'rodsbrowser',
        initRURI: ruri,
        stateful: false,
      closable: (this.browsers.length >0),
      closeAction: 'hide',
      collapsible: true,
      maximizable: true,
      constrainHeader : true,
        
        listeners: {
          'RURI_changed' : {
            fn: function(ruri){
              this.RURIChangeHandler(ruri);
            },
            scope: this
          }
        } 
    }, callerwin);
    this.browsers.push(browser);
    return browser;
  },
  
  // find a browser by account, if not found, create a new one
  getBrowserByAcct : function (acct){
    var browser;
    var i;
    
    //look up if any window has the same uri
    for (i=0; i<this.browsers.length; i++)
    {
      browser=this.browsers[i];
      //alert("comparing: \n"+browser.ruri+"\n"+acct.toRURI()+"\n");
      if (browser.ruri==acct.toRURI())
        return browser;
    }
    
    //if no perfect matching, find same account
    for (i=0; i<this.browsers.length; i++) 
    {
      browser=this.browsers[i];
      if (true===browser.underAccount(acct))
        return browser;
    }
    
    // if nothing at all, add a new
    browser=this.addBrowser(acct.toRURI());
    return browser;
  },
  
  getBrowserByRURI : function (ruri){
    var acct=ruri2Account(ruri);
    if (acct.seemsValid())
    {
      return this.getBrowserByAcct(acct);
    }
    else
    {
      Ext.Msg.alert('iRODS URI does not seem to be valid: '+ruri);
      return;  
    }
  },
  
  showFile : function(ruri, callerwin) {
    var file_name, file_ext, file_ext_index;
    file_name=ruri.substr(ruri.lastIndexOf('/')+1);
    file_ext_index=file_name.lastIndexOf('.');
    if (file_ext_index >= 0)
    {
      file_ext=file_name.substr(file_ext_index+1);
      file_ext=file_ext.toUpperCase();
    }
    else
      file_ext='';
    
    switch (file_ext) {
      case 'TXT': case 'PHP': case 'PL': case 'C': case 'H':
        this.showTextFile(ruri, callerwin);
        break;
      case 'JPG': case 'JPEG': case 'GIF': case 'PNG': case 'BMP':
        this.showImage(ruri, callerwin);
        break;
      default:
        var http_url='rodsproxy/'+ruri;
        if (this.newwindow && !this.newwindow.closed && this.newwindow.location) {
    		  this.newwindow.location.href = http_url;
    	  }
    	  else {
    		  this.newwindow=window.open(http_url,'name',
    		    'resizable=1,scrollbars=1,width=640,height=480');
    		if (!this.newwindow.opener) this.newwindow.opener = self;
    	  }
    	  if (window.focus) {this.newwindow.focus()}
    	  break;
    }
  },
  
  showTextFile : function(ruri, callerwin) {
    var textEditorWindow = new TextEditorWindow({
      closable: true,
      maximizable: true,
      minHeight: 300,
      minWidth: 640,
      height: 600, 
      width: 800
    }); 
    this.addApp(textEditorWindow, callerwin);
    textEditorWindow.showFile(ruri);    
  },
  
  showImage : function(ruri, callerwin)
  {
    var viewer= new ImageViewerWindow({
      minWidth: 200,
      minHeight:100,
      width: 800,
      height:600,
      autoScroll: true,
      ruri:ruri
    });
    this.addApp(viewer, callerwin);
    viewer.show();
    return;
    
    var img_url='http://ubuntu/irods2/rodsproxy/'+ruri;
    var img=new Image();
    img.src=img_url;
    
    
    var win=new Ext.Window({
      minWidth: 200,
      minHeight:100,
      width: 800,
      height:600,
      autoScroll: true,
      html: 'Loading image...'
    });
    win.show();
    
    img.onload=function(){
      win.setTitle(img.height+'/'+img.width);
      var image_height=
      win.body.dom.innerHTML='<img src="'+img_url+'" />';
      //win.body.createChild({html: 'loaded'});
    }
    
    /*
    var el = this.getEl();
    if (!this.images[ruri])
    {
      var img_url='http://ubuntu/irods2/rodsproxy/'+ruri;
      this.images[ruri]=el.createChild({tag: 'img', id: Ext.id(), src: img_url}); 
    }
    var resizable_img = new Ext.Resizable(this.images[ruri], {
            wrap:true,
            pinned:false,
            minWidth:50,
            minHeight: 50,
            maxWidth : 800,
            maxHeight: 600,
            preserveRatio: true,
            handles: 'all',
            draggable:true,
            dynamic:true
        });
        var customEl = resizable_img.getEl();
        // move to the body to prevent overlap on my blog
        //document.body.insertBefore(customEl.dom, document.body.firstChild);
        
        customEl.on('dblclick', function(){
            customEl.hide(true);
        });
        customEl.hide();
        
        customEl.center();
            customEl.show(true);

    */
  }   
});
Ext.reg('appcontainer', RODS.AppMgr);