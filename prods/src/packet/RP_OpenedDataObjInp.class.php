<?php

require_once(dirname(__FILE__) . "/../autoload.inc.php");

class RP_OpenedDataObjInp extends RODSPacket {

    private $KeyValPair_PI;

    const SEEK_START = 0;
    const SEEK_CURRENT = 1;
    const SEEK_END = 2;

    public function __construct($fd = -1,  $length = 0, $offset = 0, $whence = self::SEEK_START, $oprType = 0, $KeyValPair_PI = null) {
  
        if ($fd == -1) {
            throw new InvalidArgumentException("fd must be > -1");
        }

        if ($offset < 0) {
            throw new InvalidArgumentException("offset must be non negative");
        }

        if ($length < 0) {
            throw new InvalidArgumentException("length must be greater than or equal to  zero");
        }

        if ($oprType < 0) {
            throw new InvalidArgumentException("oprtType must be greater than zero");
        }
        
        if ($whence >= self::SEEK_START && $whence <= self::SEEK_END) {
            //ok
        } else {
            throw new InvalidArgumentException("invalid whence value");
        }
        if (!isset($KeyValPair_PI)) {
            $KeyValPair_PI = new RP_KeyValPair();
        }
        $packlets = array("l1descInx" => $fd, "len" => $length, "whence" => $whence, "oprType" => $oprType, "offset" => $offset, "bytesWritten" => 0, 'KeyValPair_PI' => $KeyValPair_PI);
        parent::__construct("OpenedDataObjInp_PI", $packlets);
    }

}
