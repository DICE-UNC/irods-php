<?php
/* iRODS Browser specific error */
define("RBERR_GENERAL", -200);
define("RBERR_AUTH_STRING_NOT_FOUND", -201);
define("RBERR_EXPECTED_INPUT_PARAM_MISSING", -202);
define("RBERR_MULFORMATED_URI", -203);
define("RBERR_SESSION_TIMEOUT", -204);

function makeJsonError($msg, $code=RBERR_GENERAL, $payload= array())
{
  $response=array('success'=> false,
    'errors'=> array('code'=>$code, 'msg'=>$msg),
    'que_results'=>$payload);
  return json_encode($response);  
} 

function exception2JsonError ($e, $payload= array())
{
  if ($e instanceof RODSException)
    $code=$e->getCode();
  else  
    $code=RBERR_GENERAL;
  return makeJsonError($e->getMessage(), $code, $payload);
} 

function exitWithJsonError($msg, $code=RBERR_GENERAL, $payload= array())
{
  echo makeJsonError($msg, $code, $payload);
  exit(0);
} 

function exitWithException($e, $payload= array())
{
  echo exception2JsonError($e, $payload);
  exit(0);
}

function format_size($rawSize) 
{
  if ($rawSize / 1099511627776 > 1) 
    return round($rawSize/1099511627776, 2) . ' TB';
  else if ($rawSize / 1073741824 > 1) 
    return round($rawSize/1073741824, 2) . ' GB';  
  else 
  if ($rawSize / 1048576 > 1) 
    return round($rawSize/1048576, 2) . ' MB'; 
  else if ($rawSize / 1024 > 1) 
    return round($rawSize/1024, 2) . ' KB'; 
  else 
    return round($rawSize, 1) . ' B ';
}

// turn an array of ProdsDir objects to array that can be used for JSON.
function dirs2array($dirs)
{
  $ret_val=array();
  foreach($dirs as $dir)
  {
    $ret_val[]=dir2array($dir);
  }
  return $ret_val;
}   

function dir2array($dir)
{
  $stats=array();
  $stats['id']=$dir->stats->id;
  $stats['name']=$dir->stats->name;
  $stats['size']=-1;
  $stats['fmtsize']="";
  $stats['mtime']=$dir->stats->mtime;
  $stats['ctime']=$dir->stats->ctime;
  $stats['owner']=$dir->stats->owner;
  $stats['type']=0;
  $stats['ruri']=$dir->toURI();
  return $stats;
}

function ruri2ProdsFile($fileuri)
{
  if (strlen($fileuri)<5)
    exitWithJsonError("Mul-formated iRODS URI: '$fileuri'" , RBERR_MULFORMATED_URI);
  
  $myfile=ProdsFile::fromURI($fileuri, false);
  if (empty($myfile->account->pass))
  {
    $acct=$_SESSION['acct_manager']->findAcct($myfile->account);
    if (empty($acct))
    {
      exitWithJsonError('Authentication Required', RBERR_AUTH_STRING_NOT_FOUND);
    }
    $myfile->account=$acct;
  }
  if (empty($myfile->account->zone))
  {
    $myfile->account->getUserInfo();
  }
  return $myfile;
} 

function ruri2ProdsDir($diruri)
{
  if (strlen($diruri)<5)
    exitWithJsonError("Mul-formated iRODS URI: '$diruri'" , RBERR_MULFORMATED_URI);
    
  $mydir=ProdsDir::fromURI($diruri, false);
  if (empty($mydir->account->pass))
  {
    $acct=$_SESSION['acct_manager']->findAcct($mydir->account);
    if (empty($acct))
    {
      exitWithJsonError('Authentication Required', RBERR_AUTH_STRING_NOT_FOUND);
    }
    $mydir->account=$acct;
  }
  if (empty($mydir->account->zone))
  {
    $mydir->account->getUserInfo();
  }
  return $mydir;
}

function ruri2RODSAccount($ruri)
{
  if (strlen($ruri)<5)
    exitWithJsonError("Mul-formated iRODS URI: '$ruri'" , RBERR_MULFORMATED_URI);
    
  $myacct=RODSAccount::fromURI($ruri);
  if (empty($myacct->pass))
  {
    $acct=$_SESSION['acct_manager']->findAcct($myacct);
    if (empty($acct))
    {
      exitWithJsonError('Authentication Required', RBERR_AUTH_STRING_NOT_FOUND);
    }
    $myacct=$acct;
  }
  if (empty($myacct->zone))
  {
    $myacct->getUserInfo();
  }
  return $myacct;
  
}

function return_bytes($val) {
    $val = trim($val);
    $last = strtolower($val[strlen($val)-1]);
    switch($last) {
        // The 'G' modifier is available since PHP 5.1.0
        case 'g':
            $val *= 1024;
        case 'm':
            $val *= 1024;
        case 'k':
            $val *= 1024;
    }

    return $val;
}

?>