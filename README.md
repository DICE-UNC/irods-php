#irods-php
=========

## PHP API for iRODS

#### Version: 4.0.3-SNAPSHOT
#### Release: TBD
#### Git Tag: TBD

##### This is the canonical iRODS PHP API and deprecates the PHP API that was hosted on code.renci.org

PHP Core API and PRODS Web Browser for iRODS.

## Features and Bug Fixes

#### mkdir fails on iRODS 4.0 #6

Updated to use the new CollInpNew_PI API number 681


#### ProdsFile->write fails on iRODS 4.0 #9

Updated packing instructions for File read(), seek(), open(), close(), write() to use OpenedDataObjInp, replacing deprecated API
