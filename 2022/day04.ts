import { readLines, run } from '../run-deno.ts';

type Range = [number, number];
type Ranges = [Range, Range];
type Input = Ranges[];

const fullyContains = ([f1, f2]: Range, [s1, s2]: Range) => {
  return f1 <= s1 && f2 >= s2;
};

const overlaps = ([f1, f2]: Range, [s1, s2]: Range) => {
  return (s1 >= f1 && s1 <= f2) || (s2 >= f1 && s2 <= f2);
};

const part1 = (input: Input) => {
  let res = 0;
  input.forEach(([first, second]) => {
    if (fullyContains(first, second) || fullyContains(second, first)) {
      res++;
    }
  });
  return res;
};

const part2 = (input: Input) => {
  let res = 0;
  input.forEach(([first, second]) => {
    if (overlaps(first, second) || overlaps(second, first)) {
      res++;
    }
  });
  return res;
};

const input = readLines('./day04-input').map((line) =>
  line.split(',').map((range) => range.split('-').map((numStr) => parseInt(numStr)))
) as Input;

run(part1, input); // part1: 540 -- 0.06ms
run(part2, input); // part2: 872 -- 0.06ms
