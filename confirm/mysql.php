<?php

/*
 *
 * Repo: https://github.com/SimonWaldherr/loginCtrl
 * Demo: http://cdn.simon.waldherr.eu/projects/loginCtrl/
 * License: MIT
 * Version: 0.12
 *
 * File: confirm/mysql.php
 *
 */

include './../session.inc.php';
startsession();

include './../repos/easySQL/easysql_mysql.php';
include './../repos/easySQL/examples/crypto.php';
include './../database/mysql-config.php';

$emailadr = urldecode($_GET['email']);
$username = urldecode($_GET['username']);
$checksum = strtolower($_GET['check']);

$select             = $mysqlarray;
$select['emailadr'] = $emailadr;

$returnarray = easysql_mysql_select($select, 1);

$confirmCode = hash("whirlpool", 'confirmMail("' . $returnarray[0]['emailadr'] . $returnarray[0]['timestam'] . $returnarray[0]['username'] . $returnarray[0]['id'] . '");');




if (($checksum == md5($confirmCode)) && ($returnarray[0]['status'] == 1)) {
    $update                = $mysqlarray;
    $update[2]['emailadr'] = $returnarray[0]['emailadr'];
    $update[3]['timestam'] = time();
    $update[3]['status']   = 2;

    easysql_mysql_update($update);

    $_SESSION['userid']    = $returnarray[0]['uid'];
    $_SESSION['username']  = $returnarray[0]['username'];
    $_SESSION['usermail']  = $returnarray[0]['emailadr'];
    $_SESSION['signupts']  = $returnarray[0]['timestam'];
    $_SESSION['logints']   = time();
    $_SESSION['client']    = $_SERVER["HTTP_USER_AGENT"] . $_SERVER["REMOTE_ADDR"];
    $_SESSION['salt']      = hash("whirlpool", $_SERVER["HTTP_USER_AGENT"] . $_SERVER["REMOTE_ADDR"] . time() . rand(111, 99999999));
    $_SESSION['timestamp'] = time();
    redirect('http://cdn.simon.waldherr.eu/projects/loginCtrl/example.php');
} elseif ($returnarray[0]['status'] != 1) {
    echo 'this Account is already activated.';
} else {
    echo 'Error 24: The confirmcode isn&rsquo;t correct, please check the code try again.';
}

?>
