import { readLines, run } from '../run';

const sumArray = (input: number[]) => {
  return input.reduce((sum, num) => sum + num, 0);
};

const part1 = (input: number[][]) => {
  return input.reduce((max, calories) => {
    const sum = sumArray(calories);
    return sum > max ? sum : max;
  }, 0);
};

const part2 = (input: number[][]) => {
  const sums = input.map((calories) => sumArray(calories));
  const [one, two, three] = sums.sort((a, b) => b - a);
  return sumArray([one, two, three]);
};

const { arr: fullInput } = readLines('./day01-input').reduce(
  (acc, line) => {
    if (line === '') acc.idx++;
    else (acc.arr[acc.idx] ??= []).push(parseInt(line));
    return acc;
  },
  { arr: [], idx: 0 }
);

run(part1, fullInput);
run(part2, fullInput);
