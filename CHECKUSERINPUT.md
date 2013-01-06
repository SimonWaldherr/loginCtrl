#[loginCtrl](https://github.com/SimonWaldherr/loginCtrl)

an easy to use, free login system. (sqlite + PHP + JS)

##checkuserinput.inc.php


###fm_email(```$text```,```$correct=0```)

INPUT                                 | OUTPUT  
--------------------------------------|------------------
```test@example.tld```                | test@example.tld
```tést@éxàmplê.tld```                | **false**
```tést@éxàmplê.tld``` ```1```        | tst@xmpl.tld
```test<at>example<dot>tld```         | **false**
```test<at>example<dot>tld``` ```1``` | test@example.tld

###fm_password(```$text```)

INPUT                              | OUTPUT  
-----------------------------------|------------------
```god```                          | 26
```test```                         | 38
```flower```                       | 69
```Lorem Ipsum```                  | 332
```Lorem Ipsum 23```               | 1094
```Lorem Ipsum Dolar sit Amet```   | 2263
```iOl/$=08!<._-98*aJjlsSRfzo```   | 6826


###fm_text(```$text```,```$mode=0```)

INPUT                                  | OUTPUT  
---------------------------------------|------------------
```<b>lörém îpsum dòlár</b>``` ```0``` | ```lörém îpsum dòlár```
```<b>lörém îpsum dòlár</b>``` ```1``` | ```&lt;b&gt;l&ouml;r&eacute;m &icirc;psum d&ograve;l&aacute;r&lt;/b&gt;```
```<b>lörém îpsum dòlár</b>``` ```2``` | ```&lt;b&gt;lörém îpsum dòlár&lt;/b&gt;```
```<b>lörém îpsum dòlár</b>``` ```3``` | ```%3Cb%3El%C3%B6r%C3%A9m+%C3%AEpsum+d%C3%B2l%C3%A1r%3C%2Fb%3E```
```<b>lörém îpsum dòlár</b>``` ```4``` | ```PGI+bMO2csOpbSDDrnBzdW0gZMOybMOhcjwvYj4=```
