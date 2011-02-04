<?php
  echo genHTML('PHP Version', version_compare(PHP_VERSION, '5.2.0', '>='));
  echo genHTML('PHP-XML (DOMElement) Installation', class_exists('DOMElement'));
  
  require_once("config.inc.php");
  //check PHP CLI
  $str=exec(PHP_CLI_PATH.'php -r "echo \'hello world\';"');
  echo genHTML('PHP-CLI Installation', ($str=='hello world'));
  
  
  function genHTML($item, $status)
  {
    if ($status===true)
      return "$item: <font color=\"green\">PASSED</font> <br />\n";
    else
      return "$item: <font color=\"red\">FAILED</font> <br />\n";
  }
?>