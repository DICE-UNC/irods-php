FormFailureErrorHandler=function(form, action, processServerInvalidError){
  var title='Unknown Error';
  var text='Unknown Error';
  if (null==processServerInvalidError) 
    processServerInvalidError=true;
  
  switch (action.failureType) {
    case Ext.form.Action.CLIENT_INVALID:    
      title='Form Error: CLIENT_INVALID';
      text='There was a uncaught client invalid error, possiblly a invalid form field.';
      break;
    case Ext.form.Action.CONNECT_FAILURE:    
      title='Web service connection failure';
      text='Connection to web service has failed, If the problem persists, pleaes notify the iRODS web admin.';
      break;
    case Ext.form.Action.LOAD_FAILURE:    
      title='Form Error: LOAD_FAILURE';
      text='There was a uncaught form load error';
      break;
    case Ext.form.Action.SERVER_INVALID:
      if (processServerInvalidError==true)
      {
        title='Form Error: SERVER_INVALID';
        text='('+action.result.errors.code+'): '+action.result.errors.msg;
      }
      else
        return false; // return false back to caller, for further processing.
      break;
    default:
      title='Undefined failureType:'+failureType;
      text='Undefined failureType:'+failureType;
  }
  Ext.Msg.alert(title,text);
}; 

GeneralError = function(msg) {
  this.code=-1;
  this.message=msg;
  return {
    code : this.code ? this.code : -1,
    message : this.message ? this.message : "General Error",
    show : function() {
      var title='General Error';
      var text=this.message;
      Ext.Msg.alert(title,text);  
    },
    isRBError : function() {
      return true;  
    }
  };
}

JsonParseError = function(json) {
  this.code=-1;
  this.message="Bad server response:"+json;
  this.isRBError=true;
  return {
    code : this.code ? this.code : -1,
    message : this.message ? this.message : "Json Parse Error",
    show : function() {
      var title='Json Parse Error (web service crashed unexpectedly)';
      var text=this.message;
      Ext.Msg.alert(title,text);  
    },
    isRBError : function() {
      return true;  
    }
  };
}

HTTPConnError = function(XMLHttpRequest_response) {
  this.code=XMLHttpRequest_response.status;
  this.message=XMLHttpRequest_response.statusText;
  this.isRBError=true;
  return {
    code : this.code ? this.code : -1,
    message : this.message ? this.message : "Undefined HTTPConnError Message",
    show : function() {
      var title='HTTP request Error: '+this.code;
      var text=this.message;
      Ext.Msg.alert(title,text);  
    },
    isRBError : function() {
      return true;  
    }
  };
}

RODSError = function(code, msg) {
  this.code=code;
  this.message=msg;
  this.isRBError=true;
  return {
    code : this.code ? this.code : -1,
    message : this.message ? this.message : "Undefined RODSError Message",
    show : function() {
      var title='iRODS Error: '+this.code;
      var text=this.message;
      Ext.Msg.alert(title,text);  
    },
    isRBError : function() {
      return true;  
    }
  };
}

errorShow = function (_err) {
  if (_err.isRBError)
  {
    var err=_err;
  }
  else
  if (_err.message)
  {
    var err=new GeneralError(_err.message);
  }
  else
  if (typeof _err == "string")
  {
    var err=new GeneralError(_err);
  }
  else
  {
    var err=new GeneralError("Unsupported exception type received");      
  }
  err.show();
}