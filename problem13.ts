import { run } from './run';
interface Eqn {
  a: number;
  b: number;
  m: number;
  d: number;
  mFactorEqn: { m: number; b: number };
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

function brutePart2(input: number[]) {
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

function evalMFactor(eq1: Eqn, eq2: Eqn, x1: number = 0) {
  const { a: a1, b: b1, m: m1, d: d1 } = eq1;
  const { a: a2, b: b2, m: m2 } = eq2;
  return (a1 * (m1 * x1 + b1) + d1 - a2 * b2) / (a2 * m2);
}

function assignMFactor(eq1: Eqn, eq2: Eqn) {
  const { m: m2 } = eq2;
  let x1 = 0;
  let n: number;
  do {
    n = evalMFactor(eq1, eq2, ++x1);
  } while (n <= 0 || n % 1 !== 0);

  eq1.mFactorEqn.m = m2; // 59
  eq1.mFactorEqn.b = x1; // 62
}

function part2(input: [number, number[]]) {
  const [, busIds] = input;

  let [last] = busIds;
  const sections: number[][] = [[last]];
  let idx = 0;
  for (let i = 1; i < busIds.length; i++) {
    const busId = busIds[i];

    if (busId > 0) {
      sections[idx].push(busId);
      last = busId;
      if (i < busIds.length - 1) {
        sections.push([busId]);
        idx++;
      }
    } else {
      sections[idx].push(0);
    }
  }

  const equations: Eqn[] = sections.map((range) => {
    const minSequenceStart = brutePart2(range);
    const [a, m] = range.filter((val) => val > 0);
    return { a, m, b: minSequenceStart / a, d: range.length - 1, mFactorEqn: { m: -1, b: -1 } } as Eqn;
  });

  // Create equations for getting whole number factors
  for (let i = 0; i < equations.length - 1; i++) {
    assignMFactor(equations[i], equations[i + 1]);
  }

  let found = false;
  let mFactor = 0;
  const [eq1] = equations;
  const { m: m1, b: b1 } = eq1.mFactorEqn;
  let x;
  while (!found) {
    found = true;
    x = b1 + m1 * mFactor++;
    let test = x;
    for (let i = 0; i < equations.length - 1; i++) {
      test = evalMFactor(equations[i], equations[i + 1], test);
      if (test % 1 !== 0) {
        found = false;
        break;
      }
    }
  }

  const { a, m, b } = eq1;
  return a * (m * x + b);
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

const providedInput = `1000390
23,x,x,x,x,x,x,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,383,x,x,x,x,x,x,x,x,x,x,x,x,13,17,x,x,x,x,19,x,x,x,x,x,x,x,x,x,29,x,503,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,37`;

const [earliestTime, times] = providedInput.split('\n');
const input: [number, number[]] = [
  parseInt(earliestTime),
  times.split(',').map((val) => (val === 'x' ? 0 : parseInt(val))),
];

run(part1, input);
run(part2, input);
