<?php

/*
 *
 * Repo: https://github.com/SimonWaldherr/loginCtrl
 * Demo: http://cdn.simon.waldherr.eu/projects/loginCtrl/
 * License: MIT
 * Version: 0.10
 *
 * File: salt/index.php
 *
 */

include './../session.inc.php';
startsession();

function randomsalt()
  {
    $timestamp   = $_POST['timestamp'];
    
    //make some random stuff
    $random[0]   = rand(111111,999999);
    $random[1]   = rand(111111,999999);
    $random[2]   = rand(111111,999999);
    $random[3]   = rand(111111,999999);
    $random[4]   = rand(111111,999999);
    $random[5]   = rand(111111,999999);
    $random[6]   = rand(111111,999999);
    $random[7]   = rand(111111,999999);
    
    //hash the random stuff
    $return = hash("SHA512", $random[rand(0,7)].$random[rand(0,7)].$random[rand(0,7)].$random[rand(0,7)]);
    $return = hash("SHA512", $return.$timestamp.$random[rand(0,7)].$random[rand(0,7)].$random[rand(0,7)]);
    $return = hash("SHA512", $return.$random[rand(0,7)].$random[rand(0,7)].$random[rand(0,7)].rand(0,99));
    
    //return the random stuff
    $return = hash("SHA512", $return);
    return $return;
  }

if((!isset($_SESSION['salt']))||((time() - $_SESSION['timestamp']) > 600))
  {
    $randsalt = randomsalt();
    $_SESSION['salt'] = $randsalt;
    $_SESSION['timestamp'] = time();
    echo json_encode(array('salt'     => $randsalt
                          ,'code'    => 35
                          ,'success' => true));
  }
else
  {
    echo json_encode(array('salt'     => $_SESSION['salt']
                          ,'code'    => 34
                          ,'success' => true));
  }

die();

?>