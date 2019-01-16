<?php
// XXX: getcsv não funciona na tabulação "desordenada"
function csvToArray($csv_text) {
  $spreadsheet = [];

  $separator = "\r\n";
  $line = strtok($csv_text, $separator);
  $line = strtok($separator);
  while ($line !== false) {
    $keys = ["time", "pilot", "lap", "laptime", "velocity"];
    $spreadsheet[] = array_combine($keys, preg_split("/\s{2,}|\t+/", $line));
    $line = strtok($separator);
  }

  $spreadsheet = array_map(function($line) {
    list($id, $name) = explode(" – ", $line["pilot"]);

    $line["pilot"] = [
      "id" => $id,
      "name" => $name
    ];

    return $line;
  }, $spreadsheet);

  return $spreadsheet;
}

function finished($run_array){
  //Posição Chegada, Código Piloto, Nome Piloto, Qtde voltas Completadas e Tempo Total de Prova.
  usort($run_array, function($pilot1, $pilot2) {
    $isSameLap = $pilot1["lap"] == $pilot2["lap"];
    $isLapOver2 = $pilot1["lap"] > $pilot2["lap"];
    $isTimeOver2 = $pilot1["time"] <= $pilot2["time"];

    if($isSameLap) {
      return $isTimeOver2 ? 1 : -1;
    } elseif ($isLapOver2) {
      return 1;
    }

    return -1;
  });

  $positions = array_reduce($run_array, function($acc, $line) {
    $acc = $acc ?? [];

    $acc[$line["pilot"]["id"]] = $line["lap"];
    return $acc;
  });

  return $positions;
}


var_dump(finished(csvToArray(file_get_contents("./Kart.in"))));