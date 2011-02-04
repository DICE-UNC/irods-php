<?php
require_once("../config.inc.php");
session_start();
if (!isset($_SESSION['acct_manager']))
  $_SESSION['acct_manager']= new RODSAcctManager();

$ruri="";
if (isset($_REQUEST['ruri']))
  $ruri=$_REQUEST['ruri'];
else
{
  exitWithJsonError('Expected RODS URI not found', RBERR_EXPECTED_INPUT_PARAM_MISSING);
} 

$name='';
if (isset($_REQUEST['name']))
  $name=$_REQUEST['name'];
if (empty($name))
{
  exitWithJsonError('New collection name not specified', RBERR_EXPECTED_INPUT_PARAM_MISSING);
}  

try {
  
  $parent=ProdsDir::fromURI($ruri, false);
  if (empty($parent->account->pass))
  {
    $acct=$_SESSION['acct_manager']->findAcct($parent->account);
    if (empty($acct))
    {
      exitWithJsonError('Authentication Required', RBERR_AUTH_STRING_NOT_FOUND);
    }
    $parent->account=$acct;
  }
  if (empty($parent->account->zone))
  {
    $parent->account->getUserInfo();
  }  
  
  $child=$parent->mkdir($name);
  $count=0;
  if (NULL==$child->getStats())
    exitWithJsonError("Collection '$name' created, but could not be found under: ".$parent->getPath(), 
      RBERR_GENERAL);
  
  $response=array('success'=> true,'log'=>'new collection created!', 
    'que_results' => array(dir2array($child)));
  echo json_encode($response);
  
} catch (Exception $e) {
  exitWithException($e);  
}

  
?>