import { readLines, run } from '../run-deno.ts';
const [, __filename] = new URL('', import.meta.url).pathname.match(/(day\d+?).ts/) || [];

type Position = [number, number];
type Direction = 'U' | 'D' | 'L' | 'R';
type Operation = [Direction, number];
type Input = Operation[];

const part1 = (input: Input) => {
  let [i, j]: Position = [0, 0];
  let [x, y]: Position = [0, 0];
  const tailVisitations: Record<number, Set<number>> = {};

  input.forEach(([dir, steps]) => {
    for (let step = 0; step < steps; step++) {
      // HEAD Movement
      if (dir === 'U') i--;
      else if (dir === 'D') i++;
      else if (dir === 'L') j--;
      else j++;

      // TAIL Movement
      const xDiff = i - x;
      const yDiff = j - y;
      const absXDiff = Math.abs(xDiff);
      const absYDiff = Math.abs(yDiff);
      if (absXDiff > 1 || absYDiff > 1) {
        x += xDiff === 0 ? xDiff : xDiff / absXDiff;
        y += yDiff === 0 ? yDiff : yDiff / absYDiff;
      }

      (tailVisitations[x] ??= new Set()).add(y);
    }
  });

  return Object.values(tailVisitations).reduce((acc, set) => acc + set.size, 0);
};

const part2 = (input: Input) => {
  const head: Position = [0, 0];
  const knots: Position[] = [head, ...(Array.from({ length: 9 }, () => [0, 0]) as Position[])];
  const tail = knots[knots.length - 1];

  const tailVisitations: Record<number, Set<number>> = {};

  input.forEach(([dir, steps]) => {
    for (let step = 0; step < steps; step++) {
      // HEAD Movement
      if (dir === 'U') head[0]--;
      else if (dir === 'D') head[0]++;
      else if (dir === 'L') head[1]--;
      else head[1]++;

      for (let idx = 1; idx < knots.length; idx++) {
        const [i, j] = knots[idx - 1];
        const knot = knots[idx];

        // TAIL Movement
        const xDiff = i - knot[0];
        const yDiff = j - knot[1];
        const absXDiff = Math.abs(xDiff);
        const absYDiff = Math.abs(yDiff);
        if (absXDiff > 1 || absYDiff > 1) {
          knot[0] += xDiff === 0 ? xDiff : xDiff / absXDiff;
          knot[1] += yDiff === 0 ? yDiff : yDiff / absYDiff;
        }
      }

      (tailVisitations[tail[0]] ??= new Set()).add(tail[1]);
    }
  });

  return Object.values(tailVisitations).reduce((acc, set) => acc + set.size, 0);
};

const fullInput = readLines(`./${__filename}-input`);
const input: Input = fullInput.reduce((acc, line) => {
  const [dir, steps] = line.split(' ');
  acc.push([dir as Direction, parseInt(steps)]);
  return acc;
}, [] as Input);

run(part1, input); // part1: 5930 -- 0.86ms
run(part2, input); // part2: 2443 -- 1.54ms
