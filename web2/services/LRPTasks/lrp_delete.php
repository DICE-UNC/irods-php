<?php
  require_once("LRPDelete.class.php");
  
  try{
    $cmd_options=getopt("d:");
    if (empty($cmd_options['d']))
      throw new Exception("required '-d' option not found!");
    
    $task=LRPTask::recover($cmd_options['d']);
    $task->execTask();
  } catch (Exception $e) {
    if (isset ($task))
    {
      $task->setErrorByException($e);
    }
    else
      echo "Task Failed: $e";
  }
  
  // remove the old tasks to make space.
  LRPTask::removeAllOldTasks();
  
?>  