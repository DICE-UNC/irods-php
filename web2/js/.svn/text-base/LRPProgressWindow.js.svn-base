LRPProgressWindow = function(config){
  
  if (!config)
      config={};
  this.cancelButton=new Ext.Toolbar.Button({    
        text: 'Cancel',
        scope: this,
        cls: 'x-btn-text-icon',
        iconCls: 'z-stop-button-icon',
        handler: function (button, evnt){  
          button.disable();
          this.lrp_cancel_requested=true;
          this.updateProgressText('Requesting to cancel this task...');
          
        }
  });
  
  this.closeButton=new Ext.Toolbar.Button({ 
        text: 'Close',
        scope: this,
        handler: function (button, evnt){  
          this.hide();
        }
  });
  
  var default_conf={
    renderTo : document.body,
    width: 500,
    //autoWidth:true, 
    autoHeight:true,
    //height: 500,
    modal: true, 
    shadow: false, 
    stateful: false,
    closable: false,
    collapsible: false,
    maximizable: false,
    resizeable: true,
    constrain:true,
    constrainHeader : true,
    monitorResize: true, 
    footer:true,
    border: false,
    cls: 'x-window-dlg',
    layout: 'anchor',
    items: [ {
      xtype: 'panel',  
      html: 'Initializing...',
      border: false,
      bodyStyle : 'background: transparent none repeat scroll 0 0; font-size=14'
    } , {
      xtype: 'progress',
      text:'Initializing...',
      autoHeight : true 
    }, {
     xtype:'fieldset',
     title: 'Details',
     autoHeight:true,
     collapsible: true,
     collapsed: true,  
     style: 'margin-top: 10px;',
     layout: 'fit',
     items: [
       {xtype: 'textarea', name: 'log', fieldLabel: 'log',  
        height: 300, value:'Loading...',hideLabel:true, anchor:'100%',
        style: 'color:#00FF00; background: #000000;text-decoration:none;'+
               'font-weight: normal;border: none;'
       }
     ]
    }],
    
    bbar : [
      '->', this.cancelButton, this.closeButton 
      
      
    ]
  
  };
  Ext.applyIf(config, default_conf);
  LRPProgressWindow.superclass.constructor.call(this, config);
    
};

Ext.extend(LRPProgressWindow, Ext.Window, {  
  msg : 'Initializing...',
  progress: 0,
  num_log_lines: 0,
  logs: 0,
  
  initComponent : function(){
    LRPProgressWindow.superclass.initComponent.call(this);
    this.on('render', function(me) {
      var panel=this.getComponent(0);
      this.msgEl=this.getComponent(0).getEl();
      
      this.progressBar=this.getComponent(1);
      this.detailFS=this.getComponent(2);
      this.logBox=this.detailFS.getComponent(0);
    }, this);
    
    this.on('hide', function(){
      this.reset();
    },this);
  },
  
  updateMsg : function(msg){
    this.msg=msg;
    if (!this.msgEl)
      this.msgEl=this.getComponent(0).getEl();
    this.msgEl.update(this.msg);
    this.doLayout();
  },
  
  updateProgressText : function(progressText){
    this.progressText=progressText;  
    this.progressBar.updateText(this.progressText);
  },
  
  updateProgress : function(progress, progressText, msg){
    
    this.progressText=progressText;
    if (progress>=0)
      this.progress=progress;
    if (msg)
    {
      this.updateMsg(msg);
    }
    this.progressBar.updateProgress(this.progress, this.progressText);
  },
  
  updateLog : function(logs, num_line)
  {
    this.logs += logs;
    this.num_log_lines += num_line;
    this.logBox.setRawValue(this.logs);
    var el = this.logBox.getEl();
    el.scroll('b', this.num_log_lines*100);
  },  
  
  reset : function(){
    this.cancelButton.setDisabled(false);
    this.closeButton.setDisabled(true);
    this.lrp_cancel_requested=false;
    this.num_log_lines=0;
    if (this.logs)
      delete this.logs;
    this.logs='';
    this.logBox.setRawValue('initializing...'); 
    this.setTitle('');
    this.progressText='Initializing...';
    this.lrp_percentage=0;
    this.updateProgress(this.lrp_percentage, this.progressText,this.msg);
    this.request=null;
  },
  
  startProgress : function(options) {
    this.show();
    this.reset();
    
    if (options.title)
      this.setTitle(options.title);
    this.msg='Initializing task, plesae wait...';
    if (options.msg)
      this.msg=msg;
    
    this.lrp_id=options.lrp_id;
    this.lrp_acct_ruri=options.lrp_acct_ruri; 
    this.startOptions=options;
    this.request=options.request_handler;
    
    this.requestUpdateStatus();
    
  },
  
  requestUpdateStatus : function() {
    var options={
      lrp_acct_ruri : this.lrp_acct_ruri,
      lrp_id : this.lrp_id,
      lrp_cancel_requested: this.lrp_cancel_requested,
      scope: this,
      log_start_line: this.num_log_lines,
      callback : this.updateStatus
    };  
    this.request.getLRPUpdates(options);   
  
  },
  
  updateStatus : function (status) {
    var percentage=status['processed_num_files']/status['total_num_files'];
    if (percentage >= 1)
      percentage=0.99;
    if (percentage <= 0)
      percentage=0; 
    this.lrp_percentage=percentage;
    
    this.updateLog(status["logs"], status["log_num_line"]);
    
    switch (status['state'])
    {
      case LRP_STATE_SUCCESS :
        this.updateProgress(1,'Completed!','Task completed.');
        this.closeButton.setDisabled(false);
        this.cancelButton.setDisabled(true);
        this.hide();
        if (typeof this.startOptions.callback == 'function')
           this.startOptions.callback.call(this.startOptions.scope);
        break;
      case LRP_STATE_FAILED :
       this.closeButton.setDisabled(false);
       this.cancelButton.setDisabled(true);
       this.updateProgressText('Failed');
       this.updateMsg('Task Failed'+'('+status['errcode']+')'+': '+
           status['errmsg']+ '<br/> <a href="services/lrp_showLog.php?ruri='+acct_ruri+'&task_id='+task_id+'" target="_blank">View Log</a> ');
       return;
       break;
      case LRP_STATE_PLANNING : 
      case LRP_STATE_INITIALIZING :
        var defer_time=1000;
        if (!this.lrp_cancel_requested)
          this.updateProgress(0,'Initializing Task ...', 'Task has been scheduled, waiting on server to initializing the task...');
        else
          defer_time=10;
        this.requestUpdateStatus.defer(defer_time,this);
        break;
      case LRP_STATE_INPROCRESS : 
        var defer_time=1000;
        if (!this.lrp_cancel_requested)
        {   
          var msg='Task in progress...';
          if ( (status['estimated_time_left'])&&(status['estimated_time_left'].length > 1))
            msg='Task in progress. <br/> Estimated time left: '+status['estimated_time_left'];
          this.updateProgress(percentage,
            status['processed_num_files']+'('+status['total_num_files']+') files processed...',
            msg);
        }
        else
          defer_time=10;
        this.requestUpdateStatus.defer(defer_time,this);
        break;
      case LRP_STATE_CANCELING : 
        this.updateProgress(this.lrp_percentage,
            'Canceling task....', 
            'Server is trying to cancel this task. Please be patient.');
        return;
        break;  
      case LRP_STATE_USER_CANCELED : 
        this.updateProgressText('Task Canceled');
        this.updateMsg('You task has been canceled!');
        this.closeButton.setDisabled(false);
        this.cancelButton.setDisabled(true);
        this.hide();
        return;
        break;   
    }
    
  },
  
  testShow : function() {
    this.show();
    this.updateMsg("This is a test!");
    //this.progressBar.updateProgress(0.5, "Hello World!");
    //this.updateProgress(0, '1 step 1', 'test msg'); 
    /*
    this.updateProgress.defer(1000,this,[0.20, '2 step 2', 'test msg2']);
    this.updateProgress.defer(2000,this,[0.40, '3 step 3', 'test msg3']);
    this.updateProgress.defer(3000,this,[0.60, '4 step 4', 'test msg4']);
    this.updateProgress.defer(4000,this,[0.80, '5 step 5', 'test msg5']);
    this.updateProgress.defer(5000,this,[1, "6 step 6", 'test msg6']);
    */
  }
});

Ext.reg('progresswin', LRPProgressWindow);