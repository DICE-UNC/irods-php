// Create user extensions namespace (Ext.ux)
Ext.namespace('RODS');

RODS.BrowserPanel = function(config){
    this.grid = new RODS.GridPanel({region: 'center'});
    this.tree = new RODS.TreePanel({
            title: 'Collections',
            region:'west',
            split:true,
            collapsible: true,
            //margins: '5 0 0 5',
            //cmargins: '5 5 0 5',
            width: 200,
            minSize: 100,
            maxSize: 300
    });
    
    var history_combo_box=new Ext.form.ComboBox({ 
      width: 400, store: this.grid.history_store, mode: 'local',triggerAction:'all',
      displayField: 'path'
    });
    var default_conf={
      layout : 'border',
      history_combo_box: history_combo_box,
      tbar   : [
        { cls: 'x-btn-icon', iconCls: 'z-folder-up-button-icon', 
          handler: function(){
            this.grid.folderup();
          }, scope:this, tooltip: 'Go to parent collection'
        },
        '-',
        history_combo_box
      ],
      items :
      [
          this.tree,
          this.grid
      ] 
    };
    Ext.applyIf(config, default_conf);
    Ext.apply(this, config);
    
    RODS.BrowserPanel.superclass.constructor.call(this);
    
};


//Ext.extend(RODS.BrowserPanel, Ext.Panel, {
Ext.extend(RODS.BrowserPanel, Ext.Window, {  
  // private
  initEvents : function(){
    RODS.BrowserPanel.superclass.initEvents.call(this);
    
    this.addEvents(
      'RURI_changed'
    );
    
    this.grid.on('RURI_changed', function(ruri){
      this.history_combo_box.setValue(ruri.substr(ruri.indexOf('/')));
      this.tree.setRURI(ruri);
      this.RURIChangeHandler(ruri);
    },this);
    
    this.tree.on('RURI_changed', function(ruri){
      this.setRURI(ruri);
    },this);
    
    // handle the path combo box when 'enter' is pressed
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
        this.setRURI(acct_uri+new_value);
      }
    },this);
    
    // handle the path combo box when a value is selected
    this.history_combo_box.on('select', function(this_combobox, record, indx){
      this.setRURI(''+record.get('acct_uri')+record.get('path'));
    },this);
  },
  
  setRURI : function(ruri){
    try {
      
      if ( (this.ruri)&&(this.ruri==ruri) )
        return;
      
      this.grid.setRURI(ruri); 
      this.tree.setRURI(ruri); 
      AddLog('Changed to irods://'+ruri);
    } catch (err) {
      
      errorShow(err);
    }
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
  }
});

Ext.reg('rodsbrowser', RODS.BrowserPanel);