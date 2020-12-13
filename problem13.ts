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

function _part2(input: [number, number[]]) {
  const [, busIds] = input;

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

function __part2(input: [number, number[]]) {
  const [, busIds] = input;

  const validBusIdIdxs = busIds.reduce((acc, cur, i) => {
    if (cur !== 0) acc.push(i);
    return acc;
  }, [] as number[]);

  const upperLimit = validBusIdIdxs.reduce((acc, busIdx, i) => {
    const busId = busIds[busIdx];
    return acc * busId;
  }, 1);

  let minFound = 0;
  for (let i = upperLimit; i >= 0; i -= busIds[0]) {
    let found = true;
    for (let j = 0; j < validBusIdIdxs.length; j++) {
      const busIdx = validBusIdIdxs[j];
      found = found && (i + busIdx) % busIds[busIdx] === 0;
      if (!found) break;
    }

    if (found) {
      minFound = i;
      console.log('-->', i);
    }
  }

  console.log(minFound);
}

function part2(input: [number, number[]]) {
  const [, busIds] = input;

  const validBusIdIdxs = busIds.reduce((acc, cur, i) => {
    if (cur !== 0) acc.push(i);
    return acc;
  }, [] as number[]);

  let upperLimit = busIds[0];
  let lastUpperLimit = busIds[0];
  let minFound = 0;
  for (let k = 1; k < validBusIdIdxs.length; k++) {
    upperLimit *= busIds[validBusIdIdxs[k]];
    console.log(upperLimit);

    for (let i = upperLimit; i >= lastUpperLimit; i -= busIds[0]) {
      let found = true;
      for (let j = 1; j < validBusIdIdxs.length; j++) {
        const busIdx = validBusIdIdxs[j];
        const busId = busIds[busIdx];

        // Break early if `i` is divisible by an id that is not itself
        if (i % busId === 0) {
          found = false;
          break;
        }

        found = found && (i + busIdx) % busId === 0;
        if (!found) break;
      }

      if (found) {
        minFound = i;
        console.log('-->', i);
      }
    }

    lastUpperLimit = upperLimit;
  }

  return minFound;
}

const providedInput = `1000390
23,x,x,x,x,x,x,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,383,x,x,x,x,x,x,x,x,x,x,x,x,13,17,x,x,x,x,19,x,x,x,x,x,x,x,x,x,29,x,503,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,37`;

const exampleInput1 = `939
7,13,x,x,59,x,31,19`;

const [earliestTime, times] = providedInput.split('\n');
const input: [number, number[]] = [
  parseInt(earliestTime),
  times.split(',').map((val) => (val === 'x' ? 0 : parseInt(val))),
];

console.log(part1(input));
console.log(part2(input));
