import { readFile, convertTextToJson, result } from "./race";

let content = readFile("./kart.in");
content = convertTextToJson(content);

console.log(result(content));
