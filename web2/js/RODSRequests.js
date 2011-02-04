Ext.namespace('RODS');

RODS.Requests = function(config) {
  
  // call parent constructor
  RODS.Requests.superclass.constructor.call(this, config);
};

Ext.extend(RODS.Requests, Ext.data.Connection, {
  request : function(options) {
    RODS.Requests.superclass.request.call(this, options); 
  },
  
  defaultHandler : function(o,s,r)
  {
    if (s!==true) {
      errorShow( new HTTPConnError(r) );
      return;
    }
    
    var resp;
    try { // handle potential json formatting error
      resp= Ext.util.JSON.decode(r.responseText);
    } catch (_err) {
      errorShow( new JsonParseError(r.responseText) );
      return false;
    }
    
    if (resp.success===false) // handle potential iRODS error
    {
      if (!resp.errors)
      {
        errorShow( new GeneralError('Expected error object not found') );
        return false;
      }
      errorShow( new RODSError(resp.errors.code, resp.errors.msg) );  
      return false;
    }
    return resp;
  },
  
  readFile : function (options) {
    this.request({
      url : 'services/readFile.php',
      scope : this,
      callback : function(o,s,r){
        Ext.MessageBox.hide();
        var resp=this.defaultHandler(o,s,r);
        if (resp === false) 
        {
          if (typeof options.callback_err == 'function')
             options.callback_err.call(options.scope, r.responseText);
          return;
        }
        if (typeof options.callback == 'function')
          options.callback.call(options.scope, resp['que_results']);
      },
      params : {
        ruri : options.ruri
      }
    });  
  },
  
  writeFile : function (options) {
    if (options.filestr.length >= PHP_POST_MAX_SIZE-100)
    {
      errorShow( new GeneralError('File is too large > '+PHP_POST_MAX_SIZE+' bytes! Upload after use a texteditor instead.') );
      return;
    }
    
    this.request({
      url : 'services/writeFile.php',
      scope : this,
      callback : function(o,s,r){
        Ext.MessageBox.hide();
        var resp=this.defaultHandler(o,s,r);
        if (resp === false) 
        {
          if (typeof options.callback_err == 'function')
             options.callback_err.call(options.scope, r.responseText);
          return;
        }
        if (typeof options.callback == 'function')
          options.callback.call(options.scope, resp['que_results']);
      },
      params : {
        ruri : options.ruri,
        filestr : options.filestr
      }
    });  
  },

  mkdir : function(options) {
    Ext.MessageBox.show({
      msg: 'Creating collection, please wait...',
      progressText: 'Creating...',
      width:300,
      wait:true,
      waitConfig: {interval:200}
    });
    
    this.request({
      url : 'services/mkdir.php',
      scope : this,
      callback : function(o,s,r){
        Ext.MessageBox.hide();
        var resp=this.defaultHandler(o,s,r);
        if (resp === false) 
          return;
        if (typeof options.callback == 'function')
          options.callback.call(options.scope, resp['que_results']);
      },
      params : {
        ruri : options.parenturi,
        name : options.name
      }
    });  
  },
  // remove file/collections by array of items, each item is an object
  // {ruri : '...', type : type_number(0=dir, 1=file)}
  rm : function(items, options)
  {
    var list = '';
    var numfile=0, numcoll=0;
    for (var i=0; i<items.length; i++)
    {
      if (i<5)
      {
        var itemruri=items[i]['ruri'];
        var itemname=itemruri.substr(itemruri.lastIndexOf('/')+1);
        if (items[i]['type']==0)
          itemname=itemname+'/';
        list=list+'&nbsp;&nbsp;&nbsp;&nbsp;'+itemname+'<br/>';
      }
      if (items[i]['type']==0) 
        numcoll++;
      else
        numfile++;
    }
    if (items.length>5)
      list=list+'&nbsp;&nbsp;&nbsp;&nbsp;... <br/>';
    var dialog_msg='Move the following '+numfile+
       '  files and '+numcoll+' collections to trash? <br/>'+list;  
    
    this.files=new Array();
    this.dirs=new Array();
    for (var i=0; i<items.length; i++)
    {
      if (items[i]['type']==0) 
        this.dirs.push(items[i]['ruri']);
      else
        this.files.push(items[i]['ruri']);
    }
    this.trash=dialog_msg;
    
    Ext.Msg.show({
     	title : 'File Deletion',
     	msg : dialog_msg,
     	buttons: Ext.MessageBox.OKCANCEL,
     	fn : function(button_id){
     	  if (button_id!='ok')
     	    return;
     	  Ext.MessageBox.show({
          msg: 'Deleting selected items, please wait...',
          progressText: 'Deleting...',
          width:300,
          wait:true,
          waitConfig: {interval:200}
        });
     	  this.request({
          url : 'services/delete.php',
          scope : this,
          callback : function(o,s,r){
            Ext.MessageBox.hide();
            var resp=this.defaultHandler(o,s,r);
            if (resp === false) 
              return;
            if (typeof options.callback == 'function')
              options.callback.call(options.scope, this.files.concat(this.dirs));
          },
          params : {
            'files[]' : this.files,
            'dirs[]' : this.dirs
          }
        }); 
     	},
     	scope: this
    }); 
  },
  // remove file/collections by array of items, each item is an object
  // {ruri : '...', type : type_number(0=dir, 1=file)}
  rmtrash : function(ruri, options)
  {     
    Ext.MessageBox.show({
      msg: 'Clearing items in trash, please wait...',
      progressText: 'Clearing trash...',
      width:300,
      wait:true,
      waitConfig: {interval:200}
    });
    this.request({
      url : 'services/rmtrash.php',
      scope : this,
      callback : function(o,s,r){
        Ext.MessageBox.hide();
        var resp=this.defaultHandler(o,s,r);
        if (resp === false)
        {
          return;
        }
        else  
        if (resp['lrp_id']) { 
          LRPHandler.startProgress({
            title: 'Clear Trash',
            request_handler: this,
            callback: options.callback,
            scope: options.scope,
            lrp_id: resp['lrp_id'],
            lrp_acct_ruri: ruri  
          });
        }
        else { //Task finished in no time
          if (typeof options.callback == 'function')
            options.callback.call(options.scope);
        }
        
      },
      params : {
        'ruri' : ruri
      }
    }); 
  },
  
  getLRPUpdates : function(options)
  {
    this.request({
      url : 'services/lrp_getProgress.php',
      scope : this,
      callback : function(o,s,r){
        var resp=this.defaultHandler(o,s,r);
        if (typeof options.callback == 'function')
          options.callback.call(options.scope, resp['que_results']);
      },
      params : {
        'ruri' : options.lrp_acct_ruri,
        'task_id' : options.lrp_id,
        'cancel' : options.lrp_cancel_requested,
        'log_start_line' : options.log_start_line
      }    
    });
  },

  getTempPassword : function(options) {
    this.request({
      url : 'services/getTempPassword.php',
      scope : this,
      callback : function(o,s,r){
        var resp=this.defaultHandler(o,s,r);
        if (typeof options.callback == 'function')
          options.callback.call(options.scope, resp['que_results']);
      },
      params : {
        'ruri' : options.ruri
      }
    });  
  },  

  getImagePlaylist : function(options)
  {
    this.request({
      url : 'services/getImagePlaylist.php',
      scope : this,
      callback : function(o,s,r){
        var resp=this.defaultHandler(o,s,r);
        if (typeof options.callback == 'function')
          options.callback.call(options.scope, resp['que_results']);
      },
      params : {
        'ruri' : options.ruri
      }    
    });
  },
  
  renewSession : function(options) {
    this.request({
      url : 'services/renewSession.php',
      scope : this,
      callback : function(o,s,r){
        var resp=this.defaultHandler(o,s,r);
        if (typeof options.callback == 'function')
          options.callback.call(options.scope, resp['que_results']);
      },
      params : {
        ssid : options.ssid
      }    
    });
  }  
});
