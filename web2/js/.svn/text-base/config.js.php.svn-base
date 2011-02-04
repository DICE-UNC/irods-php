<?php //do not modify this file, if you need to change preferences/settings, 
      //use "../config.inc.php" 
  require_once("../config.inc.php");    
  
  session_start();
      
  echo 'CLIENT_LOG='.CLIENT_LOG.";\n";
  
  // following is defined in LRPTask.class.php
  echo 'LRP_STATE_FAILED='.LRP_STATE_FAILED.";\n";
  echo 'LRP_STATE_UNDEFINED='.LRP_STATE_UNDEFINED.";\n";
  echo 'LRP_STATE_SUCCESS='.LRP_STATE_SUCCESS.";\n";
  echo 'LRP_STATE_INITIALIZING='.LRP_STATE_INITIALIZING.";\n";
  echo 'LRP_STATE_PLANNING='.LRP_STATE_PLANNING.";\n";
  echo 'LRP_STATE_INPROCRESS='.LRP_STATE_INPROCRESS.";\n";
  echo 'LRP_STATE_CANCELING='.LRP_STATE_CANCELING.";\n";
  echo 'LRP_STATE_USER_CANCELED='.LRP_STATE_USER_CANCELED.";\n";
  
  echo 'PHP_POST_MAX_SIZE='.return_bytes(ini_get('post_max_size')).";\n";
  echo 'PHP_SESSION_ID=\''.session_id()."';\n";
  echo 'PHP_SESSION_MAXLIFETIME='.return_bytes(ini_get('session.gc_maxlifetime')).";\n";

?>