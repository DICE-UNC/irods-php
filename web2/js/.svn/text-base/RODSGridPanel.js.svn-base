// pluggable renders
function renderName(value, p, record){
  if (record.data['type']==0) 
    return String.format(
      '<span class="x-grid-col-objtype-dir">{0}</span>', value);
  else
  if (record.data['type']==1)
    return String.format(
      '<span class="x-grid-col-objtype-generic-file">{0}</span>', value);
  else
    return value;
}

function renderFmtSize(value,p,record){
  if ( (!value)||(value<0) )
    return '';
    
  var rawSize=value;
  if (rawSize / 1099511627776 > 1) 
    return Math.round(rawSize*100/1099511627776)/100 + ' TB';
  else if (rawSize / 1073741824 > 1) 
    return Math.round(rawSize*100/1073741824)/100 + ' GB';  
  else 
  if (rawSize / 1048576 > 1) 
    return Math.round(rawSize*100/1048576)/100 + ' MB'; 
  else if (rawSize / 1024 > 1) 
    return Math.round(rawSize*100/1024)/100 + ' KB'; 
  else 
    return rawSize + ' B ';
}

function renderTime(value){
  try {
    return value.dateFormat('F j, Y, g:i a');
  } catch (e) {
    return 'Invalid Time';
  }
}

function jsonErrorResponseHandler(conn, r, options) {
  
  try {
    var response = Ext.util.JSON.decode(r.responseText);
  	if (response && response.success == false) {
  		alert("Error: "+ responseText);
  	}
  } catch (e) {
    alert("Invalid server response:"+r.responseText+'<br/>Exception:'+e);
  }   
	
}

// Create user extensions namespace (Ext.ux)
Ext.namespace('RODS');

var RURIHistoryRecord=Ext.data.Record.create([
      {name: 'acct_uri', mapping: 'acct_uri'},
      {name: 'path', mapping: 'path'}
]);

RODS.GridPanel = function(cfg){
    //this.initComponent(cfg);
    
    if (!cfg)
    {
      cfg = {};
    }
    
    var def_sel_model=new Ext.grid.RowSelectionModel({
        singleSelect:false
    });
    
    this.store=this.createDataStore();
    
    var default_config = {
      store : this.store,
      loadMask: true,
      autoExpandColumn: 'dir_grid_col_name',
      bodyBorder : false,
      hideBorders : true,
      sm : def_sel_model,
      cm : new Ext.grid.ColumnModel([
          //def_sel_model,
          {  
             id: "dir_grid_col_name",
             header: "Name",
             dataIndex: 'name',
             width: 500,
             sortable: true,
             renderer: function(value,metadata,record,rowIndex,colIndex,store)
             {
               if (record.get('type')<1) // if a dir
               {
                 var shortname=value.substr(value.lastIndexOf('/')+1);
                 return '<div class="z-detailed z-folder-small">'+shortname+'</div>';
               }  
               else
                 return '<div class="z-detailed z-resource_unknown-small">'+value+'</div>';
             }
          },{
             header: "Owner",
             dataIndex: 'owner',
             width: 100,
             hidden: true,
             sortable: true
          },{
             header: "Resource",
             dataIndex: 'rescname',
             width: 100,
             hidden: true 
          },{
             header: "Type",
             dataIndex: 'typename',
             width: 100,
             hidden: true,
             sortable: true      
          },{
             header: "Size",
             dataIndex: 'size',
             width: 100,
             renderer: renderFmtSize,
             align: 'right',
             sortable: true
           },{
             header: "Date Created",
             dataIndex: 'ctime',
             width: 200,
             renderer: renderTime,
             align: 'right',
             hidden: true,
             sortable: true   
          },{
             header: "Date Modified",
             dataIndex: 'mtime',
             width: 200,
             renderer: renderTime,
             align: 'right',
             sortable: true
      }]),
      viewConfig : {
        forceFit: true,
        rowstyle: 'detailed',
        getRowClass: function(record, index, rowParams, ds)
        {
          if (this.rowstyle!='detailed')
            return 'z-item z-resource-default'; 
          /*
          else
          {
            if (record.get('type')<1)
              return 'z-detailed z-folder-small';
            else
              return 'z-detailed z-resource_unknown-small';  
          } 
          */ 
        }
      },
      
      /*
      bbar : new Ext.PagingToolbar({
        pageSize: 100,
        store: this.store,
        displayInfo: true,
        displayMsg: 'Displaying items {0} - {1} of {2}',
        emptyMsg: "This collection is empty",
        items:[
          '-'
        ]
      }),
      */
      
      clicksToEdit : 1,  
      stripeRows : true
    };
    
    Ext.applyIf(cfg, default_config);
      
    RODS.GridPanel.superclass.constructor.call(this,cfg);
    
    if (cfg.ruri)
      this.setRURI(cfg.ruri);  
}

//Ext.extend(Ext.rods.RODSGridPanel, Ext.grid.EditorGridPanel, {
Ext.extend(RODS.GridPanel, Ext.grid.GridPanel, {  
  ruri: '',
  // private
  initComponent : function(cfg)
  {
    // note that this bbar really should be in the config file, but it caused
    // layout problem for the entire page.
    // only work-around for this is to delay the render time of it.
    // The issue is also discussed here: http://extjs.com/forum/showthread.php?p=132092
    this.bbar= new Ext.PagingToolbar({
        pageSize: 100,
        store: this.store,
        displayInfo: true,
        displayMsg: 'Displaying items {0} - {1} of {2}',
        emptyMsg: "This collection is empty",
        items:[
          '-'
        ]
    });
    RODS.GridPanel.superclass.initComponent.call(this); 
    
    this.history_store=new Ext.data.SimpleStore({
      //mode: 'local',
      id : 0,
      fields: ['acct_uri', 'path'],
      data: []
    });
  },
  
  // private
  initEvents : function(){
    RODS.GridPanel.superclass.initEvents.call(this);
    this.addEvents(
      'RURI_changed'
    );
    
    this.on({
      'rowdblclick': {
        fn: function(grid, rowIndex, evnt) {
          var record = grid.getStore().getAt(rowIndex);  // Get the Record
          var itemtype= record.get('type');
          
          if (itemtype==0) // a diretory is double clicked, then change uri
            grid.setRURI(record.get('ruri'));
          else
          if (itemtype>0) // a file
          {
            AppMgr.showFile(record.get('ruri'), this.parentCont);
          }
          else
            throw('RODS.GridPanel: a row is dblclicked with undefined itemtype: '+itemtype);
        },
        scope: this
      }  
    });
  },
  
  createDataStore : function()
  {
    this.recordConstructor=new Ext.data.Record.create([
            {name: 'name', mapping: 'name'},
            {name: 'owner', mapping: 'owner'},
            {name: 'rescname', mapping: 'rescname'},
            {name: 'ruri', mapping: 'ruri'},
            {name: 'size', mapping: 'size', type: 'int'},
            {name: 'type', mapping: 'type'},
            {name: 'typename', mapping: 'typename'},
            {name: 'ctime', mapping: 'ctime', type: 'date', dateFormat: 'timestamp'},
            {name: 'mtime', mapping: 'mtime', type: 'date', dateFormat: 'timestamp'}
        ]);
    // create the Data Store
    var coll_list_data = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'services/dir_grid.php'
        }),
        
        // create reader that reads the Topic records
        reader: new Ext.data.JsonReader({
            successProperty: 'success',
            root: 'que_results',
            totalProperty: 'totalCount',
            id: 'id'
        }, this.recordConstructor),

        sortInfo:{field:'name', direction:'ASC'},
        remoteSort: true
    });
    //coll_list_data.setDefaultSort('mtime', 'desc'); 
    
    coll_list_data.on('beforeload', function(store, options) {
      if (!store.baseParams.ruri) 
      {
        Ext.msg.alert('error', 'RURI not defined in base param');
      }
      options['requested_ruri']=store.baseParams.ruri;
    });
    
    // following line if causing problems
    //coll_list_data.proxy.getConnection().on('requestcomplete', jsonErrorResponseHandler);
    
    return coll_list_data;
  },
  
  getView : function(){
    if(!this.view){
        this.view = new RODS.GridView(this.viewConfig);
    }
    return this.view;
  },
  
  setRURI : function(ruri)
  {
    if (this.ruri==ruri)
      return;
    if (ruri.length<1)
      return;
    
    if (this.loading){ // if an async load is already running, waiting til it's done
      var timer;
      var f = function(){
        if(!this.loading){ // done loading
          clearInterval(timer);
          this.setRURI(ruri);
        }
      }.createDelegate(this);;
      timer = setInterval(f, 200);
      return;
    }
    
    this.loading=true;
    
    this.store.baseParams = {'ruri': ruri};
    this.store.load({
      // handler after store is loaded
      callback: function(records, options, success){
        if (success===true)
        {
          var ruri=options['requested_ruri'];
          this.ruri=ruri;
          this.fireEvent('RURI_changed', ruri);
          this.updateURIHistory(ruri);
          document.title='irods://'+this.ruri;
        }
        this.loading=false;
      },
      scope: this
    });
  },
  
  updateURIHistory: function(ruri)
  {
    var acct_uri, path, old_acct_uri;
    var index_of_slash=ruri.indexOf('/');
    if (index_of_slash<0) 
    {
      if (ruri.length>3) //special case for root here
      {
        acct_uri=ruri;
        path='/';
      }
      else
        return;
    }
    else
    {
      acct_uri=ruri.substr(0,index_of_slash);
      path=ruri.substr(index_of_slash);
    }
    
    if (this.ruri.indexOf('/')>0)
      old_acct_uri=this.ruri.substr(0,this.ruri.indexOf('/'));
    else // special case for root here...
      old_acct_uri=this.ruri;
      
    if (acct_uri!=old_acct_uri) // clear history if swap accounts
    {
      this.history_store.removeAll();
    }
    this.history_store.add(new Ext.data.Record({acct_uri:acct_uri,path:path}));
  },
  
  setStatusText : function (txt, type)
  {
    var el=this.getBottomToolbar().displayEl;
    if (!el) return;
    el.update(txt);
  },
  
  resetStatusText : function ()
  {
    this.getBottomToolbar().updateInfo();
  },
  
  onContextMenu : function(e){
    e.preventDefault();
    if(!this.menu){ // create context menu on first right click
        this.menu = new Ext.menu.Menu({
            listeners : {
              'show' : { // auto disable/enable action items, if there are selection(s)
                scope : this,
                fn : function(menu) { 
                  this.parentCont.setActionsDisabled();
                }
              }
            },
            items: [
              this.parentCont.actions['bulk_download'],
              this.parentCont.actions['rm']
            ]
        });
    }
    this.menu.showAt(e.getXY());    
  },
  
  removeRODSItem : function (ruri) {
    var index=this.store.findBy(function(rec,i){
      return (rec.get('ruri')==ruri);
    });
    if (index>=0)
      this.store.remove(this.store.getAt(index));
  },
  
  addRODSItem : function(collstats)
  {
    // if it's already in the store, stop.
    var index=this.store.findBy(function(rec,i){
      return (rec.get('name')==collstats['name']);
    });
    if (index>=0 )
      return;
    
    var record=new Ext.data.Record({
      'name' : collstats['name'],
      'rescname' : collstats['rescname'],
      'ruri' : collstats['ruri'],
      'size' : parseInt(collstats['size'], 10),
      'type' : collstats['type'],
      'typename' : collstats['typename'],
      'ctime' : new Date(parseInt(collstats['ctime'], 10)*1000),
      'mtime' : new Date(parseInt(collstats['mtime'], 10)*1000)
    });
    
    this.store.insert(0,[record]);
  }
});

Ext.reg('rodsgrid', RODS.GridPanel);
