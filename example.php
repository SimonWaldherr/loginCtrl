<?php

/*
 *
 * Repo: https://github.com/SimonWaldherr/loginCtrl
 * Demo: http://cdn.simon.waldherr.eu/projects/loginCtrl/
 * License: MIT
 * Version: 0.12
 *
 * File: example.php
 *
 */

include './session.inc.php';
startsession();

if($_POST['logout'] == 'true')
  {
    delusersession();
    if($_POST['clear'] == 'true')
      {
        clearsession();
      }
  }

?><!DOCTYPE html><html>
<head>
  <meta charset="utf-8">
  <title>reqwest login/signup demos</title>
  <link type="text/css" href="./build/style.css" rel="stylesheet">
  <script type="text/javascript" src="./build/script.js"></script>
  <script>
    var userid, username, usermail, clientsalt, serversalt;
    var selfurl = 'http://cdn.simon.waldherr.eu/projects/loginCtrl/example.php';
    function scriptonload()
      {
        userid = document.getElementById('userid').innerHTML;
        username = document.getElementById('username').innerHTML;
        usermail = document.getElementById('usermail').innerHTML;
        
        if(userid != '')
          {
            showlogout();
          }
        else
          {
            showlogin();
            
          }
        getSalt();
        createSalt();
        var aktiv = window.setInterval("getSalt();", 540000); //1000*60*9 = 9 Minuten = 540000 Millisekunden
      }
    
    function showlogin()
      {
        
        document.getElementById('box').style.height = '480px';
        document.getElementById('signupbox').style.display = 'block';
        document.getElementById('loginbox').style.display = 'block';
        document.getElementById('logoutbox').style.display = 'none';
        document.getElementById('clearbox').style.display = 'none';
        document.getElementById('changebox').style.display = 'none';
      }
    
    function showlogout()
      {
        
        document.getElementById('box').style.height = '480px';
        document.getElementById('logoutbox').style.display = 'block';
        document.getElementById('clearbox').style.display = 'block';
        document.getElementById('signupbox').style.display = 'none';
        document.getElementById('loginbox').style.display = 'none';
        document.getElementById('spaceone').style.display = 'none';
        document.getElementById('spacetwo').style.display = 'none';
        //document.getElementById('changebox').style.display = 'block';
      }
  </script>
  
  <script>
    
    <?php
    
    echo 'var session_username = "'.$_SESSION['username']."\";\n";
    echo 'var session_usermail = "'.$_SESSION['usermail']."\";\n";
    echo 'var session_userid   = "'.$_SESSION['userid']."\";\n";
    echo 'var session_ssi      = "'.$_SESSION['ssi']."\";\n";
    echo 'var session_salt     = "'.$_SESSION['salt']."\";\n";
    
    ?>
    
  </script>
</head>
<body onload="scriptonload();">
  <div class="roundborder box" style="width:540px;">
    <div class="roundborder boxinbox">
      <div id="content">
<?php

if($_SESSION['username'] != '')
  {
    echo '<h1>Hello '.$_SESSION['username']."</h1>\n";
    echo '<h2>Information about your session:</h2>'."\n<br>";
    echo 'userid: <div id="userid">'.$_SESSION['userid']."</div>\n<br>";
    echo '<div id="oldpw"></div>';
    
    include './gravatar.php';
    
    echo 'username: <div id="username">'.getUserImg($_SESSION['usermail']).$_SESSION['username']."</div>\n<br>";
    echo 'usermail: <div id="usermail">'.$_SESSION['usermail']."</div>\n<br>";
    echo 'salt timestamp: '.$_SESSION['timestamp']."\n<br>\n<br>";
    echo 'signup timestamp: '.$_SESSION['signupts']."\n<br>";
    echo 'time since signup: '.(time()-$_SESSION['signupts'])."\n<br>\n<br>";
    echo 'login timestamp: '.$_SESSION['logints']."\n<br>";
    echo 'time since login: '.(time()-$_SESSION['logints'])."\n<br>";
  }
else
  {
    echo '<div id="userid"></div><div id="username"></div><div id="usermail"></div><div id="contentdiv">here you can put your content</div>';
  }

?>

      </div>
    </div>
  </div>
  <div id="box" class="roundborder box" style="height: 710px;">
    <div id="boxinbox input-prepend baf-input cente" class="roundborder boxinbox">
      <form action="./contact/" method="post" id="contactForm" onsubmit="return false;">
        <div id="signupbox" class="boxes">
          <div class="input-prepend baf-input cente">
            <label class="baf add-on w90" for="name">Name:</label><input type="text" name="name" id="name">
            <label class="baf add-on w90" for="email">E-Mail:</label><input type="text" name="email" id="email">
            <label class="baf add-on w90" for="pass">Password:</label><input type="password" name="pass" id="pass">
            <br/>
            <div class="baf" onclick="javascript:ajaxsignup('email', 'pass', 'name');"><span id="btnsignup" class="btn">signup</span></div>
          </div>
        </div>
        <div id="spaceone" class="spacing"></div>
        <div id="loginbox" class="boxes">
          <div class="input-prepend baf-input cente">
            <label class="baf add-on w90" for="lemail">E-Mail:</label><input type="text" name="lemail" id="lemail">
            <label class="baf add-on w90" for="lpass">Password:</label><input type="password" name="lpass" id="lpass"><br/>
            <label class="baf add-on w90" for="ssi">stay signed in:</label><input type="checkbox" name="ssi" id="ssi">
            <br/>
            <div class="baf" onclick="javascript:ajaxlogin('lemail', 'lpass', 'ssi');"><span id="btnlogin" class="btn">login</span></div>
          </div>
        </div>
        
        <div id="spacetwo" class="spacing"></div>
        
        <div id="logoutbox" class="boxes">
          <div>
            <div class="baf" onclick="javascript:ajaxlogout();"><span id="btnlogout" class="btn">logout</span></div>
          </div>
        </div>
        <div class="spacing"></div>
        <div id="clearbox" class="boxes">
          <div>
            <div class="baf" onclick="javascript:ajaxclear();"><span id="btnclear" class="btn">clear</span></div>
          </div>
        </div>
        <div class="spacing"></div>
        <div id="changebox" class="boxes">
          <div class="input-prepend baf-input cente">
            <label class="baf add-on w90" for="nname">Name:</label><input type="text" name="nname" id="nname">
            <label class="baf add-on w90" for="nemail">E-Mail:</label><input type="text" name="nemail" id="nemail">
            <label class="baf add-on w90" for="npass">Password:</label><input type="password" name="npass" id="npass">
            <br/>
            <div class="baf" onclick="javascript:ajaxchange('nemail', 'npass', 'nname');"><span id="btnsignup" class="btn">change</span></div>
          </div>
        </div>
      </form>
    </div>
  </div>
</body>
</html>
