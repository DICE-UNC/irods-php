AddLog=function(log, type)
{
  if (!CLIENT_LOG) return;
  
  var logPanel=Ext.ComponentMgr.get('log-panel');
  if ( (logPanel) && (logPanel.addLog) )
    logPanel.addLog(log, type);
};

GetRODSProxyURL = function(ruri)
{
  var currenturl=location.protocol+'//'+location.host+location.pathname;
  var currenturlpath=currenturl.substring(0,currenturl.lastIndexOf('/'));
  var proxy_url=currenturlpath+'/rodsproxy/'+ruri;
  return proxy_url;
};  