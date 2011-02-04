<?php
require_once("../config.inc.php");
session_start();
if (!isset($_SESSION['acct_manager']))
  $_SESSION['acct_manager']= new RODSAcctManager();

$files=array();
$dirs=array();
if (isset($_REQUEST['files']))
  $files=$_REQUEST['files'];
if (isset($_REQUEST['dirs']))
  $dirs=$_REQUEST['dirs'];

if ( (empty($files))&&(empty($dirs)) )
{
  exitWithJsonError('No files or collections specified', RBERR_EXPECTED_INPUT_PARAM_MISSING);
}  

$force_delete=false;
if (isset($_REQUEST['force']))
  $force_delete=true;

$additional_options=array();
if (isset($_REQUEST['rmtrash']))
{
  $rmtrash=true;
  array_push($additional_options,array('irodsRmTrash',''));
}
  
try {
  $num_files=0;
  foreach ($files as $fileuri)
  {
    if (strlen($fileuri)>0)
    {
      $myfile=ruri2ProdsFile($fileuri);
      $myfile->unlink(NULL, $force_delete);
      $num_files++;
    }
  }
  
  $num_dirs=0;
  foreach ($dirs as $diruri)
  {
    if (strlen($diruri)>0)
    {
      $mydir=ruri2ProdsDir($diruri); 
      $mydir->rmdir(true, $force_delete, $additional_options);
      $num_dirs++;
    }
  }
  
  $response=array('success'=> true,'log'=>"$num_files files and $num_dirs collections deleted!");
  echo json_encode($response);
  
} catch (Exception $e) {
  exitWithException($e);  
}

  
?>