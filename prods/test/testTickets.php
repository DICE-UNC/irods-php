<?php
/**
 * Developer: Daniel Speichert <s@drexel.edu>
 * Date: 14.12.12
 * Time: 13:40
 */
require_once("../src/Prods.inc.php");
require_once("../src/ProdsStreamer.class.php");

error_reporting(-1);
try {
    // make an iRODS account object for connection, assuming:
    // username: demouser, password: demopass, server: srbbrick15.sdsc.edu, port: 1247
    // $host, $port, $user, $pass, $zone = "", $default_resc = "", $ticket = ''
    $account = new RODSAccount('localhost', 1247, 'rods', 'rods');
    //$account = new RODSAccount('localhost', 1247, 'a', 'a', '', '', 'RpO7kyGvh40egRz');

    $ProdsTicket = new ProdsTicket($account);

    // public function createTicket( $object, $permission = 'read', $ticket = '' )
    $ticket = $ProdsTicket->createTicket('/tempZone/home/rods/as');
    echo 'Created ticket '.$ticket.'<br />';

    // public function deleteTicket( $ticket )
    $ProdsTicket->deleteTicket($ticket);
    echo 'Deleted ticket '.$ticket.'<br />';

    echo "You have to trust this test since the ticket doesn't exist anymore and you can't check it!";

} catch (RODSException $e) {

    echo "--- test failed! --- <br/>\n";
    echo ($e);
    echo $e->showStackTrace();
}