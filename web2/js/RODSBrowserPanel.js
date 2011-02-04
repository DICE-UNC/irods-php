// Create user extensions namespace (Ext.ux)
Ext.namespace('RODS');

RODS.BrowserPanel = function(config){
    
    this.actions={
      'mkdir' : new Ext.Action({
        text: 'New Collection', scope: this, disabled: false,
        handler: function(){
          // Prompt for user data and process the result using a callback:
          Ext.Msg.prompt('New Collection', 
              'Please enter the name for new collection:', 
              function(btn, text){
                if ( (btn == 'ok')&&(text)&&(text.length>0) ){
                  var req=new RODS.Requests();
                  req.mkdir({
                    parenturi : this.getRURI(),
                    name: text,
                    callback : function(collstats) {
                      this.appMgr.addRODSItems(collstats);
                      this.setStatusText('Collection created: '+text);
                      Ext.MessageBox.hide();
                    },
                    scope : this  
                  });
                }
                
              }, this);
        },
        iconCls: 'z-new-coll-button-icon'
      }),

      'rm' : new Ext.Action({
         text: 'Delete',
         disabled: true,
         handler: function(){
           var selmod=this.grid.getSelectionModel();
           if (selmod.hasSelection())
           {
             var selections=selmod.getSelections();
             var items=[];
             var ruris=[];
             for(var i=0; i<selections.length; i++)
             {
                items.push({ruri: selections[i].get('ruri'),
                            type: selections[i].get('type')
                           });
                ruris.push(selections[i].get('ruri'));
             }
             var req=new RODS.Requests();
             req.rm(items, {
                callback : function() {
                  this.appMgr.removeRODSItems(ruris);
                  this.setStatusText(items.length+' items removed.');
                  Ext.MessageBox.hide();
                },             
                scope: this
             });
           } 
         },
         scope: this,
         iconCls: 'z-delete-button-icon'
      }),
      
      'bulk_upload' : new Ext.Action({
        text: 'Upload',
        disabled: false,
        handler: function(){
          Helper_Applet.copy('upload', this.getRURI());     
        },
        scope: this,
        iconCls: 'z-upload-button-icon'
      }),     

     'bulk_download' : new Ext.Action({
        text: 'Download',
        disabled: false,
        handler: function(){
           var selmod=this.grid.getSelectionModel();
           if (selmod.hasSelection())
           {
             var selections=selmod.getSelections();
             var ruris=[];
             for(var i=0; i<selections.length; i++)
             {
                ruris.push(selections[i].get('ruri'));
             }
             Helper_Applet.copy('download', ruris);
           } 
         },
         scope: this,
         iconCls: 'z-download-button-icon'
      }),

      'rmtrash' : new Ext.Action({
        text: 'Clear Trash',
        disabled: false,
        handler: function(){
            var req=new RODS.Requests();
            req.rmtrash(this.ruri, {
               callback : function() {
                 var account=ruri2Account(this.ruri);
                 var trashdir=account.getTrashDirRURI();
                 this.appMgr.removeRODSItems([trashdir]);
                 this.setStatusText('Items in trash cleared.');
               },             
               scope: this
            });
        },
        scope: this
      })
    };
    
    this.setActionsDisabled= function(){
      for (actionkey in this.actions)
      {
        if (actionkey.length>0)
        {
          if (actionkey=='mkdir')
            continue;
          if (actionkey=='bulk_upload')
            continue; 
          if (actionkey=='rmtrash')
            continue;    
          else
          {
            this.actions[actionkey].setDisabled(!(this.grid.getSelectionModel().hasSelection()));
          }
        }
      }
    };
    
    var default_conf={
      title: ' ',
      layout : 'border',
      minHeight: 300,
      minWidth: 640,
      height: 600, 
      width: 800,  
      tbar   : [
        { cls: 'x-btn-icon', iconCls: 'z-folder-up-button-icon', 
          handler: function(){
            this.folderup();
          }, scope:this, tooltip: 'Go to parent collection'
        },
        { cls: 'x-btn-icon', iconCls: 'z-new-window-button-icon', 
          handler: function(){
            if ( (this.appMgr)&&(this.ruri)&&(this.ruri.length>3) )
              this.appMgr.addBrowser(this.ruri, this);
          }, scope:this, tooltip: 'Open Additional Browser'
        },
        '-',
        { cls: 'x-btn-text-icon', iconCls: 'z-organize-button-icon', text: 'Organize', 
          tooltip: 'Organize this collection\'s contents',
          menu: { // 'Organize menu'
            listeners : {
              'show' : { // auto disable/enable action items, if there are selection(s)
                scope : this,
                fn : function(menu) { 
                  this.setActionsDisabled();
                }
              }
            },
            
            items: [
              this.actions['bulk_upload'],
              this.actions['bulk_download'],
              this.actions['mkdir'],
              this.actions['rm'],
              this.actions['rmtrash']
            ]
          }
        }  
        
      ],
      keys: [
        {
            key: Ext.EventObject.DELETE,
            handler: function(){
              var selmod=this.grid.getSelectionModel();
              if (selmod.hasSelection())
              {
               var name=selmod.getSelected().get('name');
               Ext.Msg.alert('selected',name);
              }   
            },
            scope: this
        }
      ],
      items :
      [
          {
            xtype: 'rodstree',
            title: 'Collections',
            region:'west',
            split:true,
            collapsible: true,
            width: 200,
            minSize: 100,
            maxSize: 300  
          },
          {
            xtype: 'rodsgrid',
            region: 'center',
            parentCont: this,
            appMgr: this.appMgr  
          }
          
      ] 
    };
    Ext.applyIf(config, default_conf);
    RODS.BrowserPanel.superclass.constructor.call(this, config);
    
};


//Ext.extend(RODS.BrowserPanel, Ext.Panel, {
//Ext.extend(RODS.BrowserPanel, Ext.Window, {  
Ext.extend(RODS.BrowserPanel, RODS.AppWindow, {    
  initComponent : function(){
    RODS.BrowserPanel.superclass.initComponent.call(this);
    this.tree=this.getComponent(0);
    this.grid=this.getComponent(1);
    
    // add history combo box
    this.history_combo_box=new Ext.form.ComboBox({ 
      width: 300,
      resizable: true, 
      store: this.grid.history_store, mode: 'local',triggerAction:'all',
      displayField: 'path'
    });
    this.topToolbar.push('-',this.history_combo_box);
    
    this.addEvents(
      'RURI_changed'
    );
    
    this.on('render', function(comp) {
      /*
      this.getEl().mask("I am masked!"+this.id+":"
        +this.getEl().getWidth()+"+"+this.getEl().getHeight()+"|||"
        +this.body.getBox().x+"+"+this.body.getBox().y+"+"+this.body.getBox().width+"+"+this.body.getBox().height
      );
      */
      if (this.initRURI)
        this.setRURI(this.initRURI);
    }, this);
    
  },
  
  // private
  initEvents : function(){
    RODS.BrowserPanel.superclass.initEvents.call(this);
    
    this.grid.on('RURI_changed', function(ruri){
      if (this.history_combo_box)
      {
        var path;
        if (ruri.indexOf('/')>0)
          path=ruri.substr(ruri.indexOf('/'));
        else
          path='/';
        this.history_combo_box.setValue(path);
      }
      this.tree.setRURI(ruri);
      this.RURIChangeHandler(ruri);
    },this);
    
    this.tree.on('RURI_changed', function(ruri){
      this.setRURI(ruri);
    },this);
    
    // handle the path combo box when 'enter' is pressed
    if (this.history_combo_box)
    {
      this.history_combo_box.on('specialkey', function(this_combobox, evnt){
        if (evnt.getKey()==Ext.EventObject.ENTER)
        {
          var new_value=this_combobox.getValue();
          
          if (new_value.indexOf('/')!=0)
          {
            this_combobox.markInvalid('Invalid Path');
            return;
          }  
          var acct_uri=MyPref.activeAccount.toIdentifier();
          if (new_value=='/') // if root, the the path is '/', special case here...
            this.setRURI(acct_uri);
          else
            this.setRURI(acct_uri+new_value);
        }
      },this);
    
      // handle the path combo box when a value is selected
      this.history_combo_box.on('select', function(this_combobox, record, indx){
        if (record.get('path')=='/') // if root, the the path is '/', special case here...
          this.setRURI(''+record.get('acct_uri'));
        else
          this.setRURI(''+record.get('acct_uri')+record.get('path'));
      },this);
    }
  },
  
  setRURI : function(ruri){
    try {
      
      if ( (this.ruri)&&(this.ruri==ruri) )
        return;
      
      this.grid.setRURI(ruri); 
      this.tree.setRURI(ruri); 
      
      this.setTitle('irods://'+ruri);
      
      AddLog('Changed to irods://'+ruri);
    } catch (err) {
      
      errorShow(err);
    }
  },
  
  getRURI : function(){
    return (this.ruri)?this.ruri:'';
  },
  
  folderup : function()
  {
    // do nothing if current uri isn't yet set
    if (this.ruri.length<3) return;
    
    var indexof_firstslash=this.ruri.indexOf('/');
    var indexof_lastslash=this.ruri.lastIndexOf('/');
    //if ((indexof_firstslash<0)||(indexof_firstslash==indexof_lastslash)) return;
    if (indexof_firstslash<0) return;
    if (this.ruri.length<=1) return;
    var new_ruri=this.ruri.substr(0,indexof_lastslash);
    this.setRURI(new_ruri);
    
  },
  
  underAccount : function (acct){
    if (!this.ruri)
      return false;
    var curacct=ruri2Account('irods://'+this.ruri);
    if (curacct.equals(acct))
      return true;
    return false;
  },
  
  RURIChangeHandler : function (ruri){
    if ( (this.ruri)&&(this.ruri==ruri) )
      return;
    this.ruri=ruri;
    this.fireEvent('RURI_changed', ruri);
  },
  
  setStatusText : function(txt)
  {
    this.grid.setStatusText(txt);
  },
  
  resetStatusText : function ()
  {
    this.grid.resetStatusText();
  },
  
  addRODSItems : function (collstats)
  {
    for (var i=0; i<collstats.length; i++)
    {
      this.addRODSItem(collstats[i]);
    }
  },
  
  addRODSItem : function (collstats)
  {
    this.grid.addRODSItem(collstats);  
    if (collstats['type']<1) // only add to tree if its a collection
      this.tree.addRODSItem(collstats['ruri']);
  },
  
  removeRODSItems : function (ruris)
  {
    for (var i=0; i<ruris.length; i++)
    {
      this.removeRODSItem(ruris[i]);
    }
  },
  
  removeRODSItem : function (ruris)
  {
    this.grid.removeRODSItem(ruris);  
    this.tree.removeRODSItem(ruris);
  }
});

Ext.reg('rodsbrowser', RODS.BrowserPanel);
