ImageViewerWindow = function(config){
  
  var img, imgReady=false;
  
  if (!config)
      config={};
  
  var default_conf={
    stateful: false,
    monitorResize: true,
    bodyBorder: false,
    closeable: true,
    maximizable: true, 
    //bodyStyle: 'background: black;',
    border: false,
    layout: 'card',
    activeItem: 0, 
    items: [
      {
        // loading box
        bodyStyle: 'background: transparent; text-align: center; display: table-cell; vertical-align: middle',
        html: 'Loading image...'
      }, {
        // image box
        bodyStyle: 'background: black; cursor:pointer;',
        html: ''
      }, {
        // error box
        bodyStyle: 'background: transparent; text-align: center; display: table-cell; vertical-align: middle;',
        html: ''
      }
    ],      
    
    bbar : [
      {    
        scope: this,
        cls: 'x-btn-icon',
        iconCls: 'z-resultset-previous-button-icon',
        tooltip: 'Previous image',
        disabled: true, 
        handler: function (button, evnt){  
          this.preImage();
        }
      }, {    
        scope: this,
        cls: 'x-btn-icon',
        iconCls: 'z-resultset-next-button-icon',
        tooltip: 'Next image',
        disabled: true, 
        handler: function (button, evnt){  
          this.nextImage();
        }
      }
    ]
    
  };
  
  Ext.applyIf(config, default_conf);
  ImageViewerWindow.superclass.constructor.call(this, config);
  
};

Ext.extend(ImageViewerWindow, Ext.Window, {  
  
  initComponent : function(){
    ImageViewerWindow.superclass.initComponent.call(this);
    this.on('render', function(){
      
      //load playlist
      this.getImagePlaylist();
      
      //render image
      this.updateTitle();
      this.renderImage();
      
      this.botbar=this.getBottomToolbar();
      this.preButton=this.getBottomToolbar().items.get(0);
      this.nextButton=this.getBottomToolbar().items.get(1);
      
    }, this);
    
    this.on('show', function(){
      this.getComponent(1).body.on('click', function(){
        this.nextImage(); 
      },this);
    },this);
    
    
    this.on('resize', function(){
      if (this.imgReady)
        this.fitImage(); 
    },this);
    
  },
  
  
  
  preImage : function(){
    if ( (!this.playlist) || (this.playlist.length < 2) )
      return;
    
    var pre_index= (this.cur_file_index + this.playlist.length -1 ) % (this.playlist.length);
    this.cur_file_index=pre_index;
    this.ruri=this.playlist[this.cur_file_index];
    this.updateTitle();
    this.renderImage();
  },
  
  nextImage : function(){
    if ( (!this.playlist) || (this.playlist.length < 2) )
      return;
      
    var next_index= (this.cur_file_index + 1) % (this.playlist.length);
    this.cur_file_index=next_index;
    this.ruri=this.playlist[this.cur_file_index];
    this.updateTitle();
    this.renderImage();
  },
  
  renderImage : function() {
      img=new Image();
      img.onload=function(){
        img.viewer.imageOnload(img);
      }
      img.onerror=function(){
        img.viewer.imageOnError(img);
      }
      img.viewer=this;
      
      img.src = GetRODSProxyURL(this.ruri);
      
      /*
      var currenturl=location.protocol+'//'+location.host+location.pathname;
    var currenturlpath=currenturl.substring(0,currenturl.lastIndexOf('/'));
    var proxy_url=currenturlpath+'/rodsproxy/'+this.ruri;
    img.src = proxy_url;
    */
  },
  
  updateTitle : function() {
    var name=this.ruri.substr(this.ruri.lastIndexOf('/')+1);
    this.setTitle(name); //+' ('+img.width +' x '+img.height+')');
    
  },
  
  imageOnload : function(img)
  {
    this.getLayout().setActiveItem(1);
    if (this.imageEl)
      this.imageEl.remove();
    this.imageEl=this.getComponent(1).body.createChild({tag:'img', src:img.src});
    this.imageEl.applyStyles('display: block; margin-left: auto; margin-right: auto;');
    this.fitImage();
    this.imgReady=true;
  },
  
  imageOnError : function(img)
  {
    this.getLayout().setActiveItem(2);
    this.errorEl=this.getComponent(2).body.dom.innerHTML=('Error: could not display image, you might not have permission for this file.'+
     '<br/> <a target="_blank" href="'+img.src+'"> file link </a>');
  },
  
  fitImage : function()
  {
    var mywidth, myheight;
    var imgratio=img.width/img.height;
    var bwidth=this.getInnerWidth();
    var bheight=this.getInnerHeight();
    
    if ( (img.height > bheight) && (img.width > bwidth) )
    { // if both height and width are too large, pick the smaller one as default
      if ( (img.width/bwidth) > (img.height/bheight) )
      {
        mywidth=bwidth-20;
        myheight= Math.round(img.height*(mywidth/img.width));
      }
      else
      {
        myheight=bheight-20;
        mywidth= Math.round(img.width*(myheight/img.height));
      }
    }
    else
    if (img.height > bheight)
    {
      myheight=bheight-20;
      mywidth= Math.round(img.width*(myheight/img.height));    
    }
    else
    if (img.width > bwidth)
    {
      mywidth=bwidth-20;
      myheight= Math.round(img.height*(mywidth/img.width));
    }
    else
    {
      mywidth=img.width;
      myheight=img.height
    }
    this.imageEl.setWidth(mywidth, false);
    this.imageEl.setHeight(myheight, false);
    
    // vertically align image
    var margin_top= (myheight<bheight)?Math.round((bheight-myheight)/2):0;
    this.imageEl.setStyle('margin-top',margin_top+'px');
    
  },
  
  getImagePlaylist : function(){
    var req=new RODS.Requests();
    req.getImagePlaylist({
      ruri: this.ruri,
      scope: this,
      callback: function(que_results){
        this.playlist=que_results['list'];  
        this.cur_file_index=que_results['cur_file_index'];
        if (this.playlist.length > 1)
        {
          this.preButton.enable();
          this.nextButton.enable();
        }
      }
    });
  }
});

Ext.reg('imageviewer', ImageViewerWindow);