import { readFileSync } from "fs";
import { resolve, dirname } from "path";

export function readFile(path) {
  const absolutePath = resolve(dirname(module.parent.filename), path);
  const content = readFileSync(absolutePath, "utf8");

  return content;
}

export function convertTextToJson(content) {
  const keys = [
    "time",
    "pilot_id",
    "pilot_name",
    "lap",
    "lap_time",
    "velocity"
  ];

  return content
    .split("\n")
    .splice(1)
    .map(line =>
      line.split(/\s–\s|\s+/).reduce((run, data, i) => {
        const key = keys[i];
        run[key] = data;
        return run;
      }, {})
    );
}

export function result(content) {
  const pilotRace = content
    .reduce(lapsPerPilot, [])
    .reduce(bestResultsOfPilot, [])
    .map((pilot, i, arr) => {
      const front_pilot_time = pilot.total_time;
      const back_pilot_time = arr[i + 1].total_time;

      pilot.forward_time = front_pilot_time - back_pilot_time;
      return pilot;
    });

  console.log(pilotRace);
}

function lapsPerPilot(pilots, line) {
  const key = Number(line.pilot_id);

  if (pilots[key] == undefined) {
    pilots[key] = [];
  }

  pilots[key].push(line);

  return pilots;
}

function bestResultsOfPilot(results, pilot) {
  const bestOfPilot = pilot.reduce(
    (best, lap) => {
      const lapTime = convertTimeToNumber(lap.lap_time);
      const bestTime = best.best_time;

      best.pilot_id = lap.pilot_id;
      best.pilot_name = lap.pilot_name;

      if (lapTime < bestTime) {
        best.best_time = lapTime;
        best.best_lap = Number(lap.lap);
      }

      best.total_time += lapTime;
      best.total_laps++;

      return best;
    },
    { best_time: Infinity, total_time: 0, total_laps: 0 }
  ); // fim do reduce

  bestOfPilot.avg_time = bestOfPilot.total_time / bestOfPilot.total_laps;

  const { total_time, total_laps, best_time } = bestOfPilot;
  bestOfPilot.avg_time = convertNumberToTime(total_time / total_laps);
  bestOfPilot.total_time = convertNumberToTime(total_time);
  bestOfPilot.best_time = convertNumberToTime(best_time);

  results.push(bestOfPilot);

  return results;
}

function convertTimeToNumber(time) {
  time = time.split(":").map(Number);
  time = time[0] * 60 + time[1];
  return Number(time.toFixed(3));
}

function convertNumberToTime(number) {
  const minutes = Math.trunc(number / 60);
  const secondsAndMilis = (number - minutes * 60).toFixed(3).padStart(6, "0");

  return `${minutes}:${secondsAndMilis}`;
}
