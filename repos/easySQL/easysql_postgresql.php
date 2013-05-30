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


function easysql_postgresql_create($array) {
  $db = pg_connect('host='.$array[0][0].' port='.$array[0][1].' dbname='.$array[0][2].' user='.$array[0][3].' password='.$array[0][4]);

  $query = 'CREATE TABLE ' . $array[1] . ' (';
  foreach ($array as $key => $value) {
    if (is_string($key)) {
      $query .= ' `' . $key . '` ' . $value . ',';
    }
  }
  if (pg_last_error($db)) {
    printf("Connect failed: %s\n", pg_last_error($db));
    exit();
  }
  $query = str_replace(',,)', ')', $query . ',)');
  return pg_query($db, $query);
}

function easysql_postgresql_insert($array) {
  $db = pg_connect('host='.$array[0][0].' port='.$array[0][1].' dbname='.$array[0][2].' user='.$array[0][3].' password='.$array[0][4]);
  $query1 = 'INSERT INTO ' . $array[1] . ' (';
  $query2 = 'VALUES (';
  foreach ($array as $key => $value) {
    if (is_string($key)) {
      $query1 .= '`' . $key . '`,';
      $query2 .= '\'' . $value . '\',';
    }
  }
  $query = str_replace(',,)', ') ', $query1 . ',)') . str_replace(',,)', ');', $query2 . ',)');
  if (pg_last_error($db)) {
    printf("Connect failed: %s\n", pg_last_error($db));
    exit();
  }
  $results = pg_query($db, $query);
  return pg_last_oid($results);
}

function easysql_postgresql_update($array, $query = 'AND') {
  $db = pg_connect('host='.$array[0][0].' port='.$array[0][1].' dbname='.$array[0][2].' user='.$array[0][3].' password='.$array[0][4]);
  if (pg_last_error($db)) {
    printf("Connect failed: %s\n", pg_last_error($db));
    exit();
  }
  if (($query == 'AND') || ($query == 'OR')) {
    foreach ($array[2] as $key => $value) {
      if (is_string($key)) {
        $valarray = explode(';', $value);
        if (!isset($valarray[1])) {
          $query1array[] .= $key . " = '" . $value . "'";
        } else {
          $query1array[] .= $key . ' ' . $valarray[0] . " '" . $valarray[1] . "'";
        }
      }
    }
    foreach ($array[3] as $key => $value) {
      if (is_string($key)) {
        $query2array[] = $key . " = '" . $value . "' ";
      }
    }
    $query1 = 'UPDATE ' . $array[1] . ' SET ' . implode(', ', $query2array) . ' WHERE ' . implode(' ' . $query . ' ', $query1array);
  } else {
    $query1 = $query;
  }
  if (pg_last_error($db)) {
    printf("Connect failed: %s\n", pg_last_error($db));
    exit();
  }
  $results = pg_query($db, $query1);
  return $results;
}

function easysql_postgresql_select($array, $limit = 'no', $query = 'AND') {
  $db = pg_connect('host='.$array[0][0].' port='.$array[0][1].' dbname='.$array[0][2].' user='.$array[0][3].' password='.$array[0][4]);

  if (pg_last_error($db)) {
    printf("Connect failed: %s\n", pg_last_error($db));
    exit();
  }

  $query1 = '';
  if (($query == 'AND') || ($query == 'OR')) {
    foreach ($array as $key => $value) {
      if (is_string($key)) {
        $wherearray = explode('||', $value);
        if (!isset($wherearray[1])) {
          $valarray = explode(';', $value);
          if (!isset($valarray[1])) {
            $query1 .= $key . " = '" . $value . "' " . $query . ' ';
          } else {
            $query1 .= $key . ' ' . $valarray[0] . " '" . $valarray[1] . "' " . $query . ' ';
          }
        } else {
          $query = 'OR';
          foreach ($wherearray as $where) {
            $valarray = explode(';', $where);
            if (!isset($valarray[1])) {
              $query1 .= $key . " = '" . $where . "' " . $query . ' ';
            } else {
              $query1 .= $key . ' ' . $valarray[0] . " '" . $valarray[1] . "' " . $query . ' ';
            }
          }
        }
      }
    }
    $query1 = 'SELECT * FROM ' . $array[1] . ' WHERE ' . str_replace($query . ' ,)', ' ', $query1 . ',)');
    if (is_int($limit)) {
      $query1 .= ' LIMIT ' . $limit . ';';
    }
  } else {
    $query1 = $query;
  }
  if (pg_last_error($db)) {
    printf("Connect failed: %s\n", pg_last_error($db));
    exit();
  }
  $results = pg_query($db, $query1);
  $i     = 0;

  while ($row = pg_fetch_array($results)) {
    $return[$i] = $row;
    ++$i;
  }
  return $return;
}

function easysql_postgresql_getsorted($array, $order = '', $limit = '', $direction = '') {
  $db = pg_connect('host='.$array[0][0].' port='.$array[0][1].' dbname='.$array[0][2].' user='.$array[0][3].' password='.$array[0][4]);
  $query = 'SELECT * FROM ' . $array[1];
  if (pg_last_error($db)) {
    printf("Connect failed: %s\n", pg_last_error($db));
    exit();
  }
  if ($order != '') {
    $query .= ' ORDER BY ' . $order;
    if ($direction) {
      $query .= ' DESC';
    }
  }

  if (is_int($limit)) {
    $query .= ' LIMIT ' . $limit . ';';
  }

  $results = pg_query($db, $query . ';');
  $i     = 0;

  while ($row = pg_fetch_array($results)) {
    $return[$i] = $row;
    ++$i;
  }
  return $return;
}

function easysql_postgresql_export($array, $format = 'csv', $where = 'return') {
  $db = pg_connect('host='.$array[0][0].' port='.$array[0][1].' dbname='.$array[0][2].' user='.$array[0][3].' password='.$array[0][4]);
  $query1 = 'SELECT * FROM ' . $array[1];
  if (pg_last_error($db)) {
    printf("Connect failed: %s\n", pg_last_error($db));
    exit();
  }
  $results = pg_query($db, $query1 . ';');
  $return  = '';
  $i     = 0;
  if ($format == 'csv') {
    while ($row = pg_fetch_array($results)) {
      foreach ($row as $id => $result) {
        if (is_int($id)) {
          if ($id == 0) {
            ++$i;
          }
          $returnarray[$i][] = $result;
        }
      }
    }
    foreach ($returnarray as $line) {
      $return .= implode(";", $line) . "\n";
    }
  }

  if ($where == 'return') {
    return $return;
  } elseif ($where == 'echo') {
    echo $return;
  } else {
    $success = true;
    if (!$handle = fopen($where, 'w')) {
      $success = false;
    }

    if (fwrite($handle, $return) === FALSE) {
      $success = false;
    }

    if (!fclose($handle)) {
      $success = false;
    }
    return $success;
  }
}

function easysql_postgresql_count($array) {
  $db = pg_connect('host='.$array[0][0].' port='.$array[0][1].' dbname='.$array[0][2].' user='.$array[0][3].' password='.$array[0][4]);
  $query1  = 'SELECT count(id) FROM ' . $array[1] . ' LIMIT 1';
  $results = pg_query($db, $query1);
  return $results;
}

function easysql_postgresql_maxmin($array, $where = '') {
  $db = pg_connect('host='.$array[0][0].' port='.$array[0][1].' dbname='.$array[0][2].' user='.$array[0][3].' password='.$array[0][4]);
  $query1 = 'SELECT max(' . $array[2] . ') FROM ' . $array[1];
  if ($where != '') {
    $query1 = $query1 . ' WHERE ' . $where;
  }
  $results = pg_query($db, $query1);
  $rows  = pg_fetch_all($results);
  return $rows[0];
}

?>
