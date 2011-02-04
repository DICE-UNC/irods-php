// Create user extensions namespace (Ext.ux)
Ext.namespace('RODS');

RODS.AppWindow = function(config){
    if (!config)
      config={};
    var default_conf={
      stateful: false,
      closable: true,
      collapsible: true,
      maximizable: true,
      constrainHeader : true
    };
      
    Ext.applyIf(config, default_conf);
    RODS.AppWindow.superclass.constructor.call(this, config);
    
};

Ext.extend(RODS.AppWindow, Ext.Window, {  
  
});

Ext.reg('rodsapp', RODS.AppWindow);