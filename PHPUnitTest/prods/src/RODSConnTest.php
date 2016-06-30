<?php

require_once dirname(__FILE__) . '/IniParser.php';
require_once(dirname(__FILE__) . '/../../../prods/src/RODSConn.class.php');
require_once(dirname(__FILE__) . '/../../../prods/src/RODSMessage.class.php');
require_once(dirname(__FILE__) . '/../../../prods/src/RodsConst.inc.php');
require_once(dirname(__FILE__) . '/../../../prods/src/ProdsConfig.inc.php');
require_once(dirname(__FILE__) . '/../../../prods/src/packet/RP_StartupPack.class.php');


/**
 * Test class for RODSConn.
 * Generated by PHPUnit on 2011-02-24 at 16:39:15.
 */
class RODSConnTest extends PHPUnit_Framework_TestCase {

    protected $iniParser;

    /**
     * @var RODSConn
     */
    protected $object;

    /**
     * Sets up the fixture, for example, opens a network connection.
     * This method is called before a test is executed.
     */
    protected function setUp() {

        $this->iniParser = new IniParser();

    }

    /**
     * Tears down the fixture, for example, closes a network connection.
     * This method is called after a test is executed.
     */
    protected function tearDown() {

    }

    /**
     * @todo Implement testFileRead().
     */
    public function testConnect() {
        $account = $this->iniParser->buildRodsAccountForTest1User();
        $rodsConn = new RODSConn($account);
        $this->assertNotNull($rodsConn);
        $rodsConn->connect();
        $this->assertFalse($rodsConn->connected);
    }

}

?>
