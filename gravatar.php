<?php

/*
 *
 * Repo: https://github.com/SimonWaldherr/loginCtrl
 * Demo: http://cdn.simon.waldherr.eu/projects/loginCtrl/
 * License: MIT
 * Version: 0.10
 *
 * File: gravatar.php
 *
 */

function getUserImg($email)
  {
    $default = "http://cdn.simon.waldherr.eu/projects/loginCtrl/img/user.png";
    $size = 32;
    
    $grav_url = "http://www.gravatar.com/avatar/" . md5( strtolower( trim( $email ) ) ) . "?d=" . urlencode( $default ) . "&s=" . $size;
    $gimg_url = '<img src="'.$grav_url.'" alt="Userpicture '.$email.'" />';
    return $gimg_url;
  }

?>
