<?php
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of stubConn
 *
 * @author lisa
 */
require_once dirname(__FILE__) . '/../../../prods/src/RODSConnManager.class.php';
require_once dirname(__FILE__) . '/../../../prods/src/RODSAccount.class.php';
require_once dirname(__FILE__) . '/../../../prods/src/RODSConn.class.php';
require_once dirname(__FILE__) . '/../../../prods/src/RODSDirStats.class.php';
require_once dirname(__FILE__) . '/../../../prods/src/RODSGenQueConds.class.php';
require_once dirname(__FILE__) . '/../../../prods/src/RODSGenQueSelFlds.class.php';
require_once dirname(__FILE__) . '/../../../prods/src/RODSGenQueResults.class.php';
require_once dirname(__FILE__) . '/../../../prods/src/RODSException.class.php';

class stubRODSConn extends RODSConn {
    private $meta_array = array('this is a test of metadata');
    private static $params = array();

    public function  __construct(RODSAccount &$account) {
        parent::__construct($account);
    }

    public function  __destruct() {
    }

    public function  getMeta($pathtype, $name) {
        //parent::getMeta($pathtype, $name);

        return $this->meta_array;
    }

    public function  addMeta($pathtype, $name, RODSMeta $meta) {
        //parent::addMeta($pathtype, $name, $meta);
        stubRODSConn::$params = array($pathtype, $name, $meta);
    }

    public function  rmMeta($pathtype, $name, RODSMeta $meta) {
        //parent::rmMeta($pathtype, $name, $meta);
        stubRODSConn::$params = array($pathtype, $name, $meta);
    }

    public function  rmMetaByID($pathtype, $name, $metaid) {
        //parent::rmMetaByID($pathtype, $name, $metaid);
        stubRODSConn::$params = array($pathtype, $name, $metaid);
    }

    public function  cpMeta($pathtype_src, $pathtype_dest, $name_src, $name_dest) {
        //parent::cpMeta($pathtype_src, $pathtype_dest, $name_src, $name_dest);
        stubRODSConn::$params = array($pathtype_src, $pathtype_dest, $name_src, $name_dest);
    }

    public function rename($path_src, $path_dest, $path_type) {
        //parent::rename($path_src, $path_dest, $path_type);
        stubRODSConn::$params = array($path_src, $path_dest, $path_type);
    }

    public function mkdir($dir) {
        //parent::rename($path_src, $path_dest, $path_type);
        stubRODSConn::$params = array($dir);
    }

    public function rmdir($dirpath,$recursive=true,$force=false,
    $additional_flags=array(), $status_update_func=null) {
        stubRODSConn::$params = array($dirpath, $recursive, $force, $additional_flags,
                                        $status_update_func);
    }

    public function  getDirStats($dirpath) {
        $stats = new RODSDirStats($dirpath, "me", "myZone", "01298479459", "01298479459", "1", "foo");
        return $stats;
        // parent::getDirStats($dirpath);
    }

    public function  query(RODSGenQueSelFlds $select, RODSGenQueConds $condition, $start = 0, $limit =-1) {
        //parent::query($select, $condition, $start, $limit);
        stubRODSConn::$params = array($select, $condition, $start, $limit);

        $name_array = array("/myZone");
        $owner_array = array("me");
        $zone_array = array("myZone");
        $create_array = array("01298479459");
        $modify_array = array("01298479459");
        $comment_array = array("foo");

        $names = $select->getNames();
        if(array_search("COL_D_DATA_ID", $names)) { //this is a file stats request - 2 files
            $id_array = array("2");
            $dname_array = array("first_file.txt");
            $dtype_array = array("generic");
            $dresc_array_= array("testResc");
            $dsize_array = array("1020157");
            $result_array = array(
                "COL_DATA_NAME" => $dname_array,
                "COL_COLL_NAME" => $name_array,
                "COL_D_DATA_ID" => $id_array,
                "COL_DATA_TYPE_NAME" => $dtype_array,
                "COL_DATA_RESC_NAME" => $dresc_array,
                "COL_DATA_SIZE" => $dszie_array,
                "COL_D_OWNER_NAME", $owner_array,
                "COL_D_OWNER_ZONE" => $zone_array,
                "COL_D_CREATE_TIME" => $create_array,
                "COL_D_MODIFY_TIME" => $modify_array,
                "COL_D_COMMENTS" => $comment_array
            );
        }
        else { // this is a dirs stats request - 1 directory
            $name_array = array("/myZone");
            $id_array = array("1");
            $owner_array = array("me");
            $zone_array = array("myZone");
            $create_array = array("01298479459");
            $modify_array = array("01298479459");
            $comment_array = array("foo");

            $result_array = array(
                "COL_COLL_NAME" => $name_array,
                "COL_COLL_ID" => $id_array,
                "COL_COLL_OWNER_NAME", $owner_array,
                "COL_COLL_OWNER_ZONE" => $zone_array,
                "COL_COLL_CREATE_TIME" => $create_array,
                "COL_COLL_MODIFY_TIME" => $modify_array,
                "COL_COLL_COMMENTS" => $comment_array
            );
        }

        if($limit == -1) {
            $total = 1;
        }
        else {
            $total = $limit;
        }

        $results = new RODSGenQueResults($total, $result_array);

        return $results;
    }

    public function  dirExists($dir) {
        parent::dirExists($dir);
    }

    public static function getParams() {
        return stubRODSConn::$params;
    }


}
?>
