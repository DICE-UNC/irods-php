<?php
require_once("../config.inc.php");
session_start();
if (!isset($_SESSION['acct_manager']))
  $_SESSION['acct_manager']= new RODSAcctManager();

if (empty($_REQUEST['ruri']))
  exitWithJsonError('iRODS URI not specified', RBERR_EXPECTED_INPUT_PARAM_MISSING);

if (empty($_REQUEST['task_id']))
  exitWithJsonError('Task ID not specified', RBERR_EXPECTED_INPUT_PARAM_MISSING);

$log_start_line=empty($_REQUEST['log_start_line'])?0:intval($_REQUEST['log_start_line']);

try {
  $acct=ruri2RODSAccount($_REQUEST['ruri']);
  $task_id=intval($_REQUEST['task_id']);
  $task=LRPTask::recoverByID($acct, $task_id);
  if (isset($_REQUEST['cancel']) && $_REQUEST['cancel']=='true')
  {
    $task->requestCancel();
    
  }
  $_status=$task->getStatus();
  $status = $_status;
  $num_lines=0;
  $status["logs"]=$task->getLog($log_start_line, $num_lines);
  $status["log_num_line"]=$num_lines;
  $status["log_start_line"]=$log_start_line;
  $response=array('success'=> true,'log'=>"Task Progress returned", 
    'que_results'=>$status);
  echo json_encode($response);
} catch (Exception $e) {
  exitWithException($e);  
}
?>