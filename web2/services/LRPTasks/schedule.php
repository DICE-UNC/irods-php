<?php
require_once("LRPDelete.class.php");
$dir=ProdsDir::fromURI("rods:RODS@localhost:1247/tempZone/home/rods/iRODS");
$task= new LRPDelete(array(
    'src'=>array($dir),
    
  )
);

$task->init();
$task->addLog("Task $task->id scheduled");
$task->summonWorker();

$response=array('success'=> true,'log'=>"task scheduled");
echo json_encode($response);
echo "<pre>".$task->shellcmd."</pre>";
?>