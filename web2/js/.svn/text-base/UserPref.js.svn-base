RODSAccount = function(config){
  //user,host,port,zone,pass,initPath,defaultResc
  Ext.apply(this,config);
  
  /*
  this.user=user;
  this.host=host;
  this.port=port;
  this.zone=zone;
  this.pass=pass;
  
  // account preferences
  this.initPath=initPath;
  this.defaultResc=defaultResc;
  */
  RODSAccount.superclass.constructor.call(this);
};

Ext.extend(RODSAccount,Ext.util.Observable, {
    user: '',
    host: '',
    port: 3456,
    zone: '',
    pass: '',
    initPath: '',
    defaultResc: '',
    resources: [],
    
    clone : function(){
      var acct=new RODSAccount({
        user: this.user,
        host: this.host,
        port: this.port,
        zone: this.zone,
        pass: this.pass,
        initPath: this.initPath,
        defaultResc: this.defaultResc,
        resources: []
      });
      for (var i=0; i<this.resources.length; i++)
      {
        acct.resources.push({
          id: this.resources[i].id,
          name: this.resources[i].name,
          type: this.resources[i].type,
          zone: this.resources[i].zone,
          'class': this.resources[i]['class'],
          loc: this.resources[i].loc,
          info: this.resources[i].info,
          comment: this.resources[i].comment,
          ctime: this.resources[i].ctime,
          mtime: this.resources[i].mtime,
          vault_path: this.resources[i].vault_path,
          free_space: this.resources[i].free_space
        });
      }
      return acct;
    },
    
    // check if accout seems valid
    seemsValid : function() {
      return (   (this.user.length>0)
               &&(this.host.length>0)
               &&(this.port.length>0)
             );      
    },
    
    toIdentifier : function(){
      return ( this.user
           + ( (this.zone)&&(this.zone.length>0)?'.'+this.zone:'' )
          + '@'+this.host
          + ':'+this.port );
    },
    
    toRURI : function(){
      if (this.initPath.length<1)
        this.initPath='/';
      return ( this.user
          + ( (this.zone)&&(this.zone.length>0)?'.'+this.zone:'' )
          + '@'+this.host
          + ':'+this.port
          + ( (this.initPath.length>0)?this.initPath:'/' ) 
      );
    },
  
    // if it's the same account
    equals : function(newacct){
      return (this.toIdentifier()==newacct.toIdentifier());
    },
  
    // if two accounts are exactly the same, needed for tasks such as save
    equalsExact : function(newacct){
      
      var resourcesEqual=true;
      if (this.resources.length==newacct.resources.length)
      {
        for (var i=0; i<this.resources.length; i++)
        {
          if ((this.resources[i]['id']==newacct.resources[i]['id'])
            &&(this.resources[i]['name']==newacct.resources[i]['name'])
            &&(this.resources[i]['type']==newacct.resources[i]['id'])
            &&(this.resources[i]['zone']==newacct.resources[i]['id'])
            &&(this.resources[i]['class']==newacct.resources[i]['id'])
            &&(this.resources[i]['loc']==newacct.resources[i]['id'])
            &&(this.resources[i]['info']==newacct.resources[i]['id'])
            &&(this.resources[i]['comment']==newacct.resources[i]['id'])
            &&(this.resources[i]['ctime']==newacct.resources[i]['id'])
            &&(this.resources[i]['mtime']==newacct.resources[i]['id'])
            &&(this.resources[i]['vault_path']==newacct.resources[i]['id'])
            &&(this.resources[i]['free_space']==newacct.resources[i]['id']))
          {
            // nothing needs to be done here, keey going
          }
          else
          {
            resourcesEqual=false;
            break;
          }
        }
      }
            
      
      return ( (this.toIdentifier()==newacct.toIdentifier()) 
             &&(this.pass=newacct.pass)
             &&(this.initPath=newacct.initPath)
             &&(this.defaultResc=newacct.defaultResc)
             &&(resourcesEqual==true)
             );
    },
    
    getTrashDirRURI : function (){
      return ( this.user
           + '.'+this.zone
          + '@'+this.host
          + ':'+this.port
          + '/'+this.zone+'/trash/home/'+this.user  
      );
      
    },
    
    getTitle : function(){
      return ( this.user
           + '@'+this.host
           + ':'+this.port );
    }
});

/**
 * a function to convert an iRODS URI string to a iRODS account object
 */
function ruri2Account(ruri)
{
  var uri_obj=parseUri(ruri); // function parseURI is defined in file parse_uri.js  
  
  var user=uri_obj.user;
  var zone='';
  if ( (user)&&(user.length>3) )
  {
    var index_of_dot=user.indexOf('.');
    if (index_of_dot > 0)
    {  
      zone=user.substr(index_of_dot+1);
      user=user.substr(0, index_of_dot);
    }
  }
  
  return new RODSAccount({
    host: uri_obj.host,
    port: uri_obj.port,
    user: user,
    zone: zone,
    pass: uri_obj.password,
    initPath: uri_obj.path
  });
}

UserPref= function(cfg) {
  Ext.applyIf(this, cfg);
  return {
    
    data : {
      accounts:[],
      save_data:true,
      save_pass : false
    },
    dataprefix : 'RWCuserpref',
    activeAccount : null,
    
    
    init : function()
    {
      this.cookieprovider=new Ext.state.CookieProvider({
        expires: new Date(new Date().getTime()+(1000*60*60*24*360)), //360 days
        secure: Ext.isSecure
      });
      
      this.data=this.cookieprovider.get(this.dataprefix, this.data);
      
      if (this.data.accounts == null)
        this.data.accounts=[];
      
      // remove empty account in array, caused by decode function in Extjs::Provider.
      for( var i=0; i<this.data.accounts.length; i++)
      {
        if (null==this.data.accounts[i])
          this.data.accounts.splice(i,1);
        else
        { // remove empty resources in array, caused by decode function in Extjs::Provider.
          if (this.data.accounts[i].resources == null)
            this.data.accounts[i].resources=[];
          var resc=this.data.accounts[i].resources;
          for( var j=0; j<resc.length; j++)
            if (null==resc[j])
              resc.splice(j,1);
          
          // convert the genetic object, read from cookie to account object    
          var acct=new RODSAccount();
          Ext.apply(acct, this.data.accounts[i]);
          this.data.accounts[i]=acct;    
        }
      }
    },
    
    cloneData: function()
    {
      var data_cpy={
        accounts: [],
        save_data: this.data.save_data,
        save_pass: this.data.save_pass
      };
      
      for (var i=0; i<this.data.accounts.length; i++)
      {
        data_cpy.accounts.push(this.data.accounts[i].clone());
      }
      return data_cpy;
    },
    
    numAccount: function() //number of accounts stored
    {
      return this.data.accounts.length;
    },
    
    getAccount : function (index)
    {
      if ( (index<0)||(index>=this.data.accounts.length) )
        throw ('UserPref::getAccount: invalid index ('+index+')');
        
      return this.data.accounts[index];
    },
    
    addAccount : function(account)
    {
      if (!account) 
        return
      
      var index=this.findAccountIndex(account);
      if (index<0) //if account don't exist
      {
        this.data.accounts.push(account);
        this.save();
      }
      else
      {
        if (this.data.accounts[index].equalsExact(account))
        {
          // if exactly the same, no need to add/update  
        }
        else
        {
          Ext.apply(this.data.accounts[index], account);
          this.save();
        }
      }
    },
    
    removeAccout : function(account)
    {
      if (!account) 
        return;
      
      var index=this.findAccountIndex(account);
      if (index>=0)
      {
        var delacct=this.accounts.splice(index,1);
        delete delacct;
      }
    },  
    
    findAccount : function (account)
    {
      var index=this.findAccountIndex(account);
      if (index<0)
        return null;
      else
        return this.data.accounts[index];
    },
    
    findAccountIndex : function (account)
    {
      if (!account) 
        throw ('findAccountInx: Trying to find an empty Account');
        
      for(var i=0; i<this.data.accounts.length; i++)
      {
        if (this.data.accounts[i].equals(account))
          return i;
      }
      return -1;
    },
    
    accountExists : function(account)
    {
      if (!account) return null;
      if (null==this.findAccount(account))
        return false;
      else
        return true;
    },
    
    getAccounts : function()
    {
      return this.data.accounts;
    },
    
    getAccountArray : function()
    {
      var accts=Array();
      
      for (var i=0; i<this.data.accounts.length; i++)
      {
        var acct=this.data.accounts[i];
        accts.push(Array(acct['user'],acct['host'],acct['port'],
          acct['zone'],acct['pass'],acct['initPath'],acct['defaultResc']));
      }
      return accts;
    },
    
    set : function(key, val)  
    {
      // no need to save or set if val unchanged
      if ( (this.data[key])&&(this.data[key]==val) )
        return;
      this.data[key]=val;
      this.save();
    },
    
    get : function(key)
    {
      if (this.data[key])
        return this.data[key];
      else
        return '';
    },
    
    save: function (expires, path) {
      if (this.data.save_data==true)
      {
        if (this.data.save_pass!=true)
        {
          var data_copy=this.cloneData();
          for (var i=0; i<data_copy.accounts.length; i++)
            data_copy.accounts[i].pass='';
          this.cookieprovider.set(this.dataprefix, data_copy);
        }
        else
        {  
          this.cookieprovider.set(this.dataprefix, this.data);
        }
      }
    },
    
    remove: function (path)
    {
      this.cookieprovider.clear(this.dataprefix)
    }
  }
};
