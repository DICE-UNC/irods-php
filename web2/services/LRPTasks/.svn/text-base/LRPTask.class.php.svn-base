<?php
require_once(dirname(__FILE__)."/../../config.inc.php");

define("LRP_STATE_FAILED", -1);
define('LRP_STATE_UNDEFINED', 0);
define("LRP_STATE_SUCCESS", 1);
define("LRP_STATE_INITIALIZING", 2);
define("LRP_STATE_PLANNING", 3);
define("LRP_STATE_INPROCRESS", 4);
define("LRP_STATE_CANCELING", 5);
define("LRP_STATE_USER_CANCELED", 6);

/**
 * LRPTask class. long running process task
 * @package LRP
 */
abstract class LRPTask
{
  /**
   * string src source pathes (URI in general) 
   * @var array
   */
  public $params;
  public $shellcmd;
  
  /**
   * process plan
   * @var array
   */
  public $cwd;
  public $plan;
  public $accout;
  public $status;
  public $id;
  public $speed_per_file_snapshots;
  
  public function __construct(array $params)
  {
    if (empty($params['src']))
      throw new Exception('Unexpected param: empty src');
    
    if (!($params['src'][0] instanceof ProdsPath))
      throw new Exception('Unexpected param: src[0] is not a ProdsPath');
    $this->params=$params;
      
    $this->accout=$params['src'][0]->account;
    $now=time();  
    $this->status=array('state'=>LRP_STATE_UNDEFINED, 
      'processed_num_files'=>0, 'total_num_files'=>1, 
      'last_file_processed'=>'',
      'ctime' => $now, 'mtime' => $now);
    
  }
  // initialize the task, by scheduler
  public function init ()
  {
    initDataDir(LRP_DATA_DIR.'/'.$this->accout->toURI());
    $task_id=rand();
    $this->cwd=LRP_DATA_DIR.'/'.$this->accout->toURI().'/'.$task_id;
    if (file_exists($this->cwd))
    {
      $task_id=rand();
      $this->cwd=LRP_DATA_DIR.'/'.$this->accout->toURI().'/'.$task_id;
      if (file_exists($this->cwd))
        throw new Exception("failed to generate unique task data dir '$this->cwd'");
    }
    $this->id=$task_id;
    if(true!==mkdir($this->cwd, 0755, true))
      throw new Exception("unable to create task data dir: '$this->cwd' ");
    
    $this->status['state']=LRP_STATE_INITIALIZING;  
    $this->save();
  }
  
  // initialize the task, by worker
  public function initWorker ()
  {
    $total_items=0;
    foreach ($this->params['src'] as $src)
    {
      if ($src instanceof ProdsFile)
        $total_items++;
      else
      if ($src instanceof ProdsDir)
        $total_items=$total_items+$src->queryStatistics('num_files', true); 
    }
    $this->status['total_num_files']=$total_items;
    $this->status['processed_num_files']=0;
    $this->status['last_file_processed']='';
    
    $this->status['state']=LRP_STATE_INITIALIZING; 
    $this->status['errcode']=0;
    $this->status['errmsg']='';
    $this->speed_per_file_snapshots=array();
    $this->status['estimated_time_left']='';
    $this->status['mtime']=time();
    $this->save();
  }
  
  public function progressCallback(array $progress_update)
  {
    $this->updateFileCnt($progress_update['filesCnt'], $progress_update['lastObjPath']); 
    $this->checkUserRequests();
    if ($this->status['state']==LRP_STATE_CANCELING)
    {
      $this->updateStatus('state',LRP_STATE_USER_CANCELED);
      $this->addLog("Task canceled by user"); 
      return 1;    
    }
  }
  
  public function getStatus()
  {
    return $this->status;
  }
  
  public function getLog($start_line, &$num_lines_returned, $max_lines=10000)
  {
    $logfile=$this->cwd.'/log.txt';
    $num_lines_returned=0;
    $num_lines_read=0;
    $buffer='';
    if (!is_readable($logfile))
    {
      return $buffer;
    }
    
    $handle = @fopen($logfile, "r");
    if ($handle) {
        while ( !feof($handle)) {
            if ($num_lines_returned >= $max_lines)
              break; 
            $line= fgets($handle, 4096); 
            
            if ($num_lines_read >= $start_line)
            {  
              $buffer .= $line;
              $num_lines_returned++;
            }
            $num_lines_read++;
        }
        fclose($handle);
    }
    
    return $buffer;
  }
  
  public function setErrorByException (Exception $e)
  {
    $this->updateStatus('state', LRP_STATE_FAILED);
    $errcode=-1;
    if ($e instanceof RODSException)
    {
      $errcode=$e->getCode();
      $this->updateStatus('errcode', $errcode);
    }
    $errmsg=$e->getMessage();
    $this->updateStatus('errmsg', $errmsg); 
    $this->addLog("Task Failed ($errcode): $errmsg");  
  }
  
  public function updateStatus($fld, $value, $mode='set')
  {
    $newval=null;
    switch ($mode)
    {
      case 'add':
        $newval=$this->status[$fld]+$value;
        break;
      case 'set':
        $newval=$value;
        break;
      default:
        $this->addLog("Error: Unsupported mode '$mode'!");
        break;
    }
    $oldval=$this->status[$fld];
    $this->status[$fld]=$newval;
    if ($oldval!=$newval)
    {
      $this->status['mtime']=time();
      $this->save();
      $this->addLog("$fld: $oldval - > $newval");
    }
  }
  
  public function updateFileCnt($value, $lastfile)
  {
    $this->status['processed_num_files']=$this->status['processed_num_files']+$value;
    $this->status['last_file_processed']=$lastfile;
    
    $this->status['mtime']=time();
    $this->updateSpeed($value);
    $this->save();
    $this->addLog("$value file processed. Last file: $lastfile");
  }
  
  public function updateSpeed($processed_num_files)
  {
    array_push($this->speed_per_file_snapshots,
      array('num_files' => $processed_num_files, 'time' => microtime(true)));
    if (count($this->speed_per_file_snapshots)>100)
      array_shift($this->speed_per_file_snapshots);
      
    $offset=0;
    if (count($this->speed_per_file_snapshots) <= 1)
      return;
    if (count($this->speed_per_file_snapshots) > 10)
      $offset=-10;
    
    $speeds=array_slice($this->speed_per_file_snapshots, $offset);
    $file_count=0;
    $time_elapsed=0;
    for($i=1; $i<count($speeds); $i++)
    {
      $file_count += $speeds[$i]['num_files'];
      $time_elapsed += $speeds[$i]['time']-$speeds[$i-1]['time'];
    }
    $num_file_per_sec=$file_count/$time_elapsed;
    $num_files_left=$this->status['total_num_files']-$this->status['processed_num_files'];
    $time_left=$num_files_left/$num_file_per_sec;
    
    if ($time_left > 3600*24*7)
      $this->status['estimated_time_left']=' > 1 week';
    else
    if ($time_left > 3600*24)
      $this->status['estimated_time_left']=' > 1 day';   
    else
    if ($time_left > 3600)
      $this->status['estimated_time_left']= round($time_left/3600).' hours';
    else
    if ($time_left > 60)
      $this->status['estimated_time_left']= round($time_left/60).' minutes'; 
    else 
    if ($time_left > 1)
      $this->status['estimated_time_left']= round($time_left).' seconds';   
    else  
      $this->status['estimated_time_left']= 'nearly done';
  }
  
  
  
  abstract protected function getWorkerShellCMD();
  
  public function summonWorker()
  {
    $cmd=$this->getWorkerShellCMD();
    $this->shellcmd=( 'nohup '.
         PHP_CLI_PATH.'php '.
         escapeshellcmd($cmd).
         ' >> '.
         $this->cwd.'/log.txt'.
         ' 2>> '.
         $this->cwd.'/log.txt'.
         ' &');
    echo exec($this->shellcmd);
  }
  
  public static function recoverByID(RODSAccount $acct, $task_id)
  {
    $datadir=LRP_DATA_DIR.'/'.$acct->toURI().'/'.$task_id;
    return LRPTask::recover($datadir);
  }
  
  public static function recover($datadir)
  {
    if (false===($str=file_get_contents($datadir.'/save.txt')))
    {
      throw new Exception("unable to read saved file in data dir: '$datadir' ");
    }
    return unserialize($str);
  }
  
  public function save()
  {
    if (false===file_put_contents($this->cwd.'/save.txt',serialize($this)))
      throw new Exception("unable to save status: '$this->cwd/save.txt' ");  
  }
  
  public function requestCancel()
  {
    $ureq=array("cancel" => true);
    if (false===file_put_contents($this->cwd.'/ureq.txt',serialize($ureq)))
      throw new Exception("unable to request cancel by file: '$this->cwd/ureq.txt' ");
    if ($this->status['state']==LRP_STATE_INPROCRESS)  
      $this->addLog("Setting user's request to cancel task");  
  }
  
  public function checkUserRequests()
  {
    if (!is_readable($this->cwd.'/ureq.txt'))
      return;
    
    $str=file_get_contents($this->cwd.'/ureq.txt');
    $ureq=unserialize($str);
    if ($ureq['cancel']===true)
    {
      $this->updateStatus('state', LRP_STATE_CANCELING);
      $this->addLog("Acknowledged user's canel request, trying to cancel now...");
    }
  }
  
  // remove the task, return true/false 
  public function remove()
  {
    $filelist=array(
      "save.txt",
      "ureq.txt",
      "log.txt"
    );
    $dirpath=$this->cwd;
    foreach($filelist as $fname)
    {
      $fpath="$dirpath/$fname";
      if (is_writeable($fpath))
        unlink($fpath);
    }
    return rmdir($dirpath); 
  }
  
  public static function removeAllOldTasks()
  {
    if ($handle = opendir(LRP_DATA_DIR)) {
      while (false !== ($acct_dir = readdir($handle))) {
        if ($acct_dir=='.' || $acct_dir=='..')
          continue;
        $acctpath=LRP_DATA_DIR.'/'.$acct_dir;
        if (!is_dir($acctpath))
          continue;   
        
        if ($handle_acct = opendir($acctpath)) {
          while (false !== ($task_dir = readdir($handle_acct))) {
            if ($task_dir=='.' || $task_dir=='..')
              continue;
            $task_path=$acctpath.'/'.$task_dir;
            if (!is_dir($task_path))
              continue;
            $task=LRPTask::recover($task_path);
            $tstatus=$task->getStatus();
            if ( (time() - $tstatus['mtime']) > LRP_GC_MAXLIFETIME )
            {
              $task->remove();  
            }
          }
          closedir($handle_acct);
          //remove the account dir if empty
          if (count(scandir($acctpath)) <= 2)
            rmdir($acctpath);  
        }
      }
      closedir($handle);
    }
      
    
  }
  
  public function addLog($log)
  {
    date_default_timezone_set('UTC');
    $filename = $this->cwd.'/log.txt';  
    if (false===($handle = fopen($filename, 'a+')))
      throw new Exception("unable to open log file");
    
    $logline='['.date('Y-m-d G:i:s').'] '.$log."\n";
    
    // Write $somecontent to our opened file.
    if (fwrite($handle, $logline) === false) {
        throw new Exception("unable to write log file");
    }
    fflush($handle);
    fclose($handle);
  }
  
  
}
  
?>