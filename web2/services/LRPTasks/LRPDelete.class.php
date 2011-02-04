<?php

require_once("LRPTask.class.php");
  
class LRPDelete extends LRPTask
{
  public function getWorkerShellCMD()
  {
    return dirname(__FILE__)."/lrp_delete.php -d '$this->cwd'";  
  }
  
  public function execTask()
  {
    $this->initWorker();
    $numfiles=$this->status['total_num_files'];
    $this->addLog("Deletion started: $numfiles files.");
    $this->updateStatus('state',LRP_STATE_INPROCRESS, 'set'); 
    foreach ($this->params['src'] as $src)
    {
      if (!$src->exists()) // skip if path doesn't exist
        continue;
      else
      if ($src instanceof ProdsFile)
      {
        $src->unlink(null, true);
        $this->updateStatus('processed_num_files',1, 'add'); 
      }
      else
      if ($src instanceof ProdsDir)
        $src->rmdir(true,true,array(),array($this,'progressCallback')); 
    }
    if ($this->status['state']==LRP_STATE_USER_CANCELED)
    {
      //don't change the status if the state is already canceled  
    }
    else
    {
      $this->updateStatus('state',LRP_STATE_SUCCESS, 'set');
    }
    $elapsed_time=time()-$this->status['ctime'];
    $this->addLog("Task finished in $elapsed_time seconds!"); 
  }
}
?>