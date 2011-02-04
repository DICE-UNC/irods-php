<?php
require_once("../config.inc.php");
session_start();
if (!isset($_SESSION['acct_manager']))
  $_SESSION['acct_manager']= new RODSAcctManager();

if (empty($_REQUEST['ruri']))
  exitWithJsonError('iRODS URI not specified', RBERR_EXPECTED_INPUT_PARAM_MISSING);

if (!isset($_REQUEST['filestr']))
  exitWithJsonError('file string not specified', RBERR_EXPECTED_INPUT_PARAM_MISSING);  
  
try {
  $file=ruri2ProdsFile($_REQUEST['ruri']);
  $chunksize = 1*(1024*1024);
  $file_content='';
  $file->open("w");
  $len = $file->write($_REQUEST['filestr']);
  if ($len!=strlen($_REQUEST['filestr']))
    exitWithJsonError('file write error. '.
      strlen($_REQUEST['filestr'])." bytes supplied, $len bytes written.", 
      RBERR_GENERAL); 
    
  $response=array('success'=> true,'log'=>"$len bytes written successfully");
  echo json_encode($response);  
} catch (Exception $e) {
  exitWithException($e);  
}

  
?>