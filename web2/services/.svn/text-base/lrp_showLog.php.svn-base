<?php
require_once("../config.inc.php");
session_start();
if (!isset($_SESSION['acct_manager']))
  $_SESSION['acct_manager']= new RODSAcctManager();

if (empty($_REQUEST['ruri']))
  die('iRODS URI not specified');

if (empty($_REQUEST['task_id']))
  die('Task ID not specified');
  
try {
  $acct=ruri2RODSAccount($_REQUEST['ruri']);
  $task_id=intval($_REQUEST['task_id']);
  $task=LRPTask::recoverByID($acct, $task_id);
  $logfile=$task->cwd.'/log.txt';
  if (!is_readable($logfile))
  {
    die("Can not access log file!");  
  }
  echo "<pre>".file_get_contents($logfile)."</pre>";
} catch (Exception $e) {
  die("Exception: ".$e);  
}
?>