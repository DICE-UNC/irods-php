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

RODSBrowser=function(init_ruri, ssid)
{
  // private variables
  
  var viewport;
  
  // public functions/methods
  return {
    
    init : function (){
      
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
      
      // handler when account log in
      MyAcctWindow.on('acct_auth_success', function(acct_window, acct){
        var acct_ruri=acct.toIdentifier();
        var full_ruri=acct_ruri+acct.initPath;
        
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
        '',
        new Ext.Toolbar.Button({
          cls : "x-btn-text-icon",
          text : "Log out",
          //style : "color=white",
          iconCls : 'z-power-white-button-icon',
          handler : function(){
            //alert ("trying to log out");
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
        
      this.browser=new RODS.BrowserPanel({
                    //id : 'rodsbrowser'+Ext.id(),
                    id : 'center-panel',
                    region : 'center',
                    el: 'center',
                    xtype: 'rodsbrowser'
                });
      viewport = new Ext.Viewport({
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
      
      //this.browser.grid.setRURI("rods:RODS@rt.sdsc.edu:1247/tempZone/home/rods");  
      viewport.doLayout();
        
      //this.browser.disable();
      MyAcctWindow.show();        
        
      
    }, // end of init
    
    setRURI : function(ruri)
    {
      this.browser.setRURI(ruri);
    }
  }
}
