import { readFileSync } from "fs";
import { resolve } from "path";

export function proccessFile(path) {
  const absolutePath = resolve(__dirname + "/" + path);
  const content = readFileSync(absolutePath, "utf8");

  return content;
}

function tabbedCsvToJson(content) {
  //const keys = ["time", "pilot", "lap", "laptime", "velocity"];
  //content.split(/\s{2,}|\t+/);
}
