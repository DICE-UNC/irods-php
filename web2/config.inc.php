<?php
  define("PRODS_INC_PATH", dirname(__FILE__)."/../prods/src/Prods.inc.php");
  
  /**
   * Whether render log window
   */
  define("CLIENT_LOG", true);
  
  /**
   * data directory for iRODS Browser. Use absolute path only!
   * iRODS Browser needs a directory to store temprary working data, such as long running processes.
   * this directory must be readable and writeable for Apache/PHP. 
   * If the directory doesn't exist, this script will attempt to create one
   * Preferable, this directory should not be under document root, to prevent unintended access
   */
  define("DATA_DIR", sys_get_temp_dir().'/ibrwsr-data');
  define("LRP_DATA_DIR", DATA_DIR.'/lrp');
  
  /*
   * The long running tasks will be removed if they are too old (now - mtime). 
   * This macro define how many seconds the task (few log files) should be 
   * kept on the web server.
   */
  define("LRP_GC_MAXLIFETIME", 3600*3);
  
  /**
   * PHP CLI path, PHP CLI is required: http://us3.php.net/features.commandline
   * On most of systems, PHP-CLI is aleady installed, and included in shell path. 
   * Leave it blank if that's the case. 
   * If PHP-CLI path is not incuded in shell PATH, specified it here. A common place 
   * is '/usr/bin/' for linux/unix
   */
   define("PHP_CLI_PATH", ''); 
  
  /**
   * define the server's OS type, if not detected automatically by PHP.
   * support OS's are 'unix' and 'windows'. Note that this option 
   * will not take effect if the PHP script can detect it from $_SERVER["OS"];
   */
  define("ASSUMED_OS_TYPE", 'unix'); 
   
  if (isset($_SERVER["OS"])) 
    define("OS_TYPE", $_SERVER["OS"]);
  else
    define("OS_TYPE", ASSUMED_OS_TYPE);
  
  /**
   * PHP session max life in seconds. This attempts to overwrite default value:
   * 'session.gc_maxlifetime'
   * in "php.ini" file (normally 24 min only). This is how long you want to keep
   * the user to have the same PHP session, which contains account info etc.
   * It is recommended to keep it relately long enough for a user to have
   * the browser window open. Default setting is 1 week.
   */
  //define("PHP_SESSION_MAX_LIFE", 3600*24*7); 
  
  /* ----- Do not modify lines below ----- */
  
  require_once(PRODS_INC_PATH);
  require_once("RODSAcctManager.class.php");
  require_once("services/util.php");
  
  define("PRODS_PATH_TYPE_DIR", 0); 
  define("PRODS_PATH_TYPE_FILE", 1); 
  
  /*
  // path for cookies
  $cookie_path = "/";
  // timeout value for the cookie
  $cookie_timeout = PHP_SESSION_MAX_LIFE; // in seconds
  // timeout value for the garbage collector
  //   we add 300 seconds, just in case the user's computer clock
  //   was synchronized meanwhile; 600 secs (10 minutes) should be
  //   enough - just to ensure there is session data until the
  //   cookie expires
  $garbage_timeout = $cookie_timeout + 600; // in seconds
  // set the PHP session id (PHPSESSID) cookie to a custom value
  session_set_cookie_params($cookie_timeout, $cookie_path);
  // over write session garbage collection time, and save path
  // as the defaults are normally too short.
  ini_set("session.gc_maxlifetime", $garbage_timeout);
  // we need a distinct directory for the session files,
  //   otherwise another garbage collector with a lower gc_maxlifetime
  //   will clean our files aswell - but in an own directory, we only
  //   clean sessions with our "own" garbage collector (which has a
  //   custom timeout/maxlifetime set each time one of our scripts is
  //   executed)
  strstr(strtoupper(substr(OS_TYPE, 0, 3)), "WIN") ? 
  	$sep = "\\" : $sep = "/";
  $sessdir = ini_get('session.save_path').$sep."rodsbrowser_sessions";
  if (!is_dir($sessdir)) { mkdir($sessdir, 0777); }
  ini_set('session.save_path', $sessdir);
  */
  
  /* initialize data directory */
  initDataDir(DATA_DIR);
  function initDataDir($dirname)
  {
    if (file_exists($dirname)) {
      if (!is_writable($dirname))
        throw new Exception("initDataDir failed.1"); 
    } else {
      if(true!==mkdir($dirname, 0755, true))
        throw new Exception("initDataDir failed.2 unable to create data dir: '$dirname' "); 
    }
  }
  
  require_once("services/LRPTasks/LRPTask.class.php");
  require_once("services/LRPTasks/LRPDelete.class.php");
?>