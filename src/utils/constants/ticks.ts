import { MAX_BPM, MIN_BPM } from "./common";

const tickValues: number[] = [];

let i = MIN_BPM;
while (i <= MAX_BPM) {
  tickValues.push(i);
  if (i < 60) {
    i += 2;
  } else if (i < 72) {
    i += 3;
  } else if (i < 120) {
    i += 4;
  } else if (i < 144) {
    i += 6;
  } else if (i < 240) {
    i += 8;
  } else {
    i += 10;
  }
}

export default tickValues;
