// Create user extensions namespace (Ext.ux)
Ext.namespace('RODS');

RODS.AccountWindow = function(cfg){
  if (!cfg)
  {
    cfg = {};
  }
  var acct_store=new Ext.data.SimpleStore({
              fields: ['user','host','port','zone','pass','initPath','defaultResc'],
              data: MyPref.getAccountArray(),
              proxy: new Ext.data.MemoryProxy(MyPref.getAccountArray())
            });
  
  var default_config = {
    //id:'accounts-view',
    floating: true,
    width:500,
    stateful: false,
    maskDisabled: true,
    draggable: true,
    hideBorders: true,
    autoShow: true,
    autoHeight:true,
    collapsible:false,
    closable:false,
    shadow: false, // shadow not updating correctly with a form child and collapsable fieldset...
    title:'iRODS account',
    modal: true,
    //layout:'fit',
    constrain: true,
    items: {
      id:'accounts-view-form',
      xtype:'form',
      //hideBorders: true,
      bodyStyle:'padding:5px 5px 0',
      frame:true,
      items: [{
        id:'accounts-view-form-fs1',
        xtype:'fieldset',
        //title: 'Account',
        //hideBorders: true,
        style: 'border:0px',
        autoHeight:true,
        collapsible: false,
        defaultType: 'textfield',
        defaults: {allowBlank: true, 
          //hideTrigger: (MyPref.numAccount() < 1), // hide trigger if no account stored
          width: 300,
          labelWidth: 120, // label settings here cascade unless overridden
          
          labelStyle: 'font-weight:bold;'
          
        },
        items: [
          {
            name: 'host', fieldLabel: 'Host IP', displayField:'host', 
            xtype: 'combo',
            isCombo:true,
            hideTrigger: (MyPref.numAccount() < 1), // hide trigger if no account stored
            lazyInit: false,
            disableKeyFilter: true,
            store: acct_store,
            mode: 'local',
            tpl: new Ext.XTemplate(
              '<tpl for=".">',
                  '<div class="x-combo-list-item">',
                  '{user}@{host}:{port}</div>',
              '</tpl>',
              '<div class="x-clear"></div>'
            ),
            listeners:{
              'expand':{ //reload data before query
                fn: function (combo) {
                  combo.store.loadData(MyPref.getAccountArray());
                }  
              },
              'select':{ //auto fill the rest of field
                fn: function (combo,record,index) {
                  this.autoFillFormByAcctIndex(index);      
                },
                scope: this
              }
            }  
          },
          {name: 'port', fieldLabel: 'Port Number'}, 
          {name: 'user', fieldLabel: 'Username'},
          {name: 'pass', fieldLabel: 'Password', inputType: 'password'}
          
        ]
      },{
        id:'accounts-view-form-fs-options',
        xtype:'fieldset',
        style: 'border:0px;padding:0px;',
        //checkboxToggle:true,
        //title: 'Enviroment',
        collapsible: false,
        autoHeight:true,
        defaultType: 'checkbox',
        defaults: {
          labelSeparator: ' ',
          labelWidth: 120 // label settings here cascade unless overridden  
        },
        items: [
          {
            name: 'saveacct-chkbox',
            boxLabel: 'Save account information on this computer',
            //hideLabel: true,
            xtype: 'checkbox',
            checked: MyPref.get('save_data'),
            listeners: {
              'check' : {
                  fn: function (thisCheckbox, ischecked){
                    MyPref.set('save_data',ischecked);
                    if (ischecked==false)
                    {
                      MyPref.remove();
                    }
                  },
                  scope: this
              }
            }
          },
          {
            name: 'savepass-chkbox',
            boxLabel: 'Save passwords on this computer',
            //hideLabel: true,
            xtype: 'checkbox',
            checked: MyPref.get('save_pass'),
            listeners: {
              'check' : {
                  fn: function (thisCheckbox, ischecked){
                    MyPref.set('save_pass',ischecked);
                  },
                  scope: this
              }
            }
          }
        ]
      },{
        id:'accounts-view-form-fs2',
        xtype:'fieldset',
        //checkboxToggle:true,
        labelWidth: 120, // label settings here cascade unless overridden
        title: 'Enviroment',
        collapsible: true,
        autoHeight:true,
        collapsed: true,
        defaultType: 'textfield',
        defaults: {
          labelStyle: 'font-weight:bold;',
          width: 300
        },
        items: [
          {name: 'initPath', fieldLabel: 'Initial Path'},
          {name: 'defaultResc', fieldLabel: 'Default Resource'}
        ]
      }],
      
      buttons: [{
          text: 'Connect', 
          xtype: 'button',
          iconCls: 'z-connect-button-icon',
          cls:'x-btn-text-icon',
          handler: this.connectHandler,
          scope: this
        },{
          text: 'Cancel', 
          cls:'x-btn-text',
          handler: function(){
            if (this.connectedOnce===true) //only clickable after connected once at least
              this.hide();
          },
          scope: this
        }
      ]
    },
    
    tools: [
      {
        id:'help', 
        handler: function(event, toolEl, Panel){
          //icon only
        },
        qtip: {
          autoHide: false,
          text:RWCTips['acctWindow']
        }
      }
    ],
    
    keys: [
      {
        key: [10,13],
        fn: this.connectHandler,
        scope: this
      }
    ]
    
  };
  Ext.applyIf(cfg, default_config);
  RODS.AccountWindow.superclass.constructor.call(this,cfg);
   
};

Ext.extend(RODS.AccountWindow, Ext.Window, {  
  init : function()
  {
    this.thisform=this.getComponent(0).getForm();
    this.host_fld=this.thisform.findField('host');
    this.port_fld=this.thisform.findField('port');
    this.user_fld=this.thisform.findField('user');
    this.pass_fld=this.thisform.findField('pass');
    this.initPath_fld=this.thisform.findField('initPath');
    this.defaultResc_fld=this.thisform.findField('defaultResc');
    this.saveacct_chkbox=this.thisform.findField('saveacct-chkbox');
    this.savepass_chkbox=this.thisform.findField('savepass-chkbox');
  },
  
  initEvents : function()
  {
    RODS.AccountWindow.superclass.initEvents.call(this);
    
  },
  
  addAccount : function(acct)
  {
    MyPref.addAccount(acct);  
  },
  
  getForm: function()
  {
    return this.getComponent(0).getForm();
  },
  
  autoFillFormByAcctIndex: function(index)
  {
    var account=MyPref.getAccount(index);
    this.host_fld.setValue(account.host);
    this.port_fld.setValue(account.port);
    this.user_fld.setValue(account.user);
    this.pass_fld.setValue(account.pass);
    this.initPath_fld.setValue(account.initPath);
    this.defaultResc_fld.setValue(account.defaultResc);
  },
  
  connectByRURI: function (ruri)
  {
    if (this.hidden) 
      this.show();
    this.fillFormByRURI(ruri);
    this.connectHandler(false);
  },
  
  fillFormByRURI: function (ruri)
  {
    var new_acct=ruri2Account('irods://'+ruri);
    
    
    var old_acct=MyPref.findAccount(new_acct);
    
    if (old_acct) { // apply properties of the old account to new, such as password 
      if ( (new_acct.pass.length < 1)&&(old_acct.pass.length > 0) ) {
        // use old account's password, if exists, and if new pass is empty
        new_acct.pass=old_acct.pass; 
      }
    }
    // fill the account window
    this.host_fld.setValue(new_acct.host);
    this.port_fld.setValue(new_acct.port);
    this.user_fld.setValue(new_acct.user);
    this.pass_fld.setValue(new_acct.pass);
    this.initPath_fld.setValue(new_acct.initPath);
  },
  
  connectHandler : function(ignorepass)
  {
    var thisform=this.getComponent(0).getForm();
    // validate fields
    var host_fld=thisform.findField('host');
    var port_fld=thisform.findField('port');
    var user_fld=thisform.findField('user');
    var pass_fld=thisform.findField('pass');
    if (host_fld.getValue().trim().length<1)
    {
      host_fld.markInvalid('iRODS host IP/name is required!');
      return;
    }
    if (port_fld.getValue().trim().length<1)
    {
      port_fld.markInvalid('Port number of iRODS host is required!');
      return;
    }
    if (user_fld.getValue().trim().length<1)
    {
      user_fld.markInvalid('iRODS username is required!');
      return;
    }
    if ( (pass_fld.getValue().trim().length<1)&&(!ignorepass) ) 
    { // only check pass if specified, if user use back/forward button
      // and if ruri is already authenticated, no need to do it again...
      pass_fld.markInvalid('Password is required!');
      return;
    }  
      
    
    this.disable();
    thisform.doAction('submit',{
      url: 'services/login.php',
      waitMsg: 'Authenticating',
      failure: function(form,action){
        var status=FormFailureErrorHandler(form,action,false);
        if (status==false) // if the error is unprocessed
        {
          var errcode=parseInt(action.result.errors['code']);
          var errmsg=action.result.errors['msg'];
          var title='Connection Failed';
          var text='Unknown Error';
          var thisform=form;
          var host_fld=thisform.findField('host');
          var port_fld=thisform.findField('port');
          var user_fld=thisform.findField('user');
          var pass_fld=thisform.findField('pass');
          switch(errcode)
          {
            case -1000:
              title='iRODS server not responding'
              text='iRODS server \''+host_fld.getValue()+':'+port_fld.getValue()
                +'\' is not responding. It may be caused by incorrect host name/port, '
                +'or the server may be down';
              Ext.Msg.alert(title,text);
              break;
            case -827000:
              text='User: \''+user_fld.getValue()+'\' does not exist.';
              user_fld.markInvalid(text);
              break;
            case -826000:
              var passstr=pass_fld.getValue();
              if (passstr.length>0)
                text='Wrong password.';
              else
                text='Password required.';
              pass_fld.markInvalid(text);
              break;  
            default:
              title='Connection Failed';
              text=errcode+': '+ errmsg;
              Ext.Msg.alert(title,text);
              break;    
          }  
        }
        this.enable();
      },
      success: function(form,action){
        var host=thisform.findField('host').getValue();
        var port=thisform.findField('port').getValue();
        var user=thisform.findField('user').getValue();
        var pass=thisform.findField('pass').getValue();
        var initPath=action.result['init_path']?action.result['init_path']:'';
        var defaultResc=action.result['default_resc']?action.result['default_resc']:'';
        var resources=action.result['resources']?action.result['resources']:[];
        var zone=action.result['zone']?action.result['zone']:'';
        
        var account=new RODSAccount({user:user,host:host, port:port,
          pass:pass, zone:zone, initPath:initPath, defaultResc:defaultResc, 
          resources:resources});
        MyPref.addAccount(account);  
        this.fireEvent('acct_auth_success', this, account);  
        
        if (!this.connectedOnce) //set flag after connected at least once
        {
          this.connectedOnce=true;
        }
        this.enable();
        this.hide();
      },
      scope: this,
      clientValidation: false
    });
  }
  
  
});