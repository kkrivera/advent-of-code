import { readLines, run } from '../run';

type Input = number[];

const part1 = (input: Input) => {
  return getMinFuel(input, (anchor, position) => Math.abs(anchor - position));
};

const part2 = (input: Input) => {
  return getMinFuel(input, (anchor, position) => {
    const dist = Math.abs(anchor - position);
    return (Math.pow(dist, 2) + dist) / 2;
  });
};

const getMinFuel = (input: Input, calcFuel: (anchor: number, position: number) => number) => {
  const jsonInput: { [num: number]: number } = input.reduce((acc, crab) => {
    acc[crab] ??= 0;
    acc[crab]++;
    return acc;
  }, {});
  const positions = Object.keys(jsonInput).map((key) => parseInt(key));

  const minPos = Math.min(...input);
  const maxPos = Math.max(...input);
  let minFuel = Number.MAX_VALUE;
  for (let anchor = minPos; anchor <= maxPos; anchor++) {
    let fuel = positions.reduce((acc, position) => acc + calcFuel(position, anchor) * jsonInput[position], 0);
    if (fuel < minFuel) minFuel = fuel;
  }
  return minFuel;
};

const [fullInput] = readLines('./day07-input');
const processInput = (input: string): Input => {
  return input.split(',').map((num) => parseInt(num));
};

run(part1, processInput(fullInput)); // part1: 342641 -- 46.1715ms
run(part2, processInput(fullInput)); // part2: 93006301 -- 48.9888ms
