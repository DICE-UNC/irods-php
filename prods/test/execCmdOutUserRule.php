<?php

require_once("../src/Prods.inc.php");

$account=new RODSAccount("localhost", 1247, "rods", "rods", "tempZone");

$rule_body  = "printHello||print_hello|nop";
$input_params = array();
$out_params = array('ruleExecOut');

try {
$start_time=microtime(true);

$conn=new RODSConn($account);
$conn->connect();
$results=$conn->execUserRule($rule_body,$input_params,$out_params);
var_dump($results);
$conn->disconnect();

$rule=new ProdsRule($account,$rule_body,$input_params,$out_params);
$results=$rule->execute(); 
var_dump($results);

$end_time=microtime(true);
$exec_time=$end_time-$start_time;
echo "--- test successful!  in ($exec_time sec) --- <br/>\n";

} catch (RODSException $e) {
  
  echo "--- test failed! --- <br/>\n";
  echo ($e);
  echo $e->showStackTrace();
}

?>
