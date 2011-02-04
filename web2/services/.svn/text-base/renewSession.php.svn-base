<?php
require_once("../config.inc.php");

session_start();

if (!isset($_REQUEST['ssid']))
  exitWithJsonError('ssid not found', RBERR_EXPECTED_INPUT_PARAM_MISSING);

if ($_REQUEST['ssid']!=session_id())
  exitWithJsonError('Session timeout', RBERR_SESSION_TIMEOUT);

$response=array('success'=> true, 'log' => 'session renewed');

echo json_encode($response); 
exit(0);

?>
