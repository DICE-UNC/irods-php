#irods-php
=========

## PHP API for iRODS

#### Version: 4.0.2.6-SNAPSHOT
#### Release: TBD
#### Git Tag: TBD

##### This is the canonical iRODS PHP API and deprecates the PHP API that was hosted on code.renci.org

PHP Core API and PRODS Web Browser for iRODS.

## Features and Bug Fixes

#### mkdir fails on iRODS 4.0 #6

Updated to use the new CollInpNew_PI API number 681

#### ProdsFile->write fails on iRODS 4.0 #9

Updated packing instructions for File read(), seek(), open(), close(), write() to use OpenedDataObjInp, replacing deprecated API

####  Bug fixes when using irods PHP streamer #14 

Community pull request to clean up  a few bugs with streaming

####   Allow to specify a proxy user for a connection #13 

This allows you to specify a proxy_user for a connection. As a proxy user you can alias (similar to su in linux) for a different user (as an admin).

This feature is documented for the icommands here (where you set the clientUserName environment variable):
https://docs.irods.org/4.1.3/manual/authentication/
https://wiki.irods.org/index.php/user_environment

#### Remove old web interface #16 

Old web interface was long deprecated and has been replaced by cloud browser
