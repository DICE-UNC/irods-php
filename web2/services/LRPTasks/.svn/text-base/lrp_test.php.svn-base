<?php
  require_once("LRPTask.class.php");
  require_once("LRPDelete.class.php");
  
  $cmd_options=getopt("d:");
  if (empty($cmd_options['d']))
    throw new Exception("required '-d' option not found!");
  
  $task=LRPTask::recover($cmd_options['d']);
  
  sleep(5);
  $task->addLog("tick1");
  sleep(5);
  $task->addLog("tick2");
  sleep(5);
  $task->addLog("tick3");
  sleep(5);
  $task->addLog("done");
?>  