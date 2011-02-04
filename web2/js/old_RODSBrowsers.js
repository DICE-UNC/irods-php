function removeLoadingMasks()
{
  var loading = Ext.get('loading');
  var mask = Ext.get('loading-mask');
	mask.setOpacity(.8);
	mask.shift({
		xy:loading.getXY(),
		width:loading.getWidth(),
		height:loading.getHeight(),
		remove:true,
		duration:1,
		opacity:.3,
		easing:'bounceOut',
		callback : function(){
			loading.fadeOut({duration:.2,remove:true});
		}
	});
}

// Create user extensions namespace (Ext.ux)
Ext.namespace('RODS');

RODS.Browsers = function(cfg){
  if (!cfg)
  {
    cfg = {};
  }
  var default_config = {
   //add more if needed  
  };
  
  Ext.applyIf(cfg, default_config);
  RODS.Browsers.superclass.constructor.call(this);
  Ext.applyIf(this, cfg);
};

Ext.extend(RODS.Browsers, Ext.util.Observable, {  
  init : function()
  {
    this.addEvents({
      'RURI_changed': true
    });
    
    // initiate user preference and account manager etc.
    MyPref=new UserPref();
    MyPref.init();
    //MyPref.addAccount(new RODSAccount({'user':'rods','host':'rt.sdsc.edu',
    //  'port':'1247','pass':'RODS','domain':''}));
    MyAcctWindow=new RODS.AccountWindow({renderTo: document.body});
    //MyAcctWindow.render(document.body);
    //MyAcctWindow.render();
    MyAcctWindow.init();
    MyAcctWindow.mask.addClass('z-account-mask');
    
    // handler when account log in
    MyAcctWindow.on('acct_auth_success', function(acct_window, acct){
      var acct_ruri=acct.toIdentifier();
      var full_ruri=acct_ruri+acct.initPath;
      
      acct_window.mask.removeClass('z-account-mask');
      
      this.setRURI(full_ruri);
      MyPref.activeAccount=acct;
      
      // add an new account into account menu
      var acct_exists=false;
      for(var i=0; i<this.acctMenu.items.getCount(); i++)
      {
        if (acct_ruri==this.acctMenu.items.get(i).acct_ruri)
        {
          acct_exists=true;
          this.acctMenu.items.get(i).setChecked(true);
          break;
        }
      }
      if (acct_exists===false)
      {  
        this.acctMenu.insert(0,
          new Ext.menu.CheckItem({
            group: 'active_account',
            checked: true,
            text: acct_ruri,
            acct_ruri: acct_ruri,
            ruri: full_ruri,
            scope: this,
            handler: function(){
              this.setRURI(full_ruri);
            }})
        );
      }
    }, this);
    
    this.initHeaderBar();
      
    this.browser=new RODS.BrowserPanel({
        //id : 'rodsbrowser'+Ext.id(),
        id : 'center-panel',
        region : 'center',
        el: 'center',
        xtype: 'rodsbrowser'
    });
    this.browser.on('RURI_changed', function(ruri){
      this.RURIChangeHandler(ruri);
    },this);
    
    if (CLIENT_LOG) {
      // create a global log panel, and wrap it in a window
      LogPanel = new RODS.LogGridPanel({minHeight: 200});
      LogWindow = new Ext.Window({
        id: 'log-window',
        title: 'Logs',
        layout: 'fit',
        items: LogPanel,
        closeAction: 'hide',
        hidden: true,
        width: 500
      });
    }
    
    this.viewport = new Ext.Viewport({
      layout:'border',
      items:[
        new Ext.BoxComponent({ // raw
            region:'north',
            el: 'north',
            height:35
        }),
        this.browser
      ]
    
    });
    
    this.viewport.doLayout();
    MyAcctWindow.show();  
              
    if (this.init_ruri)
    {
      MyAcctWindow.connectByRURI(this.init_ruri);
    }
  }, // end of init
  
  setRURI : function(ruri)
  {
    if ( (this.ruri)&&(this.ruri==ruri) )
      return;
      
    if (ruri.length<3)
    {
      MyAcctWindow.show();
      return;
    }  
    
    this.browser.setRURI(ruri);
  },
  
  RURIChangeHandler : function (ruri){
    if ( (this.ruri)&&(this.ruri==ruri) )
      return;
    this.ruri=ruri;
    this.fireEvent('RURI_changed', ruri);
  },
  
  initHeaderBar : function()
  {
    this.headerBar=new Ext.Toolbar({
      region : 'north',
      height: 35, 
      cls : 'z-headerbar',
      renderTo : 'north'
    });
    
    // build account menu
    this.acctMenu=new Ext.menu.Menu({name: 'acct_menu', items:[
      { text: 'Log in to another accout',
        iconCls: 'z-user-add-button-icon',
        ruri: '', 
        handler: function (){
          MyAcctWindow.enable();
          MyAcctWindow.show();
      }}  
    ]});
    
    // build Option menu
    this.optMenu=new Ext.menu.Menu({name: 'opt_menu', items:[
      { text: 'Space holder',
        handler : function() {
          Ext.Msg.alert('hello','Hello World!');
        }
      }
      ]
    });
    
    if (CLIENT_LOG) // add log in "Options.." menu, if configured
    {
      this.optMenu.add(
        { 
          text: 'Show Log',
          handler: function(){
            LogWindow.show(); 
          } 
        }  
      );
    }
    
    this.headerBar.add(
      'iRODS Browser',
      '->',
      new Ext.Toolbar.Button({text: 'Accounts', cls : "x-btn-text-icon", 
        iconCls: 'z-user-white-button-icon', 
        menu: this.acctMenu,
        listeners: {
          'mouseover': {
            fn: function() {this.setIconClass('z-user-blue-button-icon');}
          },
          'mouseout': {
            fn: function() {this.setIconClass('z-user-white-button-icon');}
          }
        }
      }),
      new Ext.Toolbar.Button({text: 'Options...', cls : "x-btn-text", 
        menu: this.optMenu
      }),
      '',
      new Ext.Toolbar.Button({
        cls : "x-btn-text-icon",
        text : "Log out",
        iconCls : 'z-power-white-button-icon',
        handler : function(){
          alert ("trying to log out");
        },
        listeners: {
          'mouseover': {
            fn: function() {this.setIconClass('z-power-blue-button-icon');}
          },
          'mouseout': {
            fn: function() {this.setIconClass('z-power-white-button-icon');}
          }
        }
      })
    ); 
      
  }
});