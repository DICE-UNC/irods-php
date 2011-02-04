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
      
      this.grid=new RODS.GridPanel({
                    region : 'center'
                });
      
      viewport = new Ext.Viewport({
        layout:'border',
        items:[
          new Ext.BoxComponent({ // raw
              region:'north',
              el: 'north',
              height:32
          }),{
              region:'west',
              el: 'west',
              id:'west-panel',
              title:'Collections',
              split:true,
              width: 200,
              minSize: 175,
              maxSize: 400,
              collapsible: true,
              margins:'0 0 0 5'
              
              
          },
          /*
          { // raw
              region:'center',
              el: 'center',
              title:'Center'
          }
          */
          this.grid
        ]
      
      });
      
      this.grid.setRURI("rods:RODS@rt.sdsc.edu:1247/tempZone/home/rods");  
    } // end of init
    
  }
}