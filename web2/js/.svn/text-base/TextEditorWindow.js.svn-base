TextEditorWindow = function(config){
  
  if (!config)
      config={};
  
  var default_conf={
    stateful: false,
    monitorResize: true,
    bodyBorder: false,
    border: false,
    //cls: 'x-window-dlg',
    layout: 'fit',
    items: [
      { xtype: 'panel', html : 'Loading file...', 
        bodyBorder : false, border: false,
        bodyStyle: 'background: transparent none repeat scroll 0 0; '+
          'font-size=14; text-align: center; vertical-align: middle;'
      }
    ],
    
    bbar : new Ext.StatusBar({
      defaultText: 'ready',
      busyText: 'saving...', 
      statusAlign: 'right',
      items : [
      {    
        text: 'Save',
        scope: this,
        cls: 'x-btn-text-icon',
        iconCls: 'z-save-button-icon',
        tooltip: 'Save changes',
        //disabled: true, 
        handler: function (button, evnt){  
          if (!this.textbox.isDirty())
            return;
          
          this.savedText=this.textbox.getValue();
            
          this.botbar.showBusy();
          this.saveButton.disable();
          this.resetButton.disable();
          
          var req=new RODS.Requests();
          req.writeFile({ ruri:this.ruri, filestr: this.savedText, scope: this,
            callback: function(){
              this.botbar.clearStatus(); 
              this.saveButton.enable();
              this.resetButton.enable(); 
              this.textbox.originalValue=this.savedText;
            }
          }); 
        }
      }, '-',
      {    
        text: 'Reset',
        scope: this,
        tooltip: 'Undo all changes after last save',
        //disabled: true,
        handler: function (button, evnt){  
          if (this.textbox)
            this.textbox.reset();
        }
      } 
      ]
    })
  };
  Ext.applyIf(config, default_conf);
  TextEditorWindow.superclass.constructor.call(this, config);
    
};

Ext.extend(TextEditorWindow, Ext.Window, {  
  initComponent : function(){
    TextEditorWindow.superclass.initComponent.call(this);
    this.on('render', function(){
      this.botbar=this.getBottomToolbar();
      this.saveButton=this.getBottomToolbar().items.get(0);
      this.resetButton=this.getBottomToolbar().items.get(2);
    }, this);
    
  },
  
  showFile : function(ruri){
    this.ruri=ruri;
    var req=new RODS.Requests();
    req.readFile({
      ruri: ruri,
      scope: this,
      callback: function(str){
        this.textbox=new Ext.form.TextArea({
          xtype: 'textarea',  
          value : str,
          enableKeyEvents: true,
          hideLabel: true,
          autocomplete: "off", //this is a work-around for a extjs/ff3 bug(?). 'Permission denied to get property HTMLDivElement.nodeType'
          anchor: '100% 100%'
        });
        
        this.remove(this.getComponent(0)); //remove the loading panel
        this.add(this.textbox);
        this.doLayout();
        var filename=ruri.substr(ruri.lastIndexOf('/')+1);
        this.setTitle(filename);
        this.edited=false;
      },
      callback_err: function(error_response){
        var loading_el=this.getComponent(0).getEl();
        loading_el.update('Loading failed! <br/> <pre>'+error_response+'</pre>');  
      }
    });
    this.show();
  }
});

Ext.reg('texteditor', TextEditorWindow);