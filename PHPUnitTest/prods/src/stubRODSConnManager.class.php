<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of stubRODSConnManager
 *
 * @author lisa
 */
require_once dirname(__FILE__) . '/../../../prods/src/RODSConnManager.class.php';
require_once dirname(__FILE__) . '/../../../prods/src/RODSAccount.class.php';
require_once dirname(__FILE__) . '/../../../prods/src/RODSConn.class.php';
require_once dirname(__FILE__) . '/stubRODSConn.class.php';

class stubRODSConnManager extends RODSConnManager {
    public function  __construct() {
        parent::__construct();
    }

    public static function getConn(RODSAccount $account) {
        return new stubRODSConn($account);
    }

    public static function releaseConn(RODSConn $conn) {
    }
}
?>
