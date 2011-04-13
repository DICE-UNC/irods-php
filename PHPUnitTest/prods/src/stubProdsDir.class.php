<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of stubProdsDir
 *
 * @author lisa
 */
require_once dirname(__FILE__) . '/../../../prods/src/ProdsPath.class.php';
require_once dirname(__FILE__) . '/../../../prods/src/ProdsDir.class.php';
require_once dirname(__FILE__) . '/../../../prods/src/RODSAccount.class.php';

class stubProdsDir extends ProdsDir {



 /**
	* Default Constructor.
	*
	* @param RODSAccount account iRODS account used for connection
	* @param string $path_str the path of this dir
	* @param boolean $verify whether verify if the path exsits
	* @param RODSDirStats $stats if the stats for this dir is already known, initilize it here.
	* @return a new ProdsDir
	*/
    public function __construct(RODSAccount &$account, $path_str, $verify=false,
    RODSDirStats $stats=NULL)
    {
        parent::__construct($account, $path_str, $verify, $stats);
    }

    public function exists()
    {
        return true;
    }

    public function toURI()
    {
        $retval = $this->account->user.
           (empty($this->account->zone)?'':'.'.$this->account->zone).
           "@".$this->account->host.":".$this->account->port;
        return ($retval.$this->path_str);
    }

    public function getPosition()
    {
        return $this->position;
    }
}
?>
