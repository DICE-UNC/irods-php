<?php

require_once("autoload.inc.php");

/**
 * Created by IntelliJ IDEA.
 * User: mconway
 * Date: 6/22/16
 * Time: 9:49 AM
 */
class IniParser
{

    public $defaultIni = "/etc/irods-ext/phptest.ini";
    public $ini_array;

    /**
     * IniParser constructor.
     */
    public function __construct()
    {
        $this->getIniData();
    }

    /**
     * return a properties array based on the expected /etc/irods-ext/phptest.ini file
     */
    private function getIniData()
    {
        $this->ini_array = parse_ini_file($this->defaultIni);
        print_r($this->ini_array);
        return $this->ini_array;
    }

    /**
     * Get the account for connection based on the init parameters for the
     */
    public function buildRodsAccountForTest1User()
    {

        $rodsAccount = new RODSAccount($this->ini_array["host"], $this->ini_array["port"], $this->ini_array["user1"],
            $this->ini_array["password1"], $this->ini_array["zone"], $this->ini_array["def-resc"]);
        print_r($rodsAccount);
        return $rodsAccount;

    }

}