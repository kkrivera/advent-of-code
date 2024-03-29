import { readLines, run } from '../run';

const part1 = (input: number[]) => {
  let increasing = 0;
  for (let i = 1; i < input.length; i++) {
    if (input[i] - input[i - 1] > 0) increasing++;
  }

  return increasing;
};

const part2 = (input: number[]) => {
  const windowSums: number[] = [];
  for (let i = 2; i < input.length; i++) {
    windowSums.push(input[i] + input[i - 1] + input[i - 2]);
  }

  return part1(windowSums);
};

const fullInput = readLines('./day01-input').map((line) => parseInt(line));

run(part1, fullInput); // part1: 1557 -- 0.0082ms
run(part2, fullInput); // part2: 1608 -- 0.0504ms
