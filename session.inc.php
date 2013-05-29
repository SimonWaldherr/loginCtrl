<?php

/*
 *
 * Repo: https://github.com/SimonWaldherr/loginCtrl
 * Demo: http://cdn.simon.waldherr.eu/projects/loginCtrl/
 * License: MIT
 * Version: 0.11
 *
 * File: session.inc.php
 *
 */

function startsession()
  {
    Header('X-Powered-By:0xBADCAB1E');
    session_name('sessionid');
    session_start();
    
    if($_SESSION['userid'] != '')
      {
        if($_SESSION['client'] != $_SERVER["HTTP_USER_AGENT"].$_SERVER["REMOTE_ADDR"])
          {
            delusersession();
          }
        if(($_SESSION['ssi'] != true)&&(($_SESSION['logints']+3000)<time()))
          {
            delusersession();
          }
        if(($_SESSION['ssi'] != true)&&(($_SESSION['logints']+2000)<time()))
          {
            $_SESSION['logints'] = time();
          }
      }
  }

function delusersession()
  {
    $_SESSION['userid']   = '';
    $_SESSION['username'] = '';
    $_SESSION['usermail'] = '';
    $_SESSION['signupts'] = '';
    $_SESSION['logints']  = '';
    $_SESSION['client']   = '';
    $_SESSION['ssi']      = '';
    unset($_SESSION['userid']);
    unset($_SESSION['username']);
    unset($_SESSION['usermail']);
    unset($_SESSION['signupts']);
    unset($_SESSION['logints']);
    unset($_SESSION['client']);
    unset($_SESSION['ssi']);
  }

function clearsession()
  {
    session_unset();
    session_destroy();
    session_write_close();
    setcookie(session_name(),'',0,'/');
    session_regenerate_id(true);
  }

function redirect($url)
  {
    header("HTTP/1.1 301 Moved Permanently");
    header("Location: $url");
  }

?>
