// Create user extensions namespace (Ext.ux)
Ext.namespace('RODS');


RODS.LogGridPanel = function(cfg){
    //this.initComponent(cfg);
    
    if (!cfg)
    {
      cfg = {};
    }
    
    this.store=new Ext.data.SimpleStore({
      remoteSort: false,
      fields:[
        {name: 'time', type: 'date', dateFormat: 'timestamp'},
        {name: 'log'},
        {name: 'type'}
      ]
    });
    var default_config = {
      store : this.store,
      bodyBorder : false,
      hideBorders : true,
      autoExpandColumn: 'log',
      cm : new Ext.grid.ColumnModel([
          {
            id: 'log',
            header: "Log",
            dataIndex: 'log',
            width: 300,
            hidden: false,
            renderer: function (value){
              return '<span style="white-space:normal;">'+value+'</span>';
            },
            sortable: false
          },{
            header: "Time Stamp",
            dataIndex: 'time',
            width: 200,
            renderer: function (value){
              //return value;
              try {
                return value.dateFormat('F j, Y, g:i:s:u a');
              } catch (e) {
                return value;
              }
            },
            //align: 'right',
            hidden: false,
           sortable: true   
         }
      ]),
      tbar : [    
        {
          text: 'Clear',
          handler: function(){
            this.store.removeAll();  
          },
          scope: this
        }
      ],    
      viewConfig : {
        forceFit: true,
        emptyText: 'No logs to display'
      },
      iconCls : 'icon-grid',
      stripeRows : true
    };
    
    Ext.applyIf(cfg, default_config);
      
    RODS.LogGridPanel.superclass.constructor.call(this,cfg);
}

//Ext.extend(Ext.rods.RODSGridPanel, Ext.grid.EditorGridPanel, {
Ext.extend(RODS.LogGridPanel, Ext.grid.GridPanel, {  
  // private
  initComponent : function(cfg)
  {
     RODS.LogGridPanel.superclass.initComponent.call(this); 
     
  },
  
  // private
  initEvents : function(){
    RODS.LogGridPanel.superclass.initEvents.call(this);
  },
  
  addLog : function(log, type)
  {
    if (!type)
      type='Notice';
    this.store.insert(0, new Ext.data.Record({
      //time: Math.round(new Date().getTime()/1000.0),
      time: new Date(),
      log: log,
      type: type
    }));
  }    
});
Ext.reg('loggrid', RODS.LogGridPanel);