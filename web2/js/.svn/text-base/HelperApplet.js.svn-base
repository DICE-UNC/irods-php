HelperApplet = function(cfg){
    this.appletReady=false;      
    HelperApplet.superclass.constructor.call(this);
}

Ext.extend(HelperApplet, Ext.util.Observable, {  
  // private
  initEvents : function(){
    HelperApplet.superclass.initEvents.call(this);
  },

  upload : function(){  
    var req=new RODS.Requests();
    req.getTempPassword({
      ruri : this.ruri,
      scope : this,        
      callback : function(que_results){
         //Ext.Msg.alert('info', 'ruri: ' + this.ruri + ', temppass: ' + que_results['temppass']);
         //var ret_val = document.helper.copy(null, new java.lang.String(this.ruri), null, new java.lang.String(que_results['temppass']));
         var ret_val = document.helper.copy(null, this.ruri, null, que_results['temppass']);
      }         
    });    
  },

  download : function(){  
    var req=new RODS.Requests();
    req.getTempPassword({
      ruri : this.ruri,
      scope : this,        
      callback : function(que_results){
         var ruri_list = this.ruri.join(",");
         //Ext.Msg.alert('info', 'ruri: ' + ruri_list + ', temppass: ' + que_results['temppass']);
         //var ret_val = document.helper.copy(this.ruri#, null, new java.lang.String(que_results['temppass']), null);
         var ret_val = document.helper.copy(ruri_list, null, que_results['temppass'], null);
      }         
    });    
  },

  copy : function(action, ruri){
    if (this.appletReady!==true)
      this.startApplet();

    if (action == 'upload')
    {
        var _ruri = "irods://" + ruri;
        this.ruri = _ruri;
        this.upload();
    }
    else
    {
        var ruris = ruri;        
        var _ruris = [];
        for(var i=0; i<ruris.length; i++)
        {
            _ruris.push("irods://" + ruris[i]);
        }
        this.ruri = _ruris;
        this.download();         
    }   
  },
  
  startApplet : function() 
  {
    if (this.appletReady===true)
      return;
    this.startAppletDialog=new Ext.Window({
        layout:'fit',
        title: 'Starting Java Applet',
        width:500,
        height:300,
        closeAction:'hide',
        plain: true,
        html: 'Starting Java Applet, please wait ... <br/><br/>'+
              '<applet id="helper" name="helper" code="edu.sdsc.grid.gui.Helper"' +
              'archive="applets/lib/BrowserHelper.jar,applets/lib/jargon.jar" width="200" height="100" mayscript>' +
              'Your browser does not support Java, which is required for bulk upload/download.' +
              '</applet>',

        buttons: [{
            text:'Submit',
            disabled:true
        },{
            text: 'Close',
            handler: function(){
                this.startAppletDialog.hide();
            },
            scope : this
        }]
    });
    this.startAppletDialog.show();
    	
    var timeout_length= 1000*30;
    var elapsed_time=0;
    var tick=200;
    var check_start=function(){
      if (elapsed_time > timeout_length)
      {
        this.startAppletDialog.hide();
        Ext.Msg.alert('Error', 'Java Applet failed to load!');
      }
      if ( (document.helper) )//&&(true==document.helper.test()) )
      {
        this.startAppletDialog.hide();
        this.appletReady=true;
        //Ext.Msg.alert('Applet', 'Java Applet loaded');
      }
      else
      {
        elapsed_time=elapsed_time+tick;
        check_start.defer(tick);
      }
    }
    
    check_start.defer(tick, this);
    
  }
});
