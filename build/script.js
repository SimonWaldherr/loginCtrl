/*
 Copyright 2013 Simon Waldherr
 https://github.com/SimonWaldherr/loginCtrl

 loginCtrl uses the following Sources
 https://github.com/SimonWaldherr/majaX.js from Simon Waldherr under MIT license
 https://github.com/SimonWaldherr/easySQL from Simon Waldherr under MIT license
 https://github.com/SimonWaldherr/cryptofoo from Simon Waldherr under MIT license
 https://github.com/SimonWaldherr/lightbox.js from scriptiny.com under cc-by license
 https://github.com/KaiserSoft/PHP_class_email from Mirko Kaiser under BSD license

 the rest of loginCtrl is licensed under MIT license

 MIT license:
 Permission is hereby granted, free of charge, to any person obtaining 
 a copy of this software and associated documentation files (the 
 "Software"), to deal in the Software without restriction, including 
 without limitation the rights to use, copy, modify, merge, publish, 
 distribute, sublicense, and/or sell copies of the Software, and to 
 permit persons to whom the Software is furnished to do so, subject to 
 the following conditions:

 The above copyright notice and this permission notice shall be 
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
 ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
 TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT 
 SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR 
 ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN 
 ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE 
 OR OTHER DEALINGS IN THE SOFTWARE.

 more informations about the MIT license can be found at http://en.wikipedia.org/wiki/MIT_License
 for more informations, please contact contact@simonwaldherr.de
*/

/*
 * majaX
 *
 * Copyright 2013, Simon Waldherr - http://simon.waldherr.eu/
 * Released under the MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Github:  https://github.com/simonwaldherr/majaX.js/
 * Version: 0.2.3
 */

/*jslint browser: true, white: true, plusplus: true, indent: 2, bitwise: true, regexp: true, forin: true */
/*global ActiveXObject, window */
/*exported majaX */

var majaX, majax;

majaX = function (data, successcallback, errorcallback) {
  "use strict";
  var url, method, port, type, header, faildata, ajax, ajaxTimeout, mimes, mimetype, senddata, sendkeys, sendstring, regex,
    urlparts = {},
    i = 0;
  if (data.url === undefined) {
    return false;
  }
  regex = /((http[s]?:\/\/)?([\.:\/?&]+)?([^\.:\/?&]+)?)/gm;
  urlparts.regex = data.url.match(regex);
  urlparts.clean = {
    'protocol': '',
    'domain': '',
    'port': '',
    'path': '',
    'fileextension': '',
    'query': ''
  };
  for (i = 0; i < urlparts.regex.length; i++) {
    if (majax.countChars(urlparts.regex[i], '://') === 1) {
      urlparts.clean.protocol = urlparts.regex[i] === undefined ? false : urlparts.regex[i].split('://')[0];
      urlparts.clean.domain = urlparts.regex[i] === undefined ? false : urlparts.regex[i].split('://')[1];
    } else if ((majax.countChars(urlparts.regex[i], '/') === 0) && (majax.countChars(urlparts.regex[i], ':') === 0) && (urlparts.clean.path === '')) {
      urlparts.clean.domain += urlparts.regex[i] === undefined ? false : urlparts.regex[i];
    } else if ((majax.countChars(urlparts.regex[i], ':') === 1) && (urlparts.clean.path === '')) {
      urlparts.clean.port = urlparts.regex[i] === undefined ? false : urlparts.regex[i].split(':')[1];
    } else if ((majax.countChars(urlparts.regex[i], '?') === 0) && (majax.countChars(urlparts.regex[i], '&') === 0) && (urlparts.clean.query === '')) {
      urlparts.clean.path += urlparts.regex[i] === undefined ? false : urlparts.regex[i];
    } else {
      urlparts.clean.query += urlparts.regex[i] === undefined ? false : urlparts.regex[i];
    }
  }
  if (urlparts.clean.path.indexOf(".") !== -1) {
    urlparts.clean.fileextension = urlparts.clean.path.split('.')[urlparts.clean.path.split('.').length - 1];
  }
  mimes = {
    'txt': 'text/plain',
    'json': 'application/json',
    'atom': 'application/atom+xml',
    'rss': 'application/rss+xml',
    'soap': 'application/soap+xml',
    'xml': 'application/xml',
    'svg': 'image/svg+xml',
    'css': 'text/css',
    'csv': 'text/csv',
    'html': 'text/html',
    'vcf': 'text/vcard'
  };
  url = data.url === undefined ? false : data.url;
  method = data.method === undefined ? 'GET' : data.method.toUpperCase();
  port = data.port === undefined ? urlparts.clean.port === undefined ? '80' : urlparts.clean.port : data.port;
  type = data.type === undefined ? urlparts.clean.fileextension === undefined ? 'txt' : urlparts.clean.fileextension.toLowerCase() : data.type.toLowerCase();
  mimetype = data.mimetype === undefined ? mimes[urlparts.clean.fileextension] === undefined ? 'text/plain' : mimes[urlparts.clean.fileextension] : data.mimetype;
  senddata = data.data === undefined ? false : data.data;
  faildata = data.faildata === undefined ? false : data.faildata;
  header = data.header === undefined ? {} : data.header;
  if (header['Content-type'] === undefined) {
    header['Content-type'] = 'application/x-www-form-urlencoded';
  }
  if (method === 'DEBUG') {
    return {
      "url": url,
      "urlparts": urlparts.clean,
      "port": port,
      "type": type,
      "mime": mimetype,
      "data": data
    };
  }
  ajax = (window.ActiveXObject) ? new ActiveXObject("Microsoft.XMLHTTP") : (XMLHttpRequest && new XMLHttpRequest()) || null;
  ajaxTimeout = window.setTimeout(function () {
      ajax.abort();
    }, 6000);
  ajax.onreadystatechange = function () {
    var jsoncontent, status;
    if (ajax.readyState === 4) {
      status = ajax.status.toString().charAt(0);
      if ((status !== '2')&&(status !== '3')) {
        errorcallback(faildata, ajax);
      } else {
        clearTimeout(ajaxTimeout);
        ajax.headersObject = majax.getRespHeaders(ajax.getAllResponseHeaders());
        ajax = majax.cleanObject(ajax);
        if (method === 'API') {
          if (urlparts.clean.domain === 'github.com') {
            jsoncontent = JSON.parse(ajax.responseText);
            if (jsoncontent.content !== undefined) {
              jsoncontent.content = majax.base64_decode(jsoncontent.content.replace(/\n/gmi, ''));
              successcallback(jsoncontent, ajax);
            } else {
              successcallback(JSON.parse(ajax.responseText), ajax);
            }
          }
        } else {
          if (type === 'json') {
            successcallback(JSON.parse(ajax.responseText), ajax);
          } else if (type === 'xml') {
            successcallback(majax.getXMLasObject(ajax.responseText), ajax);
          } else if (type === 'csv') {
            successcallback(majax.getCSVasArray(ajax.responseText), ajax);
          } else if ((type === 'png') || (type === 'gif') || (type === 'jpg') || (type === 'jpeg') || (type === 'mp3') || (type === 'm4a')) {
            successcallback(ajax.response, ajax);
          } else {
            successcallback(ajax.responseText, ajax);
          }
        }
      }
    }
  };
  i = 0;
  sendstring = '';
  if (senddata !== false) {
    for (sendkeys in senddata) {
      if (i !== 0) {
        sendstring += '&';
      }
      sendstring += sendkeys + '=' + senddata[sendkeys];
      i++;
    }
  }
  if (method === 'API') {
    if (urlparts.clean.domain === 'github.com') {
      type = 'json';
      if (urlparts.clean.path.split('/')[3] === undefined) {
        ajax.open('GET', 'https://api.github.com/repos/' + urlparts.clean.path.split('/')[1] + '/' + urlparts.clean.path.split('/')[2] + '/contents/', true);
        majax.setReqHeaders(ajax, header);
        ajax.send();
      } else {
        ajax.open('GET', 'https://api.github.com/repos/' + urlparts.clean.path.split('/')[1] + '/' + urlparts.clean.path.split('/')[2] + '/contents/' + urlparts.clean.path.split('/', 4)[3], true);
        majax.setReqHeaders(ajax, header);
        ajax.send();
      }
    }
  } else {
    if (method !== 'POST') {
      if (sendstring !== '') {
        if (urlparts.clean.query !== '') {
          url = url + '&' + sendstring;
        } else {
          url = url + '?' + sendstring;
        }
      }
    }

    if (method === 'GET') {
      ajax.open('GET', url, true);
      majax.overrideMime(ajax, type);
      majax.setReqHeaders(ajax, header);
      ajax.send();
    } else if (method === 'POST') {
      ajax.open('POST', url, true);
      majax.overrideMime(ajax, type);
      majax.setReqHeaders(ajax, header);
      ajax.send(sendstring);
    } else {
      if (method === 'HEAD') {
        type = 'none';
      }
      ajax.open(method, url, true);
      majax.overrideMime(ajax, type);
      majax.setReqHeaders(ajax, header);
      ajax.send();
    }
  }
};

majax = {
  setReqHeaders: function (ajax, headerObject) {
    "use strict";
    var key;
    if (headerObject !== false) {
      if (typeof headerObject === 'object') {
        for (key in headerObject) {
          if (typeof headerObject[key] === 'string') {
            ajax.setRequestHeader(key, headerObject[key]);
          }
        }
      }
    }
  },
  getRespHeaders: function (headerString) {
    "use strict";
    var i, string, header, headerObject = {};
    if (typeof headerString === 'string') {
      string = headerString.split(/\n/);
      for (i = 0; i < string.length; i++) {
        if (typeof string[i] === 'string') {
          header = string[i].split(': ');
          if ((header[0].length > 3) && (header[1].length > 3)) {
            headerObject[header[0].trim()] = header[1].trim();
          }
        }
      }
    }
    return headerObject;
  },
  overrideMime: function (ajax, type) {
    "use strict";
    if (type === 'xml') {
      ajax.overrideMimeType('text/xml');
      ajax.responseType = '';
    } else if ((type === 'png') || (type === 'gif') || (type === 'jpg') || (type === 'jpeg') || (type === 'mp3') || (type === 'm4a')) {
      ajax.overrideMimeType("text/plain; charset=x-user-defined");
      ajax.responseType = 'arraybuffer';
    }
  },
  countChars: function (string, split) {
    "use strict";
    string = string.split(split);
    if (typeof string === 'object') {
      return string.length - 1;
    }
    return 0;
  },
  getText: function (string) {
    "use strict";
    var re = /<([^<>]*)>([^\/]*)<(\/[^<>]*)>/gmi;
    if (typeof string === 'string') {
      return string.replace(re, '');
    }
  },
  getXMLasObject: function (xmlstring) {
    "use strict";
    var xmlroot, foo = {};
    if (typeof xmlstring === 'object') {
      return majax.returnChilds(foo, xmlstring, 1);
    }
    xmlroot = document.createElement('div');
    xmlroot.innerHTML = xmlstring;
    return majax.returnChilds(foo, xmlroot, 1);
  },
  returnChilds: function (element, node, deep) {
    "use strict";
    var i, ii, obj, key, plaintext, returnArray = [],
      childs = node.childNodes.length;
    ii = 0;
    for (i = 0; i < childs; i++) {
      if (node.childNodes[i].localName !== null) {
        element[ii] = {};
        for (key in node.childNodes[i]) {
          obj = node.childNodes[i][key];
          if ((typeof obj === 'string') || (typeof obj === 'number')) {
            if ((key !== 'accessKey') && (key !== 'baseURI') && (key !== 'className') && (key !== 'contentEditable') && (key !== 'dir') && (key !== 'namespaceURI') && (obj !== "") && (key !== key.toUpperCase()) && (obj !== 0) && (key !== 'childs') && (key !== 'textContent') && (key !== 'nodeType') && (key !== 'tabIndex') && (key !== 'innerHTML') && (key !== 'outerHTML')) {
              element[ii][key] = obj;
            } else if ((key === 'innerHTML') || (key === 'outerHTML')) {
              element[ii][key] = majax.escapeHtmlEntities(obj);
            }
          }
        }
        if (node.childNodes[i].innerHTML !== undefined) {
          plaintext = majax.getText(node.childNodes[i].innerHTML).trim();
          if (plaintext !== "") {
            element[ii].textContent = plaintext;
          }
          if (node.childNodes[i].childNodes.length > 1) {
            element[ii].childs = majax.returnChilds(returnArray, node.childNodes[i], deep + 1);
          }
          ii++;
        }
      }
    }
    return element;
  },
  isEmpty: function (obj) {
    "use strict";
    var emptyObj = {}, emptyArr = [];
    if ((obj === emptyObj)||(obj === emptyArr)||(obj === null)||(obj === undefined)) {
      return true;
    }
    return false;
  },
  cleanArray: function (actual) {
    "use strict";
    var newArray = [],
      clean, i = 0;
    for (i = 0; i < actual.length; i++) {
      if ((typeof actual[i] === 'string') || (typeof actual[i] === 'number')) {
        newArray.push(actual[i]);
      } else if (typeof actual[i] === 'object') {
        clean = majax.cleanArray(actual[i]);
        if (clean[0] !== '') {
          newArray.push(majax.cleanArray(actual[i]));
        }
      }
    }
    return newArray;
  },
  cleanObject: function (actual) {
    "use strict";
    var newArray = {}, key;
    for (key in actual) {
      if ((typeof actual[key] !== 'object') && (typeof actual[key] !== 'function') && (typeof actual[key] !== '') && (!majax.isEmpty(actual[key]))) {
        newArray[key] = actual[key];
      } else if (typeof actual[key] === 'object') {
        if ((!majax.isEmpty(majax.cleanObject(actual[key]))) && (actual[key] !== null)) {
          newArray[key] = majax.cleanObject(actual[key]);
        }
      }
    }
    return newArray;
  },
  getCSVasArray: function (csvstring) {
    "use strict";
    var regexCSV, arrayCSV, arrMatches, strMatchedDelimiter, strMatchedValue, strDelimiter = ';';
    regexCSV = new RegExp(("(\\" + strDelimiter + "|\\r?\\n|\\r|^)" + "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" + "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    arrayCSV = [
      []
    ];
    arrMatches = regexCSV.exec(csvstring);
    while (arrMatches) {
      strMatchedDelimiter = arrMatches[1];
      if (strMatchedDelimiter.length && (strMatchedDelimiter !== strDelimiter)) {
        arrayCSV.push([]);
      }
      if (arrMatches[2]) {
        strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
      } else {
        strMatchedValue = arrMatches[3];
      }
      arrayCSV[arrayCSV.length - 1].push(strMatchedValue);
      arrMatches = regexCSV.exec(csvstring);
    }
    return majax.cleanArray(arrayCSV);
  },
  base64_encode: function (s) {
    "use strict";
    if (typeof window.btoa !== 'function') {
      var m = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        r = "",
        i = 0,
        a, b, c, d, x, y, z;
      while (i < s.length) {
        x = s.charCodeAt(i++);
        y = s.charCodeAt(i++);
        z = s.charCodeAt(i++);
        a = x >> 2;
        b = ((x & 3) << 4) | (y >> 4);
        c = ((y & 15) << 2) | (z >> 6);
        d = z & 63;
        if (isNaN(y)) {
          c = d = 64;
        } else if (isNaN(z)) {
          d = 64;
        }
        r += m.charAt(a) + m.charAt(b) + m.charAt(c) + m.charAt(d);
      }
      return r;
    }
    return window.btoa(s);
  },
  base64_decode: function (s) {
    "use strict";
    if (typeof window.btoa !== 'function') {
      var m = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        r = "",
        i = 0,
        a, b, c, d, x, y, z;
      s = s.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      while (i < s.length) {
        a = m.indexOf(s.charAt(i++));
        b = m.indexOf(s.charAt(i++));
        c = m.indexOf(s.charAt(i++));
        d = m.indexOf(s.charAt(i++));
        x = (a << 2) | (b >> 4);
        y = ((b & 15) << 4) | (c >> 2);
        z = ((c & 3) << 6) | d;
        r += String.fromCharCode(x) + (c !== 64 ? String.fromCharCode(y) : "") + (d !== 64 ? String.fromCharCode(z) : "");
      }
      return r;
    }
    return window.atob(s);
  },
  escapeHtmlEntities: function (text) {
    "use strict";
    return text.replace(/[\u00A0-\u2666<>\&]/g, function (c) {
      var entityTable={34:'quot',38:'amp',39:'apos',60:'lt',62:'gt',160:'nbsp',161:'iexcl',162:'cent',163:'pound',164:'curren',165:'yen',166:'brvbar',167:'sect',168:'uml',169:'copy',170:'ordf',171:'laquo',172:'not',173:'shy',174:'reg',175:'macr',176:'deg',177:'plusmn',178:'sup2',179:'sup3',180:'acute',181:'micro',182:'para',183:'middot',184:'cedil',185:'sup1',186:'ordm',187:'raquo',188:'frac14',189:'frac12',190:'frac34',191:'iquest',192:'Agrave',193:'Aacute',194:'Acirc',195:'Atilde',196:'Auml',197:'Aring',198:'AElig',199:'Ccedil',200:'Egrave',201:'Eacute',202:'Ecirc',203:'Euml',204:'Igrave',205:'Iacute',206:'Icirc',207:'Iuml',208:'ETH',209:'Ntilde',210:'Ograve',211:'Oacute',212:'Ocirc',213:'Otilde',214:'Ouml',215:'times',216:'Oslash',217:'Ugrave',218:'Uacute',219:'Ucirc',220:'Uuml',221:'Yacute',222:'THORN',223:'szlig',224:'agrave',225:'aacute',226:'acirc',227:'atilde',228:'auml',229:'aring',230:'aelig',231:'ccedil',232:'egrave',233:'eacute',234:'ecirc',235:'euml',236:'igrave',237:'iacute',238:'icirc',239:'iuml',240:'eth',241:'ntilde',242:'ograve',243:'oacute',244:'ocirc',245:'otilde',246:'ouml',247:'divide',248:'oslash',249:'ugrave',250:'uacute',251:'ucirc',252:'uuml',253:'yacute',254:'thorn',255:'yuml',402:'fnof',913:'Alpha',914:'Beta',915:'Gamma',916:'Delta',917:'Epsilon',918:'Zeta',919:'Eta',920:'Theta',921:'Iota',922:'Kappa',923:'Lambda',924:'Mu',925:'Nu',926:'Xi',927:'Omicron',928:'Pi',929:'Rho',931:'Sigma',932:'Tau',933:'Upsilon',934:'Phi',935:'Chi',936:'Psi',937:'Omega',945:'alpha',946:'beta',947:'gamma',948:'delta',949:'epsilon',950:'zeta',951:'eta',952:'theta',953:'iota',954:'kappa',955:'lambda',956:'mu',957:'nu',958:'xi',959:'omicron',960:'pi',961:'rho',962:'sigmaf',963:'sigma',964:'tau',965:'upsilon',966:'phi',967:'chi',968:'psi',969:'omega',977:'thetasym',978:'upsih',982:'piv',8226:'bull',8230:'hellip',8242:'prime',8243:'Prime',8254:'oline',8260:'frasl',8472:'weierp',8465:'image',8476:'real',8482:'trade',8501:'alefsym',8592:'larr',8593:'uarr',8594:'rarr',8595:'darr',8596:'harr',8629:'crarr',8656:'lArr',8657:'uArr',8658:'rArr',8659:'dArr',8660:'hArr',8704:'forall',8706:'part',8707:'exist',8709:'empty',8711:'nabla',8712:'isin',8713:'notin',8715:'ni',8719:'prod',8721:'sum',8722:'minus',8727:'lowast',8730:'radic',8733:'prop',8734:'infin',8736:'ang',8743:'and',8744:'or',8745:'cap',8746:'cup',8747:'int',8756:'there4',8764:'sim',8773:'cong',8776:'asymp',8800:'ne',8801:'equiv',8804:'le',8805:'ge',8834:'sub',8835:'sup',8836:'nsub',8838:'sube',8839:'supe',8853:'oplus',8855:'otimes',8869:'perp',8901:'sdot',8968:'lceil',8969:'rceil',8970:'lfloor',8971:'rfloor',9001:'lang',9002:'rang',9674:'loz',9824:'spades',9827:'clubs',9829:'hearts',9830:'diams',338:'OElig',339:'oelig',352:'Scaron',353:'scaron',376:'Yuml',710:'circ',732:'tilde',8194:'ensp',8195:'emsp',8201:'thinsp',8204:'zwnj',8205:'zwj',8206:'lrm',8207:'rlm',8211:'ndash',8212:'mdash',8216:'lsquo',8217:'rsquo',8218:'sbquo',8220:'ldquo',8221:'rdquo',8222:'bdquo',8224:'dagger',8225:'Dagger',8240:'permil',8249:'lsaquo',8250:'rsaquo',8364:'euro'};
      return '&' + (entityTable[c.charCodeAt(0)] || '#' + c.charCodeAt(0)) + ';';
    });
  }
};


/*
 * cryptofoo
 * a good compromise between speed and validity
 *
 * Copyright 2013, Simon Waldherr - http://simon.waldherr.eu/
 * Released under the MIT Licence
 * http://simon.waldherr.eu/license/mit/
 *
 * Github:  https://github.com/simonwaldherr/cryptofoo/
 * Version: 0.1.1
 */

//based on code from http://blog.faultylabs.com/files/md5.js and http://www.sunsean.com/Whirlpool.js (both under public domain)

/*jslint browser: true, bitwise: true, plusplus: true, white: true */
/*globals ArrayBuffer, Uint8Array, Int8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Float32Array, Float64Array */

var cryptofoo;

cryptofoo = {
  hash: function (algo, string) {
    "use strict";
    return cryptofoo[algo](string);
  },
  crc32: function (string) {
    "use strict";
    var crc = 0,
      n, x, i, len, table = ["00000000", "77073096", "EE0E612C", "990951BA", "076DC419", "706AF48F", "E963A535", "9E6495A3", "0EDB8832", "79DCB8A4", "E0D5E91E", "97D2D988", "09B64C2B", "7EB17CBD", "E7B82D07", "90BF1D91", "1DB71064", "6AB020F2", "F3B97148", "84BE41DE", "1ADAD47D", "6DDDE4EB", "F4D4B551", "83D385C7", "136C9856", "646BA8C0", "FD62F97A", "8A65C9EC", "14015C4F", "63066CD9", "FA0F3D63", "8D080DF5", "3B6E20C8", "4C69105E", "D56041E4", "A2677172", "3C03E4D1", "4B04D447", "D20D85FD", "A50AB56B", "35B5A8FA", "42B2986C", "DBBBC9D6", "ACBCF940", "32D86CE3", "45DF5C75", "DCD60DCF", "ABD13D59", "26D930AC", "51DE003A", "C8D75180", "BFD06116", "21B4F4B5", "56B3C423", "CFBA9599", "B8BDA50F", "2802B89E", "5F058808", "C60CD9B2", "B10BE924", "2F6F7C87", "58684C11", "C1611DAB", "B6662D3D", "76DC4190", "01DB7106", "98D220BC", "EFD5102A", "71B18589", "06B6B51F", "9FBFE4A5", "E8B8D433", "7807C9A2", "0F00F934", "9609A88E", "E10E9818", "7F6A0DBB", "086D3D2D", "91646C97", "E6635C01", "6B6B51F4", "1C6C6162", "856530D8", "F262004E", "6C0695ED", "1B01A57B", "8208F4C1", "F50FC457", "65B0D9C6", "12B7E950", "8BBEB8EA", "FCB9887C", "62DD1DDF", "15DA2D49", "8CD37CF3", "FBD44C65", "4DB26158", "3AB551CE", "A3BC0074", "D4BB30E2", "4ADFA541", "3DD895D7", "A4D1C46D", "D3D6F4FB", "4369E96A", "346ED9FC", "AD678846", "DA60B8D0", "44042D73", "33031DE5", "AA0A4C5F", "DD0D7CC9", "5005713C", "270241AA", "BE0B1010", "C90C2086", "5768B525", "206F85B3", "B966D409", "CE61E49F", "5EDEF90E", "29D9C998", "B0D09822", "C7D7A8B4", "59B33D17", "2EB40D81", "B7BD5C3B", "C0BA6CAD", "EDB88320", "9ABFB3B6", "03B6E20C", "74B1D29A", "EAD54739", "9DD277AF", "04DB2615", "73DC1683", "E3630B12", "94643B84", "0D6D6A3E", "7A6A5AA8", "E40ECF0B", "9309FF9D", "0A00AE27", "7D079EB1", "F00F9344", "8708A3D2", "1E01F268", "6906C2FE", "F762575D", "806567CB", "196C3671", "6E6B06E7", "FED41B76", "89D32BE0", "10DA7A5A", "67DD4ACC", "F9B9DF6F", "8EBEEFF9", "17B7BE43", "60B08ED5", "D6D6A3E8", "A1D1937E", "38D8C2C4", "4FDFF252", "D1BB67F1", "A6BC5767", "3FB506DD", "48B2364B", "D80D2BDA", "AF0A1B4C", "36034AF6", "41047A60", "DF60EFC3", "A867DF55", "316E8EEF", "4669BE79", "CB61B38C", "BC66831A", "256FD2A0", "5268E236", "CC0C7795", "BB0B4703", "220216B9", "5505262F", "C5BA3BBE", "B2BD0B28", "2BB45A92", "5CB36A04", "C2D7FFA7", "B5D0CF31", "2CD99E8B", "5BDEAE1D", "9B64C2B0", "EC63F226", "756AA39C", "026D930A", "9C0906A9", "EB0E363F", "72076785", "05005713", "95BF4A82", "E2B87A14", "7BB12BAE", "0CB61B38", "92D28E9B", "E5D5BE0D", "7CDCEFB7", "0BDBDF21", "86D3D2D4", "F1D4E242", "68DDB3F8", "1FDA836E", "81BE16CD", "F6B9265B", "6FB077E1", "18B74777", "88085AE6", "FF0F6A70", "66063BCA", "11010B5C", "8F659EFF", "F862AE69", "616BFFD3", "166CCF45", "A00AE278", "D70DD2EE", "4E048354", "3903B3C2", "A7672661", "D06016F7", "4969474D", "3E6E77DB", "AED16A4A", "D9D65ADC", "40DF0B66", "37D83BF0", "A9BCAE53", "DEBB9EC5", "47B2CF7F", "30B5FFE9", "BDBDF21C", "CABAC28A", "53B39330", "24B4A3A6", "BAD03605", "CDD70693", "54DE5729", "23D967BF", "B3667A2E", "C4614AB8", "5D681B02", "2A6F2B94", "B40BBE37", "C30C8EA1", "5A05DF1B", "2D02EF8D"];
    n = 0;
    x = 0;
    len = string.length;
    crc = crc ^ (-1);
    for (i = 0; i < len; i++) {
      n = (crc ^ string.charCodeAt(i)) & 0xFF;
      x = "0x" + table[n];
      crc = (crc >>> 8) ^ x;
    }
    return crc ^ (-1);
  },
  md5: function (string) {
    "use strict";
    var databytes, type_mismatch;

    function bytes_to_int32(arr, off) {
      return (arr[off + 3] << 24) | (arr[off + 2] << 16) | (arr[off + 1] << 8) | (arr[off]);
    }

    function str_to_bytes(str) {
      var retval = [],
        i, j, tmp;
      for (i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) <= 127) {
          retval.push(str.charCodeAt(i));
        } else {
          tmp = encodeURIComponent(str.charAt(i)).substr(1).split("%");
          for (j = 0; j < tmp.length; j++) {
            retval.push(parseInt(tmp[j], 16));
          }
        }
      }
      return retval;
    }

    function to_zerofilled_hex(n) {
      var t1 = (n >>> 0).toString(16);
      return "00000000".substr(0, 8 - t1.length) + t1;
    }

    function int128le_to_hex() {
      var ra, t, ta, i;
      ra = "";
      t = 0;
      ta = 0;
      for (i = 3; i >= 0; i--) {
        ta = arguments[i];
        t = (ta & 255);
        ta = ta >>> 8;
        t = t << 8;
        t = t | (ta & 255);
        ta = ta >>> 8;
        t = t << 8;
        t = t | (ta & 255);
        ta = ta >>> 8;
        t = t << 8;
        t = t | ta;
        ra = ra + to_zerofilled_hex(t);
      }
      return ra;
    }

    function typed_to_plain(tarr) {
      var retval = [],
        i;
      for (i = 0; i < tarr.length; i++) {
        retval[i] = tarr[i];
      }
      return retval;
    }

    function chars_to_bytes(ac) {
      var retval = [],
        i;
      for (i = 0; i < ac.length; i++) {
        retval = retval.concat(str_to_bytes(ac[i]));
      }
      return retval;
    }

    function int64_to_bytes(num) {
      var retval = [],
        i;
      for (i = 0; i < 8; i++) {
        retval.push(num & 255);
        num = num >>> 8;
      }
      return retval;
    }

    function rol(num, places) {
      return ((num << places) & 4294967295) | (num >>> (32 - places));
    }

    function fF(b, c, d) {
      return (b & c) | (~b & d);
    }

    function fG(b, c, d) {
      return (d & b) | (~d & c);
    }

    function fH(b, c, d) {
      return b ^ c ^ d;
    }

    function fI(b, c, d) {
      return c ^ (b | ~d);
    }
    databytes = null;
    type_mismatch = null;
    if (typeof string === "string") {
      databytes = str_to_bytes(string);
    } else {
      if (string.constructor === Array) {
        if (string.length === 0) {
          databytes = string;
        } else {
          if (typeof string[0] === "string") {
            databytes = chars_to_bytes(string);
          } else {
            if (typeof string[0] === "number") {
              databytes = string;
            } else {
              type_mismatch = typeof string[0];
            }
          }
        }
      } else {
        if (ArrayBuffer !== undefined) {
          if (string instanceof ArrayBuffer) {
            databytes = typed_to_plain(new Uint8Array(string));
          } else {
            if ((string instanceof Uint8Array) || (string instanceof Int8Array)) {
              databytes = typed_to_plain(string);
            } else {
              if ((string instanceof Uint32Array) || (string instanceof Int32Array) || (string instanceof Uint16Array) || (string instanceof Int16Array) || (string instanceof Float32Array) || (string instanceof Float64Array)) {
                databytes = typed_to_plain(new Uint8Array(string.buffer));
              } else {
                type_mismatch = typeof string;
              }
            }
          }
        } else {
          type_mismatch = typeof string;
        }
      }
    } if (type_mismatch) {
      return false;
    }

    function add32(n1, n2) {
      return 4294967295 & (n1 + n2);
    }

    function do_digest() {
      var org_len, tail, i, h0, h1, h2, h3, a, b, c, d, ptr;
      org_len = databytes.length;
      databytes.push(128);
      tail = databytes.length % 64;
      if (tail > 56) {
        for (i = 0; i < (64 - tail); i++) {
          databytes.push(0);
        }
        tail = databytes.length % 64;
      }
      for (i = 0; i < (56 - tail); i++) {
        databytes.push(0);
      }
      databytes = databytes.concat(int64_to_bytes(org_len * 8));
      h0 = 1732584193;
      h1 = 4023233417;
      h2 = 2562383102;
      h3 = 271733878;
      a = 0;
      b = 0;
      c = 0;
      d = 0;

      function updateRun(nf, sin32, dw32, b32) {
        var temp = d;
        d = c;
        c = b;
        b = add32(b, rol(add32(a, add32(nf, add32(sin32, dw32))), b32));
        a = temp;
      }
      for (i = 0; i < databytes.length / 64; i++) {
        a = h0;
        b = h1;
        c = h2;
        d = h3;
        ptr = i * 64;
        updateRun(fF(b, c, d), 3614090360, bytes_to_int32(databytes, ptr), 7);
        updateRun(fF(b, c, d), 3905402710, bytes_to_int32(databytes, ptr + 4), 12);
        updateRun(fF(b, c, d), 606105819, bytes_to_int32(databytes, ptr + 8), 17);
        updateRun(fF(b, c, d), 3250441966, bytes_to_int32(databytes, ptr + 12), 22);
        updateRun(fF(b, c, d), 4118548399, bytes_to_int32(databytes, ptr + 16), 7);
        updateRun(fF(b, c, d), 1200080426, bytes_to_int32(databytes, ptr + 20), 12);
        updateRun(fF(b, c, d), 2821735955, bytes_to_int32(databytes, ptr + 24), 17);
        updateRun(fF(b, c, d), 4249261313, bytes_to_int32(databytes, ptr + 28), 22);
        updateRun(fF(b, c, d), 1770035416, bytes_to_int32(databytes, ptr + 32), 7);
        updateRun(fF(b, c, d), 2336552879, bytes_to_int32(databytes, ptr + 36), 12);
        updateRun(fF(b, c, d), 4294925233, bytes_to_int32(databytes, ptr + 40), 17);
        updateRun(fF(b, c, d), 2304563134, bytes_to_int32(databytes, ptr + 44), 22);
        updateRun(fF(b, c, d), 1804603682, bytes_to_int32(databytes, ptr + 48), 7);
        updateRun(fF(b, c, d), 4254626195, bytes_to_int32(databytes, ptr + 52), 12);
        updateRun(fF(b, c, d), 2792965006, bytes_to_int32(databytes, ptr + 56), 17);
        updateRun(fF(b, c, d), 1236535329, bytes_to_int32(databytes, ptr + 60), 22);
        updateRun(fG(b, c, d), 4129170786, bytes_to_int32(databytes, ptr + 4), 5);
        updateRun(fG(b, c, d), 3225465664, bytes_to_int32(databytes, ptr + 24), 9);
        updateRun(fG(b, c, d), 643717713, bytes_to_int32(databytes, ptr + 44), 14);
        updateRun(fG(b, c, d), 3921069994, bytes_to_int32(databytes, ptr), 20);
        updateRun(fG(b, c, d), 3593408605, bytes_to_int32(databytes, ptr + 20), 5);
        updateRun(fG(b, c, d), 38016083, bytes_to_int32(databytes, ptr + 40), 9);
        updateRun(fG(b, c, d), 3634488961, bytes_to_int32(databytes, ptr + 60), 14);
        updateRun(fG(b, c, d), 3889429448, bytes_to_int32(databytes, ptr + 16), 20);
        updateRun(fG(b, c, d), 568446438, bytes_to_int32(databytes, ptr + 36), 5);
        updateRun(fG(b, c, d), 3275163606, bytes_to_int32(databytes, ptr + 56), 9);
        updateRun(fG(b, c, d), 4107603335, bytes_to_int32(databytes, ptr + 12), 14);
        updateRun(fG(b, c, d), 1163531501, bytes_to_int32(databytes, ptr + 32), 20);
        updateRun(fG(b, c, d), 2850285829, bytes_to_int32(databytes, ptr + 52), 5);
        updateRun(fG(b, c, d), 4243563512, bytes_to_int32(databytes, ptr + 8), 9);
        updateRun(fG(b, c, d), 1735328473, bytes_to_int32(databytes, ptr + 28), 14);
        updateRun(fG(b, c, d), 2368359562, bytes_to_int32(databytes, ptr + 48), 20);
        updateRun(fH(b, c, d), 4294588738, bytes_to_int32(databytes, ptr + 20), 4);
        updateRun(fH(b, c, d), 2272392833, bytes_to_int32(databytes, ptr + 32), 11);
        updateRun(fH(b, c, d), 1839030562, bytes_to_int32(databytes, ptr + 44), 16);
        updateRun(fH(b, c, d), 4259657740, bytes_to_int32(databytes, ptr + 56), 23);
        updateRun(fH(b, c, d), 2763975236, bytes_to_int32(databytes, ptr + 4), 4);
        updateRun(fH(b, c, d), 1272893353, bytes_to_int32(databytes, ptr + 16), 11);
        updateRun(fH(b, c, d), 4139469664, bytes_to_int32(databytes, ptr + 28), 16);
        updateRun(fH(b, c, d), 3200236656, bytes_to_int32(databytes, ptr + 40), 23);
        updateRun(fH(b, c, d), 681279174, bytes_to_int32(databytes, ptr + 52), 4);
        updateRun(fH(b, c, d), 3936430074, bytes_to_int32(databytes, ptr), 11);
        updateRun(fH(b, c, d), 3572445317, bytes_to_int32(databytes, ptr + 12), 16);
        updateRun(fH(b, c, d), 76029189, bytes_to_int32(databytes, ptr + 24), 23);
        updateRun(fH(b, c, d), 3654602809, bytes_to_int32(databytes, ptr + 36), 4);
        updateRun(fH(b, c, d), 3873151461, bytes_to_int32(databytes, ptr + 48), 11);
        updateRun(fH(b, c, d), 530742520, bytes_to_int32(databytes, ptr + 60), 16);
        updateRun(fH(b, c, d), 3299628645, bytes_to_int32(databytes, ptr + 8), 23);
        updateRun(fI(b, c, d), 4096336452, bytes_to_int32(databytes, ptr), 6);
        updateRun(fI(b, c, d), 1126891415, bytes_to_int32(databytes, ptr + 28), 10);
        updateRun(fI(b, c, d), 2878612391, bytes_to_int32(databytes, ptr + 56), 15);
        updateRun(fI(b, c, d), 4237533241, bytes_to_int32(databytes, ptr + 20), 21);
        updateRun(fI(b, c, d), 1700485571, bytes_to_int32(databytes, ptr + 48), 6);
        updateRun(fI(b, c, d), 2399980690, bytes_to_int32(databytes, ptr + 12), 10);
        updateRun(fI(b, c, d), 4293915773, bytes_to_int32(databytes, ptr + 40), 15);
        updateRun(fI(b, c, d), 2240044497, bytes_to_int32(databytes, ptr + 4), 21);
        updateRun(fI(b, c, d), 1873313359, bytes_to_int32(databytes, ptr + 32), 6);
        updateRun(fI(b, c, d), 4264355552, bytes_to_int32(databytes, ptr + 60), 10);
        updateRun(fI(b, c, d), 2734768916, bytes_to_int32(databytes, ptr + 24), 15);
        updateRun(fI(b, c, d), 1309151649, bytes_to_int32(databytes, ptr + 52), 21);
        updateRun(fI(b, c, d), 4149444226, bytes_to_int32(databytes, ptr + 16), 6);
        updateRun(fI(b, c, d), 3174756917, bytes_to_int32(databytes, ptr + 44), 10);
        updateRun(fI(b, c, d), 718787259, bytes_to_int32(databytes, ptr + 8), 15);
        updateRun(fI(b, c, d), 3951481745, bytes_to_int32(databytes, ptr + 36), 21);
        h0 = add32(h0, a);
        h1 = add32(h1, b);
        h2 = add32(h2, c);
        h3 = add32(h3, d);
      }
      return int128le_to_hex(h3, h2, h1, h0);
    }
    return do_digest();
  },
  whirlpool: function (string) {
    "use strict";
    var WP, R = 10,
      bitLength = [],
      buffer = [],
      bufferBits = 0,
      bufferPos = 0,
      hash = [],
      K = [],
      L = [],
      block = [],
      state = [],
      C = [],
      rc = [],
      processBuffer, convert,
      t, x, c, r, i, v1, v2, v4, v5, v8, v9, sbox = "\u1823\uc6E8\u87B8\u014F\u36A6\ud2F5\u796F\u9152" + "\u60Bc\u9B8E\uA30c\u7B35\u1dE0\ud7c2\u2E4B\uFE57" + "\u1577\u37E5\u9FF0\u4AdA\u58c9\u290A\uB1A0\u6B85" + "\uBd5d\u10F4\ucB3E\u0567\uE427\u418B\uA77d\u95d8" + "\uFBEE\u7c66\udd17\u479E\ucA2d\uBF07\uAd5A\u8333" + "\u6302\uAA71\uc819\u49d9\uF2E3\u5B88\u9A26\u32B0" + "\uE90F\ud580\uBEcd\u3448\uFF7A\u905F\u2068\u1AAE" + "\uB454\u9322\u64F1\u7312\u4008\uc3Ec\udBA1\u8d3d" + "\u9700\ucF2B\u7682\ud61B\uB5AF\u6A50\u45F3\u30EF" + "\u3F55\uA2EA\u65BA\u2Fc0\udE1c\uFd4d\u9275\u068A" + "\uB2E6\u0E1F\u62d4\uA896\uF9c5\u2559\u8472\u394c" + "\u5E78\u388c\ud1A5\uE261\uB321\u9c1E\u43c7\uFc04" + "\u5199\u6d0d\uFAdF\u7E24\u3BAB\ucE11\u8F4E\uB7EB" + "\u3c81\u94F7\uB913\u2cd3\uE76E\uc403\u5644\u7FA9" + "\u2ABB\uc153\udc0B\u9d6c\u3174\uF646\uAc89\u14E1" + "\u163A\u6909\u70B6\ud0Ed\ucc42\u98A4\u285c\uF886";
    for (t = 0; t < 8; t++) {
      C[t] = [];
    }
    for (x = 0; x < 256; x++) {
      c = sbox.charCodeAt(x / 2);
      v1 = ((x & 1) === 0) ? c >>> 8 : c & 0xff;
      v2 = v1 << 1;
      if (v2 >= 0x100) {
        v2 ^= 0x11d;
      }
      v4 = v2 << 1;
      if (v4 >= 0x100) {
        v4 ^= 0x11d;
      }
      v5 = v4 ^ v1;
      v8 = v4 << 1;
      if (v8 >= 0x100) {
        v8 ^= 0x11d;
      }
      v9 = v8 ^ v1;
      C[0][x] = [0, 0];
      C[0][x][0] = v1 << 24 | v1 << 16 | v4 << 8 | v1;
      C[0][x][1] = v8 << 24 | v5 << 16 | v2 << 8 | v9;
      for (t = 1; t < 8; t++) {
        C[t][x] = [0, 0];
        C[t][x][0] = (C[t - 1][x][0] >>> 8) | ((C[t - 1][x][1] << 24));
        C[t][x][1] = (C[t - 1][x][1] >>> 8) | ((C[t - 1][x][0] << 24));
      }
    }
    rc[0] = [0, 0];
    for (r = 1; r <= R; r++) {
      i = 8 * (r - 1);
      rc[r] = [0, 0];
      rc[r][0] = (C[0][i][0] & 0xff000000) ^ (C[1][i + 1][0] & 0x00ff0000) ^ (C[2][i + 2][0] & 0x0000ff00) ^ (C[3][i + 3][0] & 0x000000ff);
      rc[r][1] = (C[4][i + 4][1] & 0xff000000) ^ (C[5][i + 5][1] & 0x00ff0000) ^ (C[6][i + 6][1] & 0x0000ff00) ^ (C[7][i + 7][1] & 0x000000ff);
    }
    processBuffer = function () {
      var i, j, r, s, t;
      for (i = 0, j = 0; i < 8; i++, j += 8) {
        block[i] = [0, 0];
        block[i][0] = ((buffer[j] & 0xff) << 24) ^ ((buffer[j + 1] & 0xff) << 16) ^ ((buffer[j + 2] & 0xff) << 8) ^ ((buffer[j + 3] & 0xff));
        block[i][1] = ((buffer[j + 4] & 0xff) << 24) ^ ((buffer[j + 5] & 0xff) << 16) ^ ((buffer[j + 6] & 0xff) << 8) ^ ((buffer[j + 7] & 0xff));
      }
      for (i = 0; i < 8; i++) {
        state[i] = [0, 0];
        K[i] = [0, 0];
        K[i][0] = hash[i][0];
        K[i][1] = hash[i][1];
        state[i][0] = block[i][0] ^ K[i][0];
        state[i][1] = block[i][1] ^ K[i][1];
      }
      for (r = 1; r <= R; r++) {
        for (i = 0; i < 8; i++) {
          L[i] = [0, 0];
          for (t = 0, s = 56, j = 0; t < 8; t++, s -= 8, j = s < 32 ? 1 : 0) {
            L[i][0] ^= C[t][(K[(i - t) & 7][j] >>> (s % 32)) & 0xff][0];
            L[i][1] ^= C[t][(K[(i - t) & 7][j] >>> (s % 32)) & 0xff][1];
          }
        }
        for (i = 0; i < 8; i++) {
          K[i][0] = L[i][0];
          K[i][1] = L[i][1];
        }
        K[0][0] ^= rc[r][0];
        K[0][1] ^= rc[r][1];
        for (i = 0; i < 8; i++) {
          L[i][0] = K[i][0];
          L[i][1] = K[i][1];
          for (t = 0, s = 56, j = 0; t < 8; t++, s -= 8, j = s < 32 ? 1 : 0) {
            L[i][0] ^= C[t][(state[(i - t) & 7][j] >>> (s % 32)) & 0xff][0];
            L[i][1] ^= C[t][(state[(i - t) & 7][j] >>> (s % 32)) & 0xff][1];
          }
        }
        for (i = 0; i < 8; i++) {
          state[i][0] = L[i][0];
          state[i][1] = L[i][1];
        }
      }
      for (i = 0; i < 8; i++) {
        hash[i][0] ^= state[i][0] ^ block[i][0];
        hash[i][1] ^= state[i][1] ^ block[i][1];
      }
    };
    WP = function (str) {
      return WP.init().add(str).finalize();
    };
    WP.version = "3.0";
    WP.init = function () {
      var i;
      for (i = 0; i < 32; i++) {
        bitLength[i] = 0;
      }
      bufferBits = bufferPos = 0;
      buffer = [0];
      for (i = 0; i < 8; i++) {
        hash[i] = [0, 0];
      }
      return WP;
    };
    convert = function (source) {
      var i, n, str = source.toString();
      source = [];
      for (i = 0; i < str.length; i++) {
        n = str.charCodeAt(i);
        if (n >= 256) {
          source.push(n >>> 8 & 0xFF);
        }
        source.push(n & 0xFF);
      }
      return source;
    };
    WP.add = function (source, sourceBits) {
      var sourcePos, sourceGap, bufferRem, value, carry, b;
      if (!source) {
        return WP;
      }
      if (!sourceBits) {
        source = convert(source);
        sourceBits = source.length * 8;
      }
      sourcePos = 0;
      sourceGap = (8 - (sourceBits & 7)) & 7;
      bufferRem = bufferBits & 7;
      value = sourceBits;
      for (i = 31, carry = 0; i >= 0; i--) {
        carry += (bitLength[i] & 0xff) + (value % 256);
        bitLength[i] = carry & 0xff;
        carry >>>= 8;
        value = Math.floor(value / 256);
      }
      while (sourceBits > 8) {
        b = ((source[sourcePos] << sourceGap) & 0xff) | ((source[sourcePos + 1] & 0xff) >>> (8 - sourceGap));
        if (b < 0 || b >= 256) {
          return "Whirlpool requires a byte array";
        }
        buffer[bufferPos++] |= b >>> bufferRem;
        bufferBits += 8 - bufferRem;
        if (bufferBits === 512) {
          processBuffer();
          bufferBits = bufferPos = 0;
          buffer = [];
        }
        buffer[bufferPos] = ((b << (8 - bufferRem)) & 0xff);
        bufferBits += bufferRem;
        sourceBits -= 8;
        sourcePos++;
      }
      if (sourceBits > 0) {
        b = (source[sourcePos] << sourceGap) & 0xff;
        buffer[bufferPos] |= b >>> bufferRem;
      } else {
        b = 0;
      } if (bufferRem + sourceBits < 8) {
        bufferBits += sourceBits;
      } else {
        bufferPos++;
        bufferBits += 8 - bufferRem;
        sourceBits -= 8 - bufferRem;
        if (bufferBits === 512) {
          processBuffer();
          bufferBits = bufferPos = 0;
          buffer = [];
        }
        buffer[bufferPos] = ((b << (8 - bufferRem)) & 0xff);
        bufferBits += sourceBits;
      }
      return WP;
    };
    WP.finalize = function () {
      var i, j, h, str = "",
        digest = [],
        hex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
      buffer[bufferPos] |= 0x80 >>> (bufferBits & 7);
      bufferPos++;
      if (bufferPos > 32) {
        while (bufferPos < 64) {
          buffer[bufferPos++] = 0;
        }
        processBuffer();
        bufferPos = 0;
        buffer = [];
      }
      while (bufferPos < 32) {
        buffer[bufferPos++] = 0;
      }
      buffer.push.apply(buffer, bitLength);
      processBuffer();
      for (i = 0, j = 0; i < 8; i++, j += 8) {
        h = hash[i][0];
        digest[j] = h >>> 24 & 0xFF;
        digest[j + 1] = h >>> 16 & 0xFF;
        digest[j + 2] = h >>> 8 & 0xFF;
        digest[j + 3] = h & 0xFF;
        h = hash[i][1];
        digest[j + 4] = h >>> 24 & 0xFF;
        digest[j + 5] = h >>> 16 & 0xFF;
        digest[j + 6] = h >>> 8 & 0xFF;
        digest[j + 7] = h & 0xFF;
      }
      for (i = 0; i < digest.length; i++) {
        str += hex[digest[i] >>> 4];
        str += hex[digest[i] & 0xF];
      }
      return str;
    };
    return WP.init().add(string).finalize();
  }
};


TINY={};

TINY.box=function(){
	var j,m,b,g,v,p=0;
	return{
		show:function(o){
			v={opacity:70,close:1,animate:1,fixed:1,mask:1,maskid:'',boxid:'',topsplit:2,url:0,post:0,height:0,width:0,html:0,iframe:0};
			for(s in o){v[s]=o[s]}
			if(!p){
				j=document.createElement('div'); j.className='tbox';
				p=document.createElement('div'); p.className='tinner';
				b=document.createElement('div'); b.className='tcontent';
				m=document.createElement('div'); m.className='tmask';
				g=document.createElement('div'); g.className='tclose'; g.v=0;
				document.body.appendChild(m); document.body.appendChild(j); j.appendChild(p); p.appendChild(b);
				m.onclick=g.onclick=TINY.box.hide; window.onresize=TINY.box.resize
			}else{
				j.style.display='none'; clearTimeout(p.ah); if(g.v){p.removeChild(g); g.v=0}
			}
			p.id=v.boxid; m.id=v.maskid; j.style.position=v.fixed?'fixed':'absolute';
			if(v.html&&!v.animate){
				p.style.backgroundImage='none'; b.innerHTML=v.html; b.style.display='';
				p.style.width=v.width?v.width+'px':'auto'; p.style.height=v.height?v.height+'px':'auto'
			}else{
				b.style.display='none'; 
				if(!v.animate&&v.width&&v.height){
					p.style.width=v.width+'px'; p.style.height=v.height+'px'
				}else{
					p.style.width=p.style.height='100px'
				}
			}
			if(v.mask){this.mask(); this.alpha(m,1,v.opacity)}else{this.alpha(j,1,100)}
			if(v.autohide){p.ah=setTimeout(TINY.box.hide,1000*v.autohide)}else{document.onkeyup=TINY.box.esc}
		},
		fill:function(c,u,k,a,w,h){
			if(u){
				if(v.image){
					var i=new Image(); i.onload=function(){w=w||i.width; h=h||i.height; TINY.box.psh(i,a,w,h)}; i.src=v.image
				}else if(v.iframe){
					this.psh('<iframe src="'+v.iframe+'" width="'+v.width+'" frameborder="0" height="'+v.height+'"></iframe>',a,w,h)
				}else{
					var x=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP');
					x.onreadystatechange=function(){
						if(x.readyState==4&&x.status==200){p.style.backgroundImage=''; TINY.box.psh(x.responseText,a,w,h)}
					};
					if(k){
    	            	x.open('POST',c,true); x.setRequestHeader('Content-type','application/x-www-form-urlencoded'); x.send(k)
					}else{
       	         		x.open('GET',c,true); x.send(null)
					}
				}
			}else{
				this.psh(c,a,w,h)
			}
		},
		psh:function(c,a,w,h){
			if(typeof c=='object'){b.appendChild(c)}else{b.innerHTML=c}
			var x=p.style.width, y=p.style.height;
			if(!w||!h){
				p.style.width=w?w+'px':''; p.style.height=h?h+'px':''; b.style.display='';
				if(!h){h=parseInt(b.offsetHeight)}
				if(!w){w=parseInt(b.offsetWidth)}
				b.style.display='none'
			}
			p.style.width=x; p.style.height=y;
			this.size(w,h,a)
		},
		esc:function(e){e=e||window.event; if(e.keyCode==27){TINY.box.hide()}},
		hide:function(){TINY.box.alpha(j,-1,0,3); document.onkeypress=null; if(v.closejs){v.closejs()}},
		resize:function(){TINY.box.pos(); TINY.box.mask()},
		mask:function(){m.style.height=this.total(1)+'px'; m.style.width=this.total(0)+'px'},
		pos:function(){
			var t;
			if(typeof v.top!='undefined'){t=v.top}else{t=(this.height()/v.topsplit)-(j.offsetHeight/2); t=t<20?20:t}
			if(!v.fixed&&!v.top){t+=this.top()}
			j.style.top=t+'px'; 
			j.style.left=typeof v.left!='undefined'?v.left+'px':(this.width()/2)-(j.offsetWidth/2)+'px'
		},
		alpha:function(e,d,a){
			clearInterval(e.ai);
			if(d){e.style.opacity=0; e.style.filter='alpha(opacity=0)'; e.style.display='block'; TINY.box.pos()}
			e.ai=setInterval(function(){TINY.box.ta(e,a,d)},20)
		},
		ta:function(e,a,d){
			var o=Math.round(e.style.opacity*100);
			if(o==a){
				clearInterval(e.ai);
				if(d==-1){
					e.style.display='none';
					e==j?TINY.box.alpha(m,-1,0,2):b.innerHTML=p.style.backgroundImage=''
				}else{
					if(e==m){
						this.alpha(j,1,100)
					}else{
						j.style.filter='';
						TINY.box.fill(v.html||v.url,v.url||v.iframe||v.image,v.post,v.animate,v.width,v.height)
					}
				}
			}else{
				var n=a-Math.floor(Math.abs(a-o)*.5)*d;
				e.style.opacity=n/100; e.style.filter='alpha(opacity='+n+')'
			}
		},
		size:function(w,h,a){
			if(a){
				clearInterval(p.si); var wd=parseInt(p.style.width)>w?-1:1, hd=parseInt(p.style.height)>h?-1:1;
				p.si=setInterval(function(){TINY.box.ts(w,wd,h,hd)},20)
			}else{
				p.style.backgroundImage='none'; if(v.close){p.appendChild(g); g.v=1}
				p.style.width=w+'px'; p.style.height=h+'px'; b.style.display=''; this.pos();
				if(v.openjs){v.openjs()}
			}
		},
		ts:function(w,wd,h,hd){
			var cw=parseInt(p.style.width), ch=parseInt(p.style.height);
			if(cw==w&&ch==h){
				clearInterval(p.si); p.style.backgroundImage='none'; b.style.display='block'; if(v.close){p.appendChild(g); g.v=1}
				if(v.openjs){v.openjs()}
			}else{
				if(cw!=w){p.style.width=(w-Math.floor(Math.abs(w-cw)*.6)*wd)+'px'}
				if(ch!=h){p.style.height=(h-Math.floor(Math.abs(h-ch)*.6)*hd)+'px'}
				this.pos()
			}
		},
		top:function(){return document.documentElement.scrollTop||document.body.scrollTop},
		width:function(){return self.innerWidth||document.documentElement.clientWidth||document.body.clientWidth},
		height:function(){return self.innerHeight||document.documentElement.clientHeight||document.body.clientHeight},
		total:function(d){
			var b=document.body, e=document.documentElement;
			return d?Math.max(Math.max(b.scrollHeight,e.scrollHeight),Math.max(b.clientHeight,e.clientHeight)):
			Math.max(Math.max(b.scrollWidth,e.scrollWidth),Math.max(b.clientWidth,e.clientWidth))
		}
	}
}();

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