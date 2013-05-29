/*
 *
 * Repo: https://github.com/SimonWaldherr/loginCtrl
 * Demo: http://cdn.simon.waldherr.eu/projects/loginCtrl/
 * License: MIT
 * Version: 0.10
 *
 * File: script.js
 *
 */

function getValue(id) {
  return document.getElementById(id).value;
}

function getHTML(id) {
  return document.getElementById(id).innerHTML;
}

function getSalt() {
  majaX({
    url: './salt/',
    type: 'json',
    method: 'POST',
    data: {
      timestamp: gettimestamp()
    }},
    function (resp) {
      if (resp['success'] == true) {
        serversalt = resp['salt'];
      }
    }
  );
}

function getHPW(mail, pwd) {
  var SHA512 = new Hashes.SHA512;
  var mail = mail.toLowerCase();
  var str = 'X' + pwd + 'X' + mail + 'X';
  var hpwd = SHA512.b64(str);
  return hpwd;
}

function getHSHPW(idmail, idpwd, salt) {
  var SHA512 = new Hashes.SHA512;
  var mail = getValue(idmail).toLowerCase();
  var pwd = getValue(idpwd);
  var str = 'X' + pwd + 'X' + mail + 'X';
  var hpwd = SHA512.b64(str);
  var hshpwd = SHA512.b64('PW' + hpwd + salt + '/PW');
  return hshpwd;
}

function ajaxsignup(emailid, passwordid, nameid) {
  var SHA512 = new Hashes.SHA512;
  var hpw = getHPW(getValue(emailid), getValue(passwordid));
  var hpw1 = SHA512.hex(hpw.substr(0, 48) + hpw);
  var hpw2 = SHA512.hex(hpw.substr(46) + hpw);
  if ((getValue(emailid) == '') || (getValue(nameid) == '') || (getValue(passwordid) == '')) {
    popover('Please fill every field');
    return false;
  }
  majaX({
    url: './database/?signup',
    type: 'json',
    method: 'POST',
    data: {
      mail: getValue(emailid).toLowerCase(),
      hpwd1: hpw1,
      hpwd2: hpw2,
      name: getValue(nameid)
    }},
    function (resp) {
      if (resp['success'] == false) {
        popover(resp['msg']);
        return false;
      } else {
        if (resp == 'new') {
          popoverredirect('we send you now a eMail, please click the link in the eMail to confirm your Account.');
          window.setTimeout('window.location = "' + selfurl + '"', 22000);
          return true;
        } else {
          popoverredirect(resp['msg']);
          window.setTimeout('window.location = "' + selfurl + '"', 12000);
          return true;
        }
      }
    }
  );
}

function ajaxchange(emailid, passwordid, nameid) {
  var SHA512 = new Hashes.SHA512;
  var oldpw = prompt("to make changes, you have to enter your password", "");
  if (oldpw == '') {
    popover('Please fill every field');
    return false;
  }
  var hpw = getHPW(session_usermail, oldpw);

  if (getValue(emailid) != '') {
    var usemail = getValue(emailid).toLowerCase();
  } else {
    var usemail = session_usermail;
  }
  if (getValue(passwordid) != '') {
    var usepass = getValue(passwordid);
  } else {
    var usepass = oldpw;
  }

  var nhpw = getHPW(usemail, usepass);
  var nhpw1 = SHA512.hex(nhpw.substr(0, 48) + nhpw);
  var nhpw2 = SHA512.hex(nhpw.substr(46) + nhpw);

  var hpw1 = SHA512.hex(SHA512.hex(hpw.substr(0, 48) + hpw) + serversalt + clientsalt);
  var hpw2 = SHA512.hex(hpw.substr(46) + hpw);

  majaX({
    url: './database/?change',
    type: 'json',
    method: 'POST',
    data: {
      salt: clientsalt,
      mail: session_usermail.toLowerCase(),
      nmail: getValue(emailid),
      hpwd1: hpw1,
      hpwd2: hpw2,
      nhpwd1: nhpw1,
      nhpwd2: nhpw2,
      name: session_username,
      nname: getValue(nameid)
    }},
    function (resp) {
      if (resp['success'] == false) {
        popover(resp['msg']);
        return false;
      } else {
        if (resp['code'] == 43) {
          popoverredirect('we send you now a eMail, please click the link in the eMail to confirm your Account.');
          window.setTimeout('window.location = "' + selfurl + '"', 22000);
          return true;
        } else {
          popoverredirect('Your User-ID is: ' + resp['msg']);
          window.setTimeout('window.location = "' + selfurl + '"', 12000);
          return true;
        }
      }
    }
  );
}

function ajaxlogin(emailid, passwordid, ssiid) {
  var SHA512 = new Hashes.SHA512;
  var hpw = getHPW(getValue(emailid).toLowerCase(), getValue(passwordid));
  var hpw1 = SHA512.hex(SHA512.hex(hpw.substr(0, 48) + hpw) + serversalt + clientsalt);
  var hpw2 = SHA512.hex(hpw.substr(46) + hpw);
  var ssi = false;
  if (document.getElementById(ssiid).checked == true) {
    ssi = true;
  }

  majaX({
    url: './database/?login',
    type: 'json',
    method: 'POST',
    data: {
      mail: getValue(emailid).toLowerCase(),
      hpwd1: hpw1,
      hpwd2: hpw2,
      salt: clientsalt,
      ssi: ssi
    }},
    function (resp) {
      if (resp['success'] == true) {
        popoverredirect(resp['msg']);
        window.setTimeout('window.location = "' + selfurl + '"', 12000);
      } else {
        popover(resp['msg']);
      }
    }
  );
}

function ajaxlogout() {
  majaX({
    url: './database/?logout',
    type: 'json',
    method: 'POST',
    data: {
      logout: 'true',
      timestamp: gettimestamp()
    }},
    function (resp) {
      if (resp['success'] == true) {
        window.setTimeout('popoverredirect("logout successful")', 200);
        window.setTimeout('window.location = "' + selfurl + '"', 12000);
      }
    }
  );
}

function ajaxclear() {
  majaX({
    url: './database/?logout',
    type: 'json',
    method: 'POST',
    data: {
      logout: 'true',
      clear: 'true',
      timestamp: gettimestamp()
    }},
    function (resp) {
      if (resp['success'] == true) {
        window.setTimeout('popoverredirect("logout successful")', 200);
        window.setTimeout('window.location = "' + selfurl + '"', 12000);
      }
    }
  );
}

function gettimestamp() {
  var nowts = new Date();
  return nowts.getTime();
}

function popover(text) {
  TINY.box.show({
    html: text,
    width: 300,
    minHeight: 20
  });
}

function popoverredirect(text) {
  TINY.box.show({
    html: text,
    width: 300,
    minHeight: 20,
    closejs: function () {
      jsredirect()
    }
  });
}

function jsredirect() {
  window.setTimeout('window.location = "' + selfurl + '"', 200);
}

function createSalt() {
  var SHA512 = new Hashes.SHA512;
  clientsalt = SHA512.hex(gettimestamp() + ' ' + Math.random() * 1000);
  console.log(clientsalt);
}