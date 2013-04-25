<?php
/**
 * Developer: Daniel Speichert
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
    //$account = new RODSAccount('localhost', 1247, 'rods', 'rods');
    $account = new RODSAccount('localhost', 1247, 'a', 'a', '', '', 'RpO7kyGvh40egRz');

    $myfile = new ProdsFile($account, "/tempZone/home/rods/phrases.html");

    //header('Content-Type: image/png');

    //read and print out the file
    $myfile->open("r");
    //while($str=$myfile->read(4096))
    //$str=file_get_contents("rods://rods:rods@localhost:1247/tempZone/home/rods/testphoto.png");
    $str = file_get_contents("rods+ticket://a#RpO7kyGvh40egRz:a@localhost:1247/tempZone/home/rods/phrases.html");
    echo $str;
    //close the file pointer
    $myfile->close();

} catch (RODSException $e) {

    echo "--- test failed! --- <br/>\n";
    echo ($e);
    echo $e->showStackTrace();
}