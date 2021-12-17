import { readLines, run } from '../run';

type Range<T = number> = [T, T];
type Input = [Range, Range];

const part1 = ([, yRange]: Input) => {
  const ySolutions = findVelocities(yRange);
  const vy = Math.max(...Object.values(ySolutions).reduce((acc, set) => acc.concat(Array.from(set)), [] as number[]));
  return summation(vy);
};

const part2 = ([xRange, yRange]: Input) => {
  const ySolutions = findVelocities(yRange);
  const xSolutions = findVelocities(xRange, true);

  const ySolutionSteps = Object.keys(ySolutions).map((yStep) => parseInt(yStep));
  const [minYStep, maxYStep] = [Math.min(...ySolutionSteps), Math.max(...ySolutionSteps)];

  const [minX, maxX] = xRange;
  const xSolutionsByVelocity = Object.entries(xSolutions).reduce((acc, [step, vxSet]) => {
    vxSet.forEach((vx) => (acc[vx] ??= []).push(parseInt(step)));
    return acc;
  }, {} as { [vx: number]: number[] });

  const makePair = (a, b) => `${a},${b}`;

  return Object.keys(xSolutionsByVelocity)
    .map((vx) => parseInt(vx))
    .reduce((acc, vx) => {
      const vxSummation = summation(vx);
      const steps = xSolutionsByVelocity[vx];

      if (vxSummation >= minX && vxSummation <= maxX) {
        // Handle when vx applies to multiple vy entries
        const minStep = Math.min(...steps);
        for (let i = minStep; i <= maxYStep; i++) {
          if (ySolutions[i]) ySolutions[i].forEach((vy) => acc.add(makePair(vx, vy)));
        }
      } else {
        // Handle normally with multiplicative logic
        steps.forEach((step) => ySolutions[step].forEach((vy) => acc.add(makePair(vx, vy))));
      }

      return acc;
    }, new Set()).size;
};

const findVelocities = ([targetMin, targetMax]: Range, isX: boolean = false) => {
  const solutions: { [step: number]: Set<number> } = {};

  if (!isX) {
    // Alertnate Solution (actually ends up being faster, but it's not as cool as below)
    // const iter = Math.abs(targetMin);
    // for (let vy0 = -iter; vy0 <= iter; vy0++) {

    //   let y = 0;
    //   let stepCount = 1;

    //   let vy = vy0;
    //   while (true) {
    //     y += vy--;
    //     if (y < targetMin) {
    //       break;
    //     }

    //     if (y >= targetMin && y <= targetMax) {
    //       (solutions[stepCount] ??= new Set()).add(vy0);
    //     }
    //     stepCount++;
    //   }
    // }

    const [minSteps, maxSteps]: Range = [1, (targetMax - targetMin) * 20];
    for (let y = targetMin; y <= targetMax; y++) {
      for (let step = minSteps; step <= maxSteps; step++) {
        const vy = Math.floor(calcV(step, 0, y, -1));
        const yVal = posAfterSteps(vy, step);
        if (yVal >= targetMin && yVal <= targetMax) {
          (solutions[step] ??= new Set()).add(vy);
        }
      }
    }
  } else {
    for (let vx0 = 1; vx0 <= targetMax; vx0++) {
      let x = 0;
      let stepCount = 1;

      for (let vx = vx0; vx > 0; vx--, stepCount++) {
        x += vx;
        if (x > targetMax) {
          break;
        }

        if (x >= targetMin && x <= targetMax) {
          (solutions[stepCount] ??= new Set()).add(vx0);
        }
      }
    }
  }

  return solutions;
};

const calcV = (t: number, y0: number, y: number, ay: number) => {
  return (y - y0 - 0.5 * ay * Math.pow(t, 2)) / t;
};

const posAfterSteps = (v: number, steps: number) => {
  let sum = 0;
  while (steps-- > 0) {
    sum += v--;
  }
  return sum;
};

const summation = (p: number) => (Math.pow(p, 2) + p) / 2;

const [fullInput] = readLines('./day17-input');
const exampleInput = `target area: x=20..30, y=-10..-5`;

const processInput = (input: string): Input => {
  return input
    .replace('target area: ', '')
    .split(', ')
    .map((segment) => {
      const [, range] = segment.split('=');
      const [begin, end] = range.split('..');
      return [parseInt(begin), parseInt(end)] as Range;
    }) as Input;
};

run(part1, processInput(exampleInput)); // part1: 45 -- 0.0711ms
run(part2, processInput(fullInput)); // part2: 2040 -- 4.5007ms
