<?php

/*
 *
 * Repo: https://github.com/SimonWaldherr/loginCtrl
 * Demo: http://cdn.simon.waldherr.eu/projects/loginCtrl/
 * License: MIT
 * Version: 0.11
 *
 * File: checkuserinput.inc.php
 *
 */

function fm_converttxt($text){$textarray=str_split($text);
$textoutput='';
foreach($textarray as $letter){$ascii=ord($letter);
if((($ascii>47)&&($ascii<59))||(($ascii>62)&&($ascii<91))||(($ascii>96)&&($ascii<123))){$textoutput .=$letter;}
if(((($ascii>34)&&($ascii<47))||($ascii==61)||($ascii==33))&&($ascii!=39)){$textoutput .=$letter;}}
return $textoutput;}
function fm_email($text,$correct=0){if(eregi('^[a-z0-9._-]+@[a-z0-9._-]+\.([a-z]{2,8})$',mb_strtolower($text))){if(filter_var($text,FILTER_VALIDATE_EMAIL)){return mb_strtolower($text);}}
else{if($correct){$text=fm_converttxt(str_ireplace(array('<at>','(at)',' at ',' dot ','<dot>','(dot)',' '),array('@','@','@','.','.','.',''),mb_strtolower($text)));
if((eregi('^[a-z0-9._-]+@[a-z0-9._-]+\.([a-z]{2,8})$',mb_strtolower($text)))&&(filter_var($text,FILTER_VALIDATE_EMAIL))){return mb_strtolower($text);}
else{return false;}}
else{return false;}}}
function fm_password($text){$valunicode="";
$keys=str_split($text); $numbers=1; $uletter=1; $lletter=1; $special=1; $complex=0;
foreach($keys as $key){$ascii=ord($key);
if(($ascii>0x40)&&($ascii<0x5B)){++$uletter;}
if(($ascii>0x60)&&($ascii<0x7B)){++$lletter;}
if(($ascii>0x2F)&&($ascii<0x3A)){++$numbers;}
if(($ascii>0x20)&&($ascii<0x7F)){++$special;}}
$complex=((($uletter*$lletter*$numbers*$special)+round($uletter*1.8+$lletter*1.5+$numbers+$special*2))-7);
return $complex;}
function fm_text($text,$mode=0){if(!$mode){$text=strip_tags(addslashes($text));}
if($mode==1){$text=htmlentities($text,ENT_QUOTES,'UTF-8');}
if($mode==2){$text=htmlspecialchars($text,ENT_QUOTES,'UTF-8');}
if($mode==3){$text=urlencode($text);}
if($mode==4){$text=base64_encode($text);}
return nl2br($text);}
?>
