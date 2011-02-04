// Create user extensions namespace (Ext.ux)
Ext.namespace('RODS');

RODS.GridView = function(config){
    Ext.apply(this, config);
    // These events are only used internally by the grid components
    /*
    this.addEvents(
	    "beforerowremoved",
	    "beforerowsinserted",
	    "beforerefresh",
	    "rowremoved",
	    "rowsinserted",
	    "rowupdated",
	    "refresh"
	  );
	  */
    RODS.GridView.superclass.constructor.call(this);
};


Ext.extend(RODS.GridView, Ext.grid.GridView, {
  
  rowstyle : 'detailed',
  
  initTemplates : function(){
    RODS.GridView.superclass.initTemplates.call(this);
    
    this.templates.rowTemplates={
      'detailed' : 
        new Ext.Template(
          '<div class="x-grid3-row {alt}" style="{tstyle}">',
            '<table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
              '<tbody><tr>{cells}</tr>',
                (this.enableRowBody ? '<tr class="x-grid3-row-body-tr" style="{bodyStyle}"><td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on"><div class="x-grid3-row-body">{body}</div></td></tr>' : ''),
              '</tbody>',
            '</table>',
          '</div>'
        ),
      'mediumThumbnails' : 
        new Ext.Template(  
          '<div class="x-grid3-row {alt}" style="{tstyle}">',  
            '<div class="z-mediumThumbnails">',
              '<div class="z-icon-area {iconstyle}">',
                '<table cellspacing="0" align="center">',
                  '<tbody><tr><td>',
                    //'<img src="{icon_src}"/>',
                  '</td></tr></tbody>',
                '</table>',
              '</div>',
              '<div class="z-text-area">',
                '<div class="z-text x-grid3-cell x-grid3-td-name">',
                  '<div class="z-name z-action" attribute="name" ',
                    //'onClick="alert(\' I am clicked! \');" ',
                    'command="editInplace" style="visibility: visible;">',
                    '{itemname}',
                  '</div>',
                '</div>',  
              '</div>',
            '</div>',
          '</div>'
        )
    };
    
    //this.templates.row=this.getRowTemplate();
  },
  
  getRowTemplate : function(){
    switch (this.rowstyle)
    {
      case 'detailed':
        return this.templates.rowTemplates['detailed'];
        break;
      
      case 'mediumThumbnails' :
      default :
        return this.templates.rowTemplates['mediumThumbnails'];
        break;
    }
  },
  
  doRender : function(cs, rs, ds, startRow, colCount, stripe){
    if (this.rowstyle=='detailed')
    {
      return RODS.GridView.superclass.doRender.call(this,
        cs, rs, ds, startRow, colCount, stripe);
    }
    
    var ts = this.templates, ct = ts.cell, rt = ts.rowTemplates.mediumThumbnails, 
        buf = [], rp={};
    
    
    for(var j = 0, len = rs.length; j < len; j++)
    {
      r = rs[j]; cb = [];
      var rowIndex = (j+startRow);
      
      var alt = [];
      if(stripe && ((rowIndex+1) % 2 == 0)){
          alt[0] = "x-grid3-row-alt";
      }
      if(r.dirty){
          alt[1] = " x-grid3-dirty-row";
      }
      rp.cols = colCount;
      if(this.getRowClass){
          alt[2] = this.getRowClass(r, rowIndex, rp, ds);
      }
      rp.alt = alt.join(" ");
      
      if (ds.getAt(rowIndex).get('type') > 0)
      {
        rp.iconstyle='z-resource_unknown-medium';
      }
      else
        rp.iconstyle='z-folder-medium';
      //rp.itemname=ds.getAt(rowIndex).get('name');
      
      var buf = [], cb=[], c, p = {}, r,i=0;
      
      var ct=new Ext.Template(
                    '<div class="x-grid3-cell-inner x-grid3-col-{id}" '+
                      'unselectable="on" {attr}>{value}</div>');
                    
                    
      
                c = cs[i];
                p.id = c.id;
                p.css = i == 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
                p.attr = p.cellAttr = "";
                p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
                p.style = c.style;
                if(p.value == undefined || p.value === "") p.value = "&#160;";
                if(r.dirty && typeof r.modified[c.name] !== 'undefined'){
                    p.css += ' x-grid3-dirty-cell';
                }
                cb[cb.length] = ct.apply(p);
      rp.itemname=cb.join("");
      
      //rp.itemname=cs[0].renderer(rs[0].data['name'], {}, rs[0], rowIndex, 0, ds);
      
      
      
      buf[buf.length] =  rt.apply(rp);
    }
    return buf.join("");
  },
  
  // overwriting the original function
  updateAllColumnWidths : function(){
      var tw = this.getTotalWidth();
      var clen = this.cm.getColumnCount();
      var ws = [];
      for(var i = 0; i < clen; i++){
          ws[i] = this.getColumnWidth(i);
      }

      this.innerHd.firstChild.firstChild.style.width = tw;

      for(var i = 0; i < clen; i++){
          var hd = this.getHeaderCell(i);
          hd.style.width = ws[i];
      }
      
      if (this.rowstyle=='detailed') //only update "rows" when it's detailed view
      {
        var ns = this.getRows();
        for(var i = 0, len = ns.length; i < len; i++){
            ns[i].style.width = tw;
            ns[i].firstChild.style.width = tw;
            var row = ns[i].firstChild.rows[0];
            for(var j = 0; j < clen; j++){
                row.childNodes[j].style.width = ws[j];
            }
        }
      }
      
      this.onAllColumnWidthsUpdated(ws, tw);
  }
  
  
});