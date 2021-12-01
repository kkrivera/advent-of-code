import { run } from '../run';
interface Eqn {
  a: number;
  b: number;
  m: number;
  d: number;
}

function part1(input: [number, number[]]) {
  let timeAfter = 0;
  const [earliestTime, busIds] = input;

  let matchedBusId = 0;

  while (matchedBusId === 0) {
    busIds.forEach((busId) => {
      if ((earliestTime + timeAfter) % busId === 0) {
        matchedBusId = busId;
      }
    });

    if (matchedBusId === 0) timeAfter++;
  }

  return timeAfter * matchedBusId;
}

function bruteForceFindFirstSequence(input: number[]) {
  const busIds = input;

  const validBusIdIdxs = busIds.reduce((acc, cur, i) => {
    if (cur !== 0) acc.push(i);
    return acc;
  }, [] as number[]);

  let found = false;
  let mult = 0;
  let start;
  const [startId] = busIds;
  while (!found) {
    start = startId * ++mult;
    found = true;
    for (let i = 1; i < validBusIdIdxs.length; i++) {
      const j = validBusIdIdxs[i];
      const busId = busIds[j];

      // Ignore the 'x' mapped to 0
      found = found && (start + j) % busId === 0;

      if (!found) break;
    }
  }

  return start;
}

// Find greatest common denominator
function gcd(...numbers: number[]) {
  let [a, b] = numbers;

  // Allow for recursive combination of gcd
  if (numbers.length > 2) return gcd(a, gcd.apply(this, numbers.slice(1)));

  if (a === 0) return b;
  else if (b === 0) return a;

  if (b > a) {
    const swap = a;
    a = b;
    b = swap;
  }

  return gcd(b, a % b);
}

// Find lowest common multiple
function lcm(...numbers: number[]) {
  const [a, b] = numbers;

  // Recursively find the LCM among a list of
  if (numbers.length > 2) return lcm(a, lcm.apply(this, numbers.slice(1)));
  return Math.abs(a * b) / gcd(a, b);
}

function rangeToEqn(range: number[]): Eqn {
  const minSequenceStart = bruteForceFindFirstSequence(range);
  const [a, m] = range.filter((val) => val > 0);
  return { a, m, b: minSequenceStart / a, d: range.length - 1 } as Eqn;
}

function getNextEqn({ a, b, m }: Eqn, range: number[]): Eqn {
  let x = 0;
  let minSequenceStart;
  const d = range.length - 1;
  const rangeEnd = range[range.length - 1];
  while (true) {
    minSequenceStart = a * (b + m * x++);
    if ((minSequenceStart + d) % rangeEnd === 0) {
      break;
    }
  }

  return { a, m: lcm(m, rangeEnd), b: minSequenceStart / a, d } as Eqn;
}

function part2(input: [number, number[]]) {
  const [, busIds] = input;

  let range = [busIds[0]];
  let eq;
  for (let i = 1; i < busIds.length; i++) {
    const busId = busIds[i];
    range.push(busId);
    if (busId > 0) {
      // Initialize our first equation or build off the last
      if (!eq) eq = rangeToEqn(range);
      else eq = getNextEqn(eq, range);
    }
  }

  const { a, b } = eq;
  return a * b;
}

const providedInput = `1000390
23,x,x,x,x,x,x,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,383,x,x,x,x,x,x,x,x,x,x,x,x,13,17,x,x,x,x,19,x,x,x,x,x,x,x,x,x,29,x,503,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,37`;

const [earliestTime, times] = providedInput.split('\n');
const input: [number, number[]] = [
  parseInt(earliestTime),
  times.split(',').map((val) => (val === 'x' ? 0 : parseInt(val))),
];

run(part1, input);
run(part2, input);
