<?php

/*
 *
 * Repo: https://github.com/SimonWaldherr/loginCtrl
 * Demo: http://cdn.simon.waldherr.eu/projects/loginCtrl/
 * License: MIT
 * Version: 0.09
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

?><html>
<head>
  <meta charset="utf-8">
  <title>reqwest login/signup demos</title>
  
  <link href="./style.css?v0.04" rel="stylesheet" type="text/css">
  <link href="./popover.css?v0.04" rel="stylesheet" type="text/css">
  <script type="text/javascript" src="./repos/reqwest/reqwest.min.js?v0.04"></script>
  <script type="text/javascript" src="./repos/jsHashes/client/src/hashes.min.js?v0.04"></script>
  <script type="text/javascript" src="./repos/lightbox.js/tinybox.js?v0.04"></script>
  <script type="text/javascript" src="./script.js?v0.04"></script>
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
        var aktiv = window.setInterval("getSalt();", 192000);
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
        document.getElementById('changebox').style.display = 'block';
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

?></div>
    </div>
  </div>
  <div id="box" class="roundborder box" style="height: 710px;">
    <div id="boxinbox" class="roundborder boxinbox">
      <form action="./contact/" method="post" id="contactForm" onsubmit="return false;">
        <div id="signupbox" class="boxes">
          <ul>
            <li><label for="name">Name:</label><input type="text" name="name" id="name"></li>
            <li><label for="email">E-Mail:</label><input type="text" name="email" id="email"></li>
            <li><label for="pass">Password:</label><input type="password" name="pass" id="pass"></li>
            
            <li class="submitbutton" onclick="javascript:ajaxsignup();"><span id="btnsignup" class="btn">signup</span></li>
          </ul>
        </div>
        
        <div id="spaceone" class="spacing"></div>
        
        <div id="loginbox" class="boxes">
          <ul>
            <li><label for="lemail">E-Mail:</label><input type="text" name="lemail" id="lemail"></li>
            <li><label for="lpass">Password:</label><input type="password" name="lpass" id="lpass"></li>
            <li><label for="ssi">stay signed in:</label><input type="checkbox" name="ssi" id="ssi"></li>
            <li class="submitbutton" onclick="javascript:ajaxlogin();"><span id="btnlogin" class="btn">login</span></li>
          </ul>
        </div>
        
        <div id="spacetwo" class="spacing"></div>
        
        <div id="logoutbox" class="boxes">
          <ul>
            <li class="submitbutton" onclick="javascript:ajaxlogout();"><span id="btnlogout" class="btn">logout</span></li>
          </ul>
        </div>
        
        <div class="spacing"></div>
        
        <div id="clearbox" class="boxes">
          <ul>
            <li class="submitbutton" onclick="javascript:ajaxclear();"><span id="btnclear" class="btn">clear</span></li>
          </ul>
        </div>
        
        <div class="spacing"></div>
        
        <div id="changebox" class="boxes">
          <ul>
            <li><label for="nname">Name:</label><input type="text" name="nname" id="nname"></li>
            <li><label for="nemail">E-Mail:</label><input type="text" name="nemail" id="nemail"></li>
            <li><label for="npass">Password:</label><input type="password" name="npass" id="npass"></li>
            <li class="submitbutton" onclick="javascript:ajaxchange();"><span id="btnsignup" class="btn">change</span></li>
          </ul>
        </div>
      </form>
    </div>
  </div>
</body>
</html>
