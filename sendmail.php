<?php

/*
 *
 * Repo: https://github.com/SimonWaldherr/loginCtrl
 * Demo: http://cdn.simon.waldherr.eu/projects/loginCtrl/
 * License: MIT
 * Version: 0.11
 *
 * File: sendmail.php
 *
 */

require_once './../repos/smtpclass/SendEmail.php';

function sendMail($to, $subject, $text)
  {
    $e = new SendEmail();
    $e->set_server( 'smtp-server', 25);
    $e->set_auth('username', 'password');
    $e->set_sender( 'automatic sent mail by servername', 'mailadress' );
    $e->set_hostname('');
    $body = $text."\r\n";
    $e->mail($to, $subject, $body);
  }

?>
