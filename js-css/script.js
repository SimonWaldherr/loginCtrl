/*
 *
 * Repo: https://github.com/SimonWaldherr/loginCtrl
 * Demo: http://cdn.simon.waldherr.eu/projects/loginCtrl/
 * License: MIT
 * Version: 0.12
 *
 * File: script.js
 *
 */

/*globals majaX, serversalt:true, clientsalt:true, cryptofoo, popover, popoverredirect, selfurl, prompt, session_usermail, session_username, selfurl, TINY, jsredirect */
/*jslint browser: true, plusplus: true, indent: 2 */

function getValue(id) {
  "use strict";
  return document.getElementById(id).value;
}

function getHTML(id) {
  "use strict";
  return document.getElementById(id).innerHTML;
}

function gettimestamp() {
  "use strict";
  var nowts = new Date();
  return nowts.getTime();
}

function getSalt() {
  "use strict";
  majaX({
    url: './salt/',
    type: 'json',
    method: 'POST',
    data: {
      timestamp: gettimestamp()
    }
  }, function (resp) {
    if (resp.success === true) {
      serversalt = resp.salt;
    }
  });
}

function getHPW(mail, pwd) {
  "use strict";
  var str, hpwd;
  mail = mail.toLowerCase();
  str = 'X' + pwd + 'X' + mail + 'X';
  hpwd = cryptofoo.hash('whirlpool', str);
  return hpwd;
}

function getHSHPW(idmail, idpwd, salt) {
  "use strict";
  var mail, pwd, str, hpwd, hshpwd;
  mail = getValue(idmail).toLowerCase();
  pwd = getValue(idpwd);
  str = 'X' + pwd + 'X' + mail + 'X';
  hpwd = cryptofoo.hash('whirlpool', str);
  hshpwd = cryptofoo.hash('whirlpool', 'PW' + hpwd + salt + '/PW');
  return hshpwd;
}

function ajaxsignup(emailid, passwordid, nameid) {
  "use strict";
  var hpw, hpw1, hpw2;
  hpw = getHPW(getValue(emailid), getValue(passwordid));
  hpw1 = cryptofoo.hash('whirlpool', hpw.substr(0, 48) + hpw);
  hpw2 = cryptofoo.hash('whirlpool', hpw.substr(46) + hpw);
  if ((getValue(emailid) === '') || (getValue(nameid) === '') || (getValue(passwordid) === '')) {
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
    }
  }, function (resp) {
    if (resp.success === false) {
      popover(resp.msg);
      return false;
    }
    if (resp === 'new') {
      popoverredirect('we send you now a eMail, please click the link in the eMail to confirm your Account.');
      window.setTimeout('window.location = "' + selfurl + '"', 22000);
      return true;
    }
    popoverredirect(resp.msg);
    window.setTimeout('window.location = "' + selfurl + '"', 12000);
    return true;
  });
}

function ajaxchange(emailid, passwordid, nameid) {
  "use strict";
  var oldpw, hpw, usemail, usepass, nhpw, nhpw1, nhpw2, hpw1, hpw2;
  oldpw = prompt("to make changes, you have to enter your password", "");
  if (oldpw === '') {
    popover('Please fill every field');
    return false;
  }
  hpw = getHPW(session_usermail, oldpw);
  if (getValue(emailid) !== '') {
    usemail = getValue(emailid).toLowerCase();
  } else {
    usemail = session_usermail;
  }
  if (getValue(passwordid) !== '') {
    usepass = getValue(passwordid);
  } else {
    usepass = oldpw;
  }
  nhpw = getHPW(usemail, usepass);
  nhpw1 = cryptofoo.hash('whirlpool', nhpw.substr(0, 48) + nhpw);
  nhpw2 = cryptofoo.hash('whirlpool', nhpw.substr(46) + nhpw);
  hpw1 = cryptofoo.hash('whirlpool', cryptofoo.hash('whirlpool', hpw.substr(0, 48) + hpw) + serversalt + clientsalt);
  hpw2 = cryptofoo.hash('whirlpool', hpw.substr(46) + hpw);
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
    }
  }, function (resp) {
    if (resp.success === false) {
      popover(resp.msg);
      return false;
    }
    if (resp.code === 43) {
      popoverredirect('we send you now a eMail, please click the link in the eMail to confirm your Account.');
      window.setTimeout('window.location = "' + selfurl + '"', 22000);
      return true;
    }
    popoverredirect('Your User-ID is: ' + resp.msg);
    window.setTimeout('window.location = "' + selfurl + '"', 12000);
    return true;
  });
}

function ajaxlogin(emailid, passwordid, ssiid) {
  "use strict";
  var hpw, hpw1, hpw2, ssi;
  hpw = getHPW(getValue(emailid).toLowerCase(), getValue(passwordid));
  hpw1 = cryptofoo.hash('whirlpool', cryptofoo.hash('whirlpool', hpw.substr(0, 48) + hpw) + serversalt + clientsalt);
  hpw2 = cryptofoo.hash('whirlpool', hpw.substr(46) + hpw);
  ssi = false;
  if (document.getElementById(ssiid).checked === true) {
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
    }
  }, function (resp) {
    if (resp.success === true) {
      popoverredirect(resp.msg);
      window.setTimeout('window.location = "' + selfurl + '"', 12000);
    } else {
      popover(resp.msg);
    }
  });
}

function ajaxlogout() {
  "use strict";
  majaX({
    url: './database/?logout',
    type: 'json',
    method: 'POST',
    data: {
      logout: 'true',
      timestamp: gettimestamp()
    }
  }, function (resp) {
    if (resp.success === true) {
      window.setTimeout('popoverredirect("logout successful")', 200);
      window.setTimeout('window.location = "' + selfurl + '"', 12000);
    }
  });
}

function ajaxclear() {
  "use strict";
  majaX({
    url: './database/?logout',
    type: 'json',
    method: 'POST',
    data: {
      logout: 'true',
      clear: 'true',
      timestamp: gettimestamp()
    }
  }, function (resp) {
    if (resp.success === true) {
      window.setTimeout('popoverredirect("logout successful")', 200);
      window.setTimeout('window.location = "' + selfurl + '"', 12000);
    }
  });
}

function popover(text) {
  "use strict";
  TINY.box.show({
    html: text,
    width: 300,
    minHeight: 20
  });
}

function popoverredirect(text) {
  "use strict";
  TINY.box.show({
    html: text,
    width: 300,
    minHeight: 20,
    closejs: function () {
      jsredirect();
    }
  });
}

function jsredirect() {
  "use strict";
  window.setTimeout('window.location = "' + selfurl + '"', 200);
}

function createSalt() {
  "use strict";
  clientsalt = cryptofoo.hash('whirlpool', gettimestamp() + ' ' + Math.random() * 1000);
}