<?php
require_once("../config.inc.php");

session_start();

if (!isset($_SESSION['acct_manager']))
{
  $_SESSION['acct_manager']= new RODSAcctManager();
}

$host= (isset($_REQUEST['host']))?$_REQUEST['host']:NULL;
$port= (isset($_REQUEST['port']))?$_REQUEST['port']:NULL;
$user= (isset($_REQUEST['user']))?$_REQUEST['user']:NULL;
$pass= (isset($_REQUEST['pass']))?$_REQUEST['pass']:NULL;

$acct=new RODSAccount($host, $port, $user, $pass);
try {
  
  if ( ($storedacct=$_SESSION['acct_manager']->findAcct($acct))&&($pass==NULL) ) 
  {//if account already exists, and password not specifed, use the stored account
    $acct=$storedacct;
  }
  else
  {
    $acct->getUserInfo();
    $_SESSION['acct_manager']->add($acct);
  }
} catch (Exception $e) {
  //generateClientError($e);
  exitWithException($e);
}

$init_path="/$acct->zone/home/$acct->user";
if (isset($_REQUEST['initPath'])) // if user specify the path, it needs to be checked 
{
  if ($init_path==$_REQUEST['initPath']) 
  {
    // if it's default path, no need to check
  }
  else
  {
    $dir= new ProdsDir($acct, $_REQUEST['initPath']);
    if (true==$dir->exists())
      $init_path=$_REQUEST['initPath'];
  }
}
  
$que=new ProdsQuery($acct);
$resources=$que->getResources();
$defaultResc=$resources[0]['name'];
if (isset($_REQUEST['default_resc']))
{
  foreach($resources as $resc)
  {
    if ($resc['name']==$_REQUEST['default_resc'])
      $defaultResc=$resc['name'];
  }
}
  
$var=array("success"=>true,"zone"=>$acct->zone,
  "init_path"=>$init_path, 'default_resc'=>$defaultResc,
  'resources'=>$resources);

echo json_encode($var);  
exit(0);

function generateClientError($e)
{
  echo json_encode(array("success"=>false, 
    "errors" => array('code'=> $e->getCode(), 'msg' => $e->getMessage())
  ));
  exit(0);
}

?>
