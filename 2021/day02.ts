import { readLines, run } from '../run';

type Input = Array<['forward' | 'down' | 'up', number]>;

const part1 = (input: Input) => {
  let horizontal = 0;
  let depth = 0;

  input.forEach(([direction, units]) => {
    if (direction === 'forward') horizontal += units;
    else if (direction === 'down') depth += units;
    else depth -= units;
  });

  return horizontal * depth;
};

const part2 = (input: Input) => {
  let horizontal = 0;
  let depth = 0;
  let aim = 0;

  input.forEach(([direction, units]) => {
    if (direction === 'forward') {
      horizontal += units;
      depth += units * aim;
    } else if (direction === 'down') aim += units;
    else aim -= units;
  });

  return horizontal * depth;
};

const fileInput = readLines('./day02-input').map((line) => {
  const [direction, unitsStr] = line.split(' ');
  return [direction, parseInt(unitsStr)];
}) as Input;

run(part1, fileInput); // part1: 2102357 -- 0.0296ms
run(part2, fileInput); // part2: 2101031224 -- 0.0494ms
