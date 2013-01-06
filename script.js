/*
 *
 * Repo: https://github.com/SimonWaldherr/loginCtrl
 * Demo: http://cdn.simon.waldherr.eu/projects/loginCtrl/
 * License: MIT
 * Version: 0.09
 *
 */

function getValue(id)
  {
    return document.getElementById(id).value;
  }

function getHTML(id)
  {
    return document.getElementById(id).innerHTML;
  }

function getSalt()
  {
    reqwest(
      {
          url: './salt/'
        , type: 'html'
        , method: 'post'
        , data: { timestamp: gettimestamp() }
        , success: function (resp)
            {
              serversalt = resp;
            }
      })
  }

function getHPW(mail, pwd)
  {
    var SHA512 = new Hashes.SHA512;
    var mail   = mail.toLowerCase();
    var str    = 'X'+pwd+'X'+mail+'X';
    var hpwd   = SHA512.b64(str);
    return hpwd;
  }

function getHSHPW(idmail, idpwd, salt)
  {
    var SHA512 = new Hashes.SHA512;
    var mail   = getValue(idmail).toLowerCase();
    var pwd    = getValue(idpwd);
    var str    = 'X'+pwd+'X'+mail+'X';
    var hpwd   = SHA512.b64(str);
    var hshpwd = SHA512.b64('PW'+hpwd+salt+'/PW');
    return hshpwd;
  }

function ajaxsignup()
  {
    var SHA512 = new Hashes.SHA512;
    var hpw    = getHPW(getValue('email'), getValue('pass'));
    var hpw1   = SHA512.hex(hpw.substr(0,48)+hpw);
    var hpw2   = SHA512.hex(hpw.substr(46)+hpw);
    if((getValue('email')=='')||(getValue('name')=='')||(getValue('pass')==''))
      {
        popover('Please fill every field');
        return false;
      }
    reqwest(
      {
          url: './database/?signup'
        , type: 'json'
        , method: 'post'
        , data: { mail: getValue('email').toLowerCase(), hpwd1: hpw1, hpwd2: hpw2, name: getValue('name') }
        , success: function (resp)
            {
              if(resp['success'] == false)
                {
                  popover(resp['msg']);
                  return false;
                }
              else
                {
                  if(resp == 'new')
                    {
                      popoverredirect('we send you now a eMail, please click the link in the eMail to confirm your Account.');
                      window.setTimeout('window.location = "'+selfurl+'"', 22000);
                      return true;
                    }
                  else
                    {
                      popoverredirect(resp['msg']);
                      window.setTimeout('window.location = "'+selfurl+'"', 12000);
                      return true;
                    }
                }
            }
      })
  }

function ajaxchange()
  {
    var SHA512 = new Hashes.SHA512;
    var oldpw  = prompt("to make changes, you have to enter your password", "");
    if(oldpw == '')
      {
        popover('Please fill every field');
        return false;
      }
    var hpw = getHPW(session_usermail, oldpw);
    
    if(getValue('nemail') != '')
      {
        var usemail = getValue('nemail');
      }
    else
      {
        var usemail = session_usermail;
      }
    if(getValue('npass') != '')
      {
        var usepass = getValue('npass');
      }
    else
      {
        var usepass = oldpw;
      }
    
    var nhpw  = getHPW(usemail, usepass);
    var nhpw1 = SHA512.hex(nhpw.substr(0,48)+nhpw);
    var nhpw2 = SHA512.hex(nhpw.substr(46)+nhpw);
    
    var hpw1   = SHA512.hex(SHA512.hex(hpw.substr(0,48)+hpw)+serversalt+clientsalt);
    var hpw2   = SHA512.hex(hpw.substr(46)+hpw);
    
    reqwest(
      {
          url: './database/?change'
        , type: 'json'
        , method: 'post'
        , data: { salt: clientsalt, mail: session_usermail.toLowerCase(), nmail: getValue('nemail'), hpwd1: hpw1, hpwd2: hpw2, nhpwd1: nhpw1, nhpwd2: nhpw2, name: session_username, nname: getValue('nname') }
        , success: function (resp)
            {
              if(resp['success'] == false)
                {
                  popover(resp['msg']);
                  return false;
                }
              else
                {
                  if(resp['code'] == 43)
                    {
                      popoverredirect('we send you now a eMail, please click the link in the eMail to confirm your Account.');
                      window.setTimeout('window.location = "'+selfurl+'"', 22000);
                      return true;
                    }
                  else
                    {
                      popoverredirect('Your User-ID is: '+resp);
                      window.setTimeout('window.location = "'+selfurl+'"', 12000);
                      return true;
                    }
                }
            }
      })
  }

function ajaxlogin()
  {
    var SHA512 = new Hashes.SHA512;
    var hpw    = getHPW(getValue('lemail'), getValue('lpass'));
    var hpw1   = SHA512.hex(SHA512.hex(hpw.substr(0,48)+hpw)+serversalt+clientsalt);
    var hpw2   = SHA512.hex(hpw.substr(46)+hpw);
    var ssi    = false;
    if(document.getElementById('ssi').checked == true){ssi=true;}
    
    reqwest(
      {
          url: './database/?login'
        , type: 'json'
        , method: 'post'
        , data: { mail: getValue('lemail').toLowerCase(), hpwd1: hpw1, hpwd2: hpw2, salt: clientsalt, ssi: ssi }
        , success: function (resp)
            {
              if(resp['success'] == true)
                {
                  popoverredirect(resp['msg']);
                  window.setTimeout('window.location = "'+selfurl+'"', 12000);
                }
            }
      })
  }

function ajaxlogout()
{
  reqwest(
    {
        url: './database/?logout'
      , type: 'json'
      , method: 'post'
      , data: { logout: 'true', timestamp: gettimestamp() }
      , success: function (resp)
          {
            if(resp['success'] == true)
              {
                window.setTimeout('popoverredirect("logout successful")', 200);
                window.setTimeout('window.location = "'+selfurl+'"', 12000);
              }
          }
    })
}

function ajaxclear()
{

  reqwest(
    {
        url: './database/?logout'
      , type: 'json'
      , method: 'post'
      , data: { logout: 'true', clear: 'true', timestamp: gettimestamp() }
      , success: function (resp)
          {
            if(resp['success'] == true)
              {
                window.setTimeout('popoverredirect("logout successful")', 200);
                window.setTimeout('window.location = "'+selfurl+'"', 12000);
              }
          }
    })
}

function gettimestamp()
  {
    var nowts = new Date();
    return nowts.getTime();
  }

function getdata()
  {
    reqwest(
      {
          url: 'data.php?get=parameter'
        , type: 'html'
        , method: 'post'
        , data: { foo: 'bar', int: 100 }
        , success: function (resp)
            {
              document.getElementById('content1').innerHTML = resp;
            }
      })
    }

function popover(text)
  {
    TINY.box.show({html:text,width:300,minHeight:20});
  }

function popoverredirect(text)
  {
    TINY.box.show({html:text,width:300,minHeight:20,closejs:function(){jsredirect()}});
    
  }

function jsredirect()
  {
    window.setTimeout('window.location = "'+selfurl+'"', 200);
  }

function createSalt()
  {
    var SHA512 = new Hashes.SHA512;
    clientsalt = SHA512.hex(gettimestamp()+Math.random());
  }
