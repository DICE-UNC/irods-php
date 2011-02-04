PHPSessionManager= function() {
  var renewedTime;
  var wait=(PHP_SESSION_MAXLIFETIME-60)*1000;
  return {
    init : function() {
      this.updateTime();
      this.renewSession.defer( wait, this);
    },
    
    updateTime : function() {
      var t=new Date();
      renewedTime= t.getTime();
    },
    
    renewSession : function() {
      AddLog('session renew requested');
      var req=new RODS.Requests();
      req.renewSession({
        ssid : PHP_SESSION_ID,
        scope : this,
        callback : function(){
          this.updateTime(); 
          this.renewSession.defer( wait, this);   
        }
      });
    }
  }
}  