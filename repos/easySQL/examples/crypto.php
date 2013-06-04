<?php

/*
 *
 * easySQL
 * 
 * Repo: https://github.com/SimonWaldherr/easySQL
 * Demo: http://cdn.simon.waldherr.eu/projects/easySQL/
 * License: MIT
 * Version: 0.5.1
 *
 */


function easysql_encrypt($str, $key) {
  $block = mcrypt_get_block_size('des', 'ecb');
  if (($pad = $block - (strlen($str) % $block)) < $block) {
    $str .= str_repeat(chr($pad), $pad);
  }
  return mcrypt_encrypt(MCRYPT_DES, mhash(MHASH_SHA1, $key), $str, MCRYPT_MODE_ECB);
}

function easysql_decrypt($str, $key) {
  $str   = mcrypt_decrypt(MCRYPT_DES, mhash(MHASH_SHA1, $key), $str, MCRYPT_MODE_ECB);
  $block = mcrypt_get_block_size('des', 'ecb');
  $pad   = ord($str[($len = strlen($str)) - 1]);
  if ($pad && $pad < $block && preg_match('/' . chr($pad) . '{' . $pad . '}$/', $str)) {
    return substr($str, 0, strlen($str) - $pad);
  }
  return $str;
}

function easysql_cryptohash($str, $salt) {
  $crc325 = md5($str . $salt);
  for ($i = 1; $i <= 32; $i++) {
    if ($i % 2) {
      $crc325 = md5($str . $salt . $crc325);
    }
    $crc325 = crc32($crc325);
  }
  return substr(crypt(hash("SHA256", $str . $salt . $crc325) . encrypt($str, mhash(MHASH_SHA1, $salt . md5($salt))), '$6$rounds=8192$0F6203791d6c37a2c59bd5C1Z$'), 32);
}

function easysql_hashmix($text, $salt = '!entersalthere!1', $rounds = 5120) {
  if ($rounds > 999999999) {
    $rounds = 999999900;
  }
  if ($rounds < 1000) {
    $rounds = 1200;
  }
  if ((strlen($salt) < 16) || (strlen($salt) > 16)) {
    $salt = str_split(hash("SHA512", $salt), 16);
    $salt = str_split(hash("whirlpool", $salt[2] . strtoupper(md5($salt[3])) . strtolower(md5($salt[4]))), 16);
    $salt = ucfirst($salt[1]);
  }
  $return = crypt($text, '$6$rounds=' . $rounds . '$' . $salt . '$');
  $return = crypt($return . hash("SHA256", $text . $return . $salt . crc32($return) . md5($return)), '$6$rounds=1000$' . $salt . '$');
  $return = explode($salt . '$', $return);
  return $return[1];
}

function easysql_raw2hex($raw) {
  $m = unpack('H*', $raw);
  return $m[1];
}

function easysql_hex2raw($hex) {
  return pack('H*', $hex);
}

?>
