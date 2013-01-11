<?php
/**
 * Developer: Daniel Speichert
 * Date: 14.12.12
 * Time: 13:40
 */
require_once("../src/Prods.inc.php");
require_once("../src/ProdsStreamer.class.php");

error_reporting(0);

// make an iRODS account object for connection, assuming:
// username: demouser, password: demopass, server: srbbrick15.sdsc.edu, port: 1247
$account = new RODSAccount('localhost', 1247, 'rods', 'rods');

$myfile=new ProdsFile($account,"/tempZone/home/rods/testphoto.png");

//header('Content-Type: image/png');

//read and print out the file
$myfile->open("r");
//while($str=$myfile->read())
//$str=file_get_contents("rods://rods:rods@localhost:1247/tempZone/home/rods/testphoto.png");
$str=file_get_contents("rods://rods:rods@localhost:1247/tempZone/home/rods/phrases.html");
    echo $str;
//close the file pointer
$myfile->close();
