<?php

/*
 *
 * Repo: https://github.com/SimonWaldherr/loginCtrl
 * Demo: http://cdn.simon.waldherr.eu/projects/loginCtrl/
 * License: MIT
 * Version: 0.10
 *
 * File: database/mysql.php
 *
 */

include './../session.inc.php';
include './../checkuserinput.inc.php';
startsession();

include './../repos/easySQL/easysql_mysql.php';
include './../repos/easySQL/crypto.php';
include './mysql-config.php';


function lc_login($mysqlarray, $emailadr, $hashdpwd1, $hashdpwd2, $clientsalt)
  {
    $username = fm_text($username, 0);
    $userhash = md5(strtolower($username).'lc');
    $emailadr = fm_email(strtolower($emailadr), 0);
    
    
    
    
    $select = $mysqlarray;
    $select['emailadr'] = $emailadr;
    
    $returnarray = array_reverse(easysql_mysql_select($select, 'no', 'AND'));
    
    foreach($returnarray as $user)
      {
        if(easysql_hashmix($hashdpwd2.$user['username'].$user['usersalt']) == $user['password2'])
          {
            if((hash("SHA512", $user['password1'].$_SESSION['salt'].$clientsalt) == $hashdpwd1)&&($user['status'] > 1))
              {
                $_SESSION['userid']   = $user['uid'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['usermail'] = $user['emailadr'];
                $_SESSION['signupts'] = $user['timestam'];
                $_SESSION['status']   = $user['status'];
                $_SESSION['logints']  = time();
                $_SESSION['client'] = $_SERVER["HTTP_USER_AGENT"].$_SERVER["REMOTE_ADDR"];
                if($_POST['ssi'] == 'true')
                  {
                    $_SESSION['ssi'] = true;
                  }
                return array('success'  => true
                            ,'msg'      => 'login successful'
                            ,'userid'   => $user['uid']
                            ,'username' => $user['username']
                            ,'usermail' => $user['emailadr']
                            ,'signupts' => $_SESSION['signupts']
                            ,'logints'  => $_SESSION['logints']);
              }
            elseif((hash("SHA512", $user['password1'].$_SESSION['salt'].$clientsalt) == $hashdpwd1)&&($user['status'] == 1))
              {
                return array('msg'     => 'please confirm your eMail-Adress first'
                            ,'success' => false);
              }
            else
              {
                $notyou = true;
              }
          }
        else
          {
            $notyou = true;
          }
      }
    if($notyou)
      {
        delusersession();
        return array('msg'     => 'wrong username or password'
                    ,'success' => false);
      }
  }








function lc_signup($mysqlarray, $username, $emailadr, $hashdpwd1, $hashdpwd2, $uid=false, $status = 1)
  {
    $username = fm_text($username, 0);
    $userhash = md5(strtolower($username).'lc');
    $emailadr = fm_email(strtolower($emailadr), 0);
    
    
    
    
    $create              = $mysqlarray;
    $create['id']        = 'integer NOT NULL PRIMARY KEY AUTO_INCREMENT';
    $create['uid']       = 'integer NOT NULL';
    $create['username']  = 'varchar(255) NOT NULL';
    $create['userhash']  = 'varchar(255) NOT NULL';
    $create['password1'] = 'varchar(255) NOT NULL';
    $create['password2'] = 'varchar(255) NOT NULL';
    $create['emailadr']  = 'varchar(255) NOT NULL';
    $create['status']    = 'integer NOT NULL';
    $create['timestam']  = 'integer NOT NULL';
    $create['usersalt']  = 'varchar(255) NOT NULL';
    $create['hash']      = 'varchar(255) NOT NULL';
    
    easysql_mysql_create($create);
    
    if(($username != '')&&($emailadr != false)&&(isset($hashdpwd1))&&(isset($hashdpwd2)))
      {
        if(!$uid)
          {
            
            $select              = $mysqlarray;
            $sorted = easysql_mysql_getsorted($select, 'uid', 1, true);
          }
        
        
        $select              = $mysqlarray;
        $select['username']  = $username;
        $select['emailadr']  = $emailadr;
        $returnarray = easysql_mysql_select($select, 'no', 'OR');
        
        if(is_array($returnarray))
          {
            foreach($returnarray as $user)
              {
                if(is_int($uid))
                  {
                    if($user['uid'] != $uid)
                      {
                        return '';
                      }
                  }
                else
                  {
                    if($user['userhash'] == $userhash)
                      {
                        $userexist = true;
                      }
                    if($user['emailadr'] == $emailadr)
                      {
                        $emailexist = true;
                      }
                  }
              }
            if(($userexist)&&($emailexist))
              {
                return array('msg'     => 'username and emailadress already taken'
                            ,'success' => false);
              }
            if($userexist)
              {
                return array('msg'     => 'username already taken'
                            ,'success' => false);
              }
            if($emailexist)
              {
                return array('msg'     => 'emailadress already taken'
                            ,'success' => false);
              }
          }
        
        
        $insert              = $mysqlarray;
        $insert['uid']       = ($sorted[0]['uid']+1);
        $insert['username']  = $username;
        $insert['userhash']  = $userhash;
        $insert['usersalt']  = hash("SHA256", rand(10000,100000000).$_SESSION['salt'].$username.rand(10000,100000000).microtime(1));
        $insert['password1'] = $hashdpwd1;
        $insert['password2'] = easysql_hashmix($hashdpwd2.$username.$insert['usersalt']);
        $insert['emailadr']  = $emailadr;
        $insert['status']    = $status;
        $insert['timestam']  = time();
        $insert['hash']      = md5($insert['uid'].$insert['username'].$insert['userhash'].$insert['usersalt'].$insert['password1'].$insert['password2'].$insert['emailadr'].$insert['status'].$insert['timestam']);
        
        
        $rowid[0] = easysql_mysql_insert($insert);
        $rowid[1] = $insert['hash'];
        
        if($rowid[0] > 0)
          {
            require_once './../sendmail.php';
            
            if($status == '1')
              {
                $confirmMail = hash("SHA256", 'confirmMail("'.$insert['emailadr'].$insert['timestam'].$insert['username'].$rowid[0].'");');
                $confirmURL = 'http://cdn.simon.waldherr.eu/projects/loginCtrl/confirm/?email='.urlencode($insert['emailadr']).'&username='.urlencode($insert['username']).'&check='.md5($confirmMail);
                $confirmText = 'Thank you for registering for loginCtrl.'."\r\n\r\n".'To confirm your registration, open the following link: '.$confirmURL."\r\n\r\n".'The preregistration in the Database will be deleted in approximately one week.'."\r\n".'If you received this email by mistake, simply delete it. You won&rsquo;t be subscribed if you don&rsquo;t click the confirmation link above.'."\r\n".'The registration was triggered by:'."\r\n\r\n".'USERAGENT: '.$_SERVER["HTTP_USER_AGENT"]."\r\n".'IP-ADRESS: '.$_SERVER["REMOTE_ADDR"]."\r\n".'TIMESTAMP: '.$_SERVER["REQUEST_TIME"]."\r\n\r\n".'For questions about this list, please contact: help@example.com';
                
                sendMail($emailadr, 'Please confirm your eMail-Adress to setup your loginCtrl Account', $confirmText);
              }
            
            return array('msg'     => 'your user Id is'.$rowid[0]
                        ,'code'    => 43
                        ,'success' => true);
          }
        else
          {
            return array('msg'     => 'your user Id is'.$rowid[0]
                        ,'code'    => 43
                        ,'success' => true);
          }
      }
    else
      {
        return array('msg'     => 'please fill all input fields correct'
                    ,'code'    => 44
                    ,'success' => false);
      }
  }

function lc_change()
  {
    
  }

# # # # # # # # # # END DEFINITION

if(isset($_GET['login']))
  {
    $login = lc_login($mysqlarray, $_POST['mail'], $_POST['hpwd1'], $_POST['hpwd2'], $_POST['salt']);
    if(is_numeric($login[0]))
      {
        echo json_encode($login);
      }
    else
      {
        echo json_encode($login);
      }
  }
elseif(isset($_GET['signup']))
  {
    $signuparray = lc_signup($mysqlarray, $_POST['name'], $_POST['mail'], $_POST['hpwd1'], $_POST['hpwd2']);
    echo json_encode($signuparray);
  }
elseif(isset($_GET['change']))
  {
    $login = lc_login($mysqlarray, $_SESSION['usermail'], $_POST['hpwd1'], $_POST['hpwd2'], $_POST['salt']);
    
    if(is_int($login[0]))
      {
        if($_POST['nname'] != ''){$nusername = $_POST['nname'];}
        else                     {$nusername = $_SESSION['username'];}
        
        if($_POST['nmail'] != ''){$nemailadr = $_POST['nmail']; $status = 1;}
        else                     {$nemailadr = $_SESSION['usermail']; $status = $_SESSION['status'];}
        
        if(($_POST['nhpwd1'] != '')&&($_POST['nhpwd2'] != '')){
        $nhashdpwd1 = $_POST['nhpwd1'];
        $nhashdpwd2 = $_POST['nhpwd2'];
        }else{
        $nhashdpwd1 = $_POST['hpwd1'];
        $nhashdpwd2 = $_POST['hpwd2'];
        }
        
        $clientsalt = $_POST['salt'];
        
        $signuparray = lc_signup($mysqlarray, $nusername, $nemailadr, $nhashdpwd1, $nhashdpwd2, $_SESSION['userid'], $status);
        
        $userdataChangeText = 'Your Account has changed by a user with the IP '.$_SERVER["REMOTE_ADDR"].' at the UNIX Timestamp '.$_SERVER["REQUEST_TIME"].'. The new data of this Account is:'."\n\n";
        $userdataChangeText .= 'Username: '.$nusername."\n";
        $userdataChangeText .= 'eMail adress: '.$nemailadr."\n";
        
        if(($_POST['nhpwd1'] != '')&&($_POST['nhpwd2'] != ''))
          {
            $userdataChangeText .= "\n".'The password has been changed'."\n";
          }
        
        $userdataChangeText .= 'The changes are applied permanently in approximately one week. If you do not want these changes, click the following link:'."\n";
        $userdataChangeText .= '';
        
        sendMail($_SESSION['usermail'], 'Your account has been changed, please confirm the changes.', $userdataChangeText);
        
      }
  }
elseif(isset($_GET['logout']))
  {
    if(($_POST['logout'] == 'true')&&($_SESSION['userid'] != ''))
      {
        delusersession();
        echo json_encode(array('msg'     => 'logout successful'
                              ,'code'    => 41
                              ,'success' => true));
      }
    if(($_POST['clear'] == 'true')&&($_SESSION['userid'] != ''))
      {
        clearsession();
        echo json_encode(array('msg'     => 'clear all successful'
                              ,'code'    => 42
                              ,'success' => true));
      }
  }

?>
