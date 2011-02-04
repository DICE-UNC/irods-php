<?php
  session_start();
  /* Get the Browser data */

  if((ereg("Nav", $_SERVER["HTTP_USER_AGENT"])) || (ereg("Gold", $_SERVER["HTTP_USER_AGENT"])) || (ereg("X11", $_SERVER["HTTP_USER_AGENT"])) || (ereg("Mozilla", getenv("HTTP_USER_AGENT"))) || (ereg("Netscape", $_SERVER["HTTP_USER_AGENT"])) AND (!ereg("MSIE", $_SERVER["HTTP_USER_AGENT"])) AND (!ereg("Konqueror", $_SERVER["HTTP_USER_AGENT"]))) $browser = "Netscape";

  // Opera needs to be above MSIE as it pretends to be an MSIE clone
  elseif(ereg("Opera", $_SERVER["HTTP_USER_AGENT"])) $browser = "Opera";
  elseif(ereg("MSIE", $_SERVER["HTTP_USER_AGENT"])) $browser = "MSIE";
  elseif(ereg("Lynx", $_SERVER["HTTP_USER_AGENT"])) $browser = "Lynx";
  elseif(ereg("WebTV", $_SERVER["HTTP_USER_AGENT"])) $browser = "WebTV";
  elseif(ereg("Konqueror", $_SERVER["HTTP_USER_AGENT"])) $browser = "Konqueror";
  elseif((eregi("bot", $_SERVER["HTTP_USER_AGENT"])) || (ereg("Google", $_SERVER["HTTP_USER_AGENT"])) || (ereg("Slurp", $_SERVER["HTTP_USER_AGENT"])) || (ereg("Scooter", $_SERVER["HTTP_USER_AGENT"])) || (eregi("Spider", $_SERVER["HTTP_USER_AGENT"])) || (eregi("Infoseek", $_SERVER["HTTP_USER_AGENT"]))) $browser = "Bot";
  else $browser = "Other";
  //echo $browser; 
  //echo "<p>";
  
  /* Get the Operating System data */

  if(ereg("Win", $_SERVER["HTTP_USER_AGENT"])) $os = "Windows";
  elseif((ereg("Mac", $_SERVER["HTTP_USER_AGENT"])) || (ereg("PPC", getenv("HTTP_USER_AGENT")))) $os = "Mac";
  elseif(ereg("Linux", $_SERVER["HTTP_USER_AGENT"])) $os = "Linux";
  elseif(ereg("FreeBSD", $_SERVER["HTTP_USER_AGENT"])) $os = "FreeBSD";
  elseif(ereg("SunOS", $_SERVER["HTTP_USER_AGENT"])) $os = "SunOS";
  elseif(ereg("IRIX", $_SERVER["HTTP_USER_AGENT"])) $os = "IRIX";
  elseif(ereg("BeOS", $_SERVER["HTTP_USER_AGENT"])) $os = "BeOS";
  elseif(ereg("OS/2", $_SERVER["HTTP_USER_AGENT"])) $os = "OS/2";
  elseif(ereg("AIX", $_SERVER["HTTP_USER_AGENT"])) $os = "AIX";
  else $os = "Other";
  //echo $os; 
  //echo "<p>";
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" 
    "http://www.w3.org/TR/html4/strict.dtd">
    
<html>
<head>
  <title>iRods Browser</title>
  <link rel="stylesheet" type="text/css" href="extjs/resources/css/ext-all.css" />
  <link rel="stylesheet" type="text/css" href="css/misc.css" />
  <link rel="stylesheet" type="text/css" href="css/apps.css" />
  <link rel="stylesheet" type="text/css" href="css/tree.css" />
  <link rel="stylesheet" type="text/css" href="css/RODSGridView.css" />
  <link rel="stylesheet" type="text/css" href="css/icons.css" />
  <link rel="stylesheet" type="text/css" href="css/buttons.css" />
  <link rel="stylesheet" type="text/css" href="css/desktop.css" />
  
  <!-- LIBS -->  
  <script src="js/parse_uri.js"></script>
  <script type="text/javascript" src="extjs/adapter/ext/ext-base.js"></script>
  <script type="text/javascript" src="extjs/ext-all-debug.js"></script>
  <script src="yui/build/yahoo/yahoo-min.js"></script>
  <script src="yui/build/event/event-min.js"></script>
  <script src="yui/build/history/history-min.js"></script>
  <!-- ENDLIBS -->
  
  <script type="text/javascript">
    Ext.BLANK_IMAGE_URL='images/s.gif';
    Ext.SSL_SECURE_URL='blank.html';
    if (location.protocol=='https')
      Ext.isSecure=true;  
  </script>  
  <script type="text/javascript" src="js/config.js.php">	</script>
  <script type="text/javascript" src="js/util.js"></script>
  <script type="text/javascript" src="js/ErrorHandlers.js">	</script>
  <script type="text/javascript" src="js/Tips.js"></script>
  <script type="text/javascript" src="js/PHPSessionManager.js"></script>
  <script type="text/javascript" src="js/UserPref.js"></script>
  
  <script type="text/javascript" src="js/RODSRequests.js"></script>
  <script type="text/javascript" src="js/TextEditorWindow.js"></script>
  <script type="text/javascript" src="js/ImageViewerWindow.js"></script>
  
  <script type="text/javascript" src="js/HelperApplet.js"></script>
  <script type="text/javascript" src="js/RODSAppMgr.js"></script>
  <script type="text/javascript" src="js/RODSAppWindow.js"></script>
  
  <script type="text/javascript" src="js/LRPProgressWindow.js"></script>
  <script type="text/javascript" src="js/RODSAccountWindow.js"></script>
  <script type="text/javascript" src="js/RODSTreePanel.js"></script>
  <script type="text/javascript" src="js/RODSGridView.js"></script>
  <script type="text/javascript" src="js/RODSGridPanel.js"></script>
  <script type="text/javascript" src="js/LogGridPanel.js"></script>
  <script type="text/javascript" src="js/RODSBrowserPanel.js"></script>
	<script type="text/javascript" src="js/RODSDesktop.js">	</script>
	<script type="text/javascript" src="js/InitDesktop.js">	</script>
	
</head>
<!-- <body scroll="no" id="body"> -->
<body id="body">  
  <?php // add iframe for yui-history if client browser is IE
    if ($browser=='MSIE')
      echo '<iframe id="yui-history-iframe" src="blank.html"></iframe>'."\n";
  ?>
  <input id="yui-history-field" type="hidden">
  
  <noscript>
    This application requires Javascript enabled in your browser.
  </noscript>
  
  <script type="text/javascript">
    initDesktop();
  </script>
  <div id="north"></div>
  <div id="center">
  </div>
  
  <!--
  <div id="account-window"></div>  
  <div id="log-window"></div>
  -->
</body>
</html>
