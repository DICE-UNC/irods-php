// Create user extensions namespace (Ext.ux)
Ext.namespace('RODS');

RODS.TreeNode = function(cfg){
  if (!cfg) cfg = {};
  var default_config = {
    
  };
  Ext.applyIf(cfg, default_config);
  this.loaded = false;
  this.loading = false;
  
  RODS.TreeNode.superclass.constructor.call(this,cfg);
  /**
  * @event beforeload
  * Fires before this node is loaded, return false to cancel
  * @param {Node} this This node
  */
  this.addEvents('beforeload', 'load', 'loadfailed');
  /**
  * @event load
  * Fires when this node is loaded
  * @param {Node} this This node
  */
}

Ext.extend(RODS.TreeNode, Ext.tree.TreeNode, {
  start_index: 0,
  limit: 20,
  total_child_count: 0,
  viewmore_child_node: null, 
  
  hasChildNodes : function(){ //overwrite parent method, always return false cause all
                              //nodes have children potentialy.
    return true;
  },
  
  appendChildByName : function (child_name)
  {
    var cnode;
    // nothing needed if child is already added
    if (cnode=this.findChild('name',child_name))
      return cnode;
      
    cnode=new RODS.TreeNode({text:child_name, 
      id:this.id+'/'+child_name,
      cls: 'folder',
      name: child_name
    });
    
    if (this.viewmore_child_node)
    {
      this.insertBefore(cnode,this.viewmore_child_node);
    }
    else
    {
      this.appendChild(cnode);
    }
    this.updateViewMoreChildNode();
    return cnode;
  },
  
  updateViewMoreChildNode : function()
  {
    if (this.total_child_count<=0) 
      return;
      
    if (this.viewmore_child_node) // if viewmore_child_node is already rendered
    {
      var num_child_rendered=this.childNodes.length-1;
      //update the viewmore_child_node if there are nodes to be viewed
      if (num_child_rendered<this.total_child_count) 
      {
        this.viewmore_child_node.setText('<b>'+
          (this.total_child_count-num_child_rendered)+
          '</b> more collections ...');
      }
      // remove the viewmore_child_node, if there is no more node
      else
      {
        this.viewmore_child_node.remove();
        this.viewmore_child_node=null;
      }
    }
    else
    {
      var num_child_rendered=this.childNodes.length;
      //create the viewmore_child_node if there are nodes to be viewed
      if (num_child_rendered<this.total_child_count)
      {
        this.viewmore_child_node=new Ext.tree.TreeNode({
          text: '<b>'+
            (this.total_child_count-num_child_rendered)+
            '</b> more collections ...',
          allowChildren: false,
          iconCls: "z-folder-go-button-icon",
          listeners:{
            'click' : {
              fn: function (thisnode, evnt) {
                if (thisnode.parentNode)
                  thisnode.parentNode.getMoreChildren();
              }
            }
          }
        });
        this.appendChild(this.viewmore_child_node);
      }
    }
  },
  
  appendRequestedChildren : function (children, total_count)
  {
    if ( (total_count!=null)&&(total_count> this.total_child_count) ) //update total count 
      this.total_child_count=total_count;
    
    if (this.viewmore_child_node)
    {
      this.viewmore_child_node.remove();
      this.viewmore_child_node=null;
    }
    for(var i = 0, len = children.length; i < len; i++){
        var curnode;
        curnode=this.findChild('name',children[i]['name']);
        if (!curnode)
        {
          curnode = new RODS.TreeNode(children[i]);
          if(curnode){
            this.appendChild(curnode);
          }
        }
    }
    
    this.start_index=this.start_index+children.length;
    this.updateViewMoreChildNode();
  }, // end of function appendRequestedChildren
  
  getMoreChildren : function(deep, anim, callback)
  {
    if (this.childNodes.length >= this.total_child_count)
    {
      throw new GeneralError("Logic error, there should be no more children left");
    }
    
    if(this.loading){ // if an async load is already running, waiting til it's done
      var timer;
      var f = function(){
        if(!this.loading){ // done loading
          clearInterval(timer);
          this.getMoreChildren(deep, anim, callback);
        }
      }.createDelegate(this);
      timer = setInterval(f, 200);
      return;
    }
    
    if(this.fireEvent("beforeload", this) === false){
        return;
    }
    this.loading = true;
    this.ui.beforeLoad(this);
    
    this.load(this.loadComplete.createDelegate(this, [deep, anim, callback]));
    
  },
  
  expandLoad : function(deep, anim, callback){
    if(this.loading){ // if an async load is already running, waiting til it's done
        var timer;
        var f = function(){
            if(!this.loading){ // done loading
                clearInterval(timer);
                this.expand(deep, anim, callback);
            }
        }.createDelegate(this);
        timer = setInterval(f, 200);
        return;
    }
    if(!this.loaded){
        if(this.fireEvent("beforeload", this) === false){
            return;
        }
        this.loading = true;
        this.ui.beforeLoad(this);
        this.select();
        this.load(this.loadComplete.createDelegate(this, [deep, anim, callback]));
        return;
        
    }
    RODS.TreeNode.superclass.expand.call(this, deep, anim, callback);
  },
  
  loadComplete : function(deep, anim, callback){
        this.loading = false;
        this.loaded = true;
        this.ui.afterLoad(this);
        this.fireEvent("load", this);
        this.expand(deep, anim, callback);
  },
  
  loadFailed : function(){
        this.loading = false;
        this.loaded = false;
        this.ui.afterLoad(this);
        this.ui.addClass('x-tree-node-error');
        this.fireEvent("loadfailed", this);
  },
  
  load : function (callback)
  {
    var ruri=this.id;
    this.transId = Ext.Ajax.request({
      url: "services/dir_tree.php",
        success : this.responseHandler,
        failure: function(response, options){
          this.loading=false;
          throw new HTTPConnError(response);  
        },
        scope: this,
        argument: {ruri: ruri, callback: callback},
        params: {ruri: ruri, start: this.start_index, limit: this.limit}
      });  
  },
  
  responseHandler : function (response, options)
  {
    var json = response.responseText;
    try {
      var o = eval("("+json+")");
      if (o.success!==true)
        throw new RODSError(o.errcode, o.errmsg);
      
      
      this.appendRequestedChildren(o.children, o.total_count);
      this.loaded=true;
      
      if (typeof response.argument.callback == "function")
        response.argument.callback(this);
    
    }catch(err){
      this.loadFailed();
      if (!err.isRBError)
        err= new JsonParseError(err.message+": \n <p>"+json+"</p>");
      errorShow(err);
    }   
  },
  
  reload : function(callback)
  {
    this.start_index=0;
    this.total_child_count=0;
    this.viewmore_child_node=null;
    
    this.collapse(false, false);
    while(this.firstChild){
        this.removeChild(this.firstChild);
    }
    this.childrenRendered = false;
    this.loaded = false;
    if(this.isHiddenRoot()){
        this.expanded = false;
    }
    this.expandLoad(false, false, callback);
  },
  
  beforeLoad : function()
  {
    this.ui.beforeload();
  },
  
  afterLoad : function()
  {
    this.ui.afterload();
  }
});

RODS.TreePanel = function(cfg){
    //this.initComponent(cfg);
    
    if (!cfg)
    {
      cfg = {};
    }
    
    var default_config = {
      animate:true, 
      autoScroll:true,
      enableDD:true,
      containerScroll: true,
      dropConfig: {appendOnly:true},
      root: new RODS.TreeNode({text:'Not yet specified', id:''})
    };
    
    Ext.applyIf(cfg, default_config);
      
    RODS.TreePanel.superclass.constructor.call(this,cfg);
    
    if (cfg.ruri)
      this.setRURI(cfg.ruri);  
}

//Ext.extend(Ext.rods.RODSTreePanel, Ext.grid.EditorTreePanel, {
Ext.extend(RODS.TreePanel, Ext.tree.TreePanel, {  
  ruri: '',
  // private
  initComponent : function(cfg)
  {
     RODS.TreePanel.superclass.initComponent.call(this);
  },
  
  // private
  initEvents : function(){
    RODS.TreePanel.superclass.initEvents.call(this);
    this.addEvents(
      'RURI_changed'
    );
    
    this.selModel.on('selectionchange',function(selModel,node) {
      if (node instanceof RODS.TreeNode)
      {
        node.expandLoad(); // only load nodes if user selects it
        this.setRURI(node.id);
      }
    },this);
    
    this.on('contextmenu', this.onContextMenu, this); 
  },
  
  setRootByRURI : function (ruri)
  {
    var index = ruri.indexOf('/');
    var acct_ruri;
    if (index==-1)
      acct_ruri=ruri; 
    else
      acct_ruri=ruri.substr(0,index);
     
    if ( this.root.id!=acct_ruri )
    {
      this.root.id=acct_ruri;
      this.root.attributes={name: acct_ruri};
      this.root.setText(acct_ruri);
      while(this.root.firstChild){
        this.root.removeChild(this.root.firstChild);
      }
    }
  },
  
  setRURI : function(ruri)
  {
    
    if (this.ruri==ruri)
      return;
    if (ruri.length<1)
      return;
    
    // reset the root, if there is an account change  
    this.setRootByRURI(ruri);
      
    var target_node;
    if (target_node=this.getNodeById(ruri)) // if node already exists, then select it
    {
      target_node.select();
      this.ruri=ruri;
      this.fireEvent('RURI_changed', ruri);
    }
    else // if node doesn't exist, try to retreive it, and set path etc.
    {
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
      
      if (this.limit!=this.root.limit)
        this.limit=this.root.limit;
        
      this.transId = Ext.Ajax.request({
        url: "services/dir_tree.php",
          success : this.responseHandler,
          failure: function(response, options){
            this.loading=false;
            throw new HTTPConnError(response);  
          },
          scope: this,
          argument: {ruri: ruri},
          params: {ruri: ruri, start:0, limit:this.limit}
        });
    }  
  },
  
  expandPath : function (path, attr, callback){
    RODS.TreePanel.superclass.expandPath.call(this, '/'+path,attr, callback);
  },
  
  responseHandler : function (response, options)
  {
    var json = response.responseText;
    try {
      var o = eval("("+json+")");
      if (o.success!==true)
        throw new RODSError(o.errcode, o.errmsg);
      var keys = response.argument.ruri.split('/');
      var rootid=keys.shift(); 
      if (rootid!=this.root.id)
        throw new GeneralError("Unexpected iRODS URI:"+response.argument.ruri);
      
      var curkey;
      var curparent=this.root;
      while ( (curkey=keys.shift())!=null )
      {
        curparent=curparent.appendChildByName(curkey);
      }
      curparent.appendRequestedChildren(o.children, o.total_count);
      curparent.loaded=true;
      this.selectPath(response.argument.ruri, 'name');
      this.ruri=response.argument.ruri;
      this.fireEvent('RURI_changed', response.argument.ruri);
      
      this.loading=false;
    }catch(_err){
      errorShow(_err);
    }
  },
  
  onContextMenu : function(node, e){
    if(!this.menu){ // create context menu on first right click
        this.menu = new Ext.menu.Menu({
            items: [{
                id: 'refresh',
                iconCls:'z-refresh-button-icon',
                text:'Refresh',
                scope: this,
                handler:function(){
                  this.ctxNode.reload();
                }
            }]
        });
    }
    
    this.ctxNode = node;
    this.menu.items.get('refresh').setDisabled(!(node instanceof RODS.TreeNode));
    this.menu.showAt(e.getXY());    
  },
  
  removeRODSItem : function(ruri) {
    var node=this.getNodeById(ruri);
    if (node)
      node.remove();
  },

  addRODSItem : function(ruri) {
    if ((!ruri)||(ruri.lastIndexOf('/')<0))
      AddLog("[RODS.TreePanel.addRODSFolder] invalid RURI: "+ruri, "error");
    var parenturi=ruri.substr(0, ruri.lastIndexOf('/'));
    AddLog("parenturi:"+parenturi+" rURI: "+ruri, "error");
    var parent=this.getNodeById(parenturi);
    parent.appendChildByName(ruri.substr(ruri.lastIndexOf('/')+1));
  }
});     
Ext.reg('rodstree', RODS.TreePanel);