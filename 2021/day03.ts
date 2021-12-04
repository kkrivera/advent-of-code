import { readLines, run } from '../run';

type Input = Array<'0' | '1'>;

const part1 = (input: Input) => {
  const gamma: string[] = [];
  const epsilon: string[] = [];
  const threshold = input.length / 2;
  for (let i = 0; i < input[0].length; i++) {
    const ones = input.reduce((acc, line) => acc + (line[i] === '1' ? 1 : 0), 0);
    const isGammaOne = ones > threshold;
    gamma.push(isGammaOne ? '1' : '0');
    epsilon.push(isGammaOne ? '0' : '1');
  }

  return parseInt(gamma.join(''), 2) * parseInt(epsilon.join(''), 2);
};

const part2 = (input: Input) => {
  let o2Input: string[] = input;
  let co2Input: string[] = input;
  for (let i = 0; i < input[0].length; i++) {
    if (o2Input.length > 1) o2Input = part2Helper(o2Input, i);
    if (co2Input.length > 1) co2Input = part2Helper(co2Input, i, true);
  }
  return parseInt(o2Input.join(''), 2) * parseInt(co2Input.join(''), 2);
};

const part2Helper = (input: string[], idx: number, invert: boolean = false) => {
  const ones: string[] = [];
  const zeroes: string[] = [];
  input.forEach((line) => (line[idx] === '1' ? ones.push(line) : zeroes.push(line)));
  return zeroes.length > ones.length ? (invert ? ones : zeroes) : invert ? zeroes : ones;
};

const fullInput = readLines('./day03-input') as Input;

run(part1, fullInput); // part1: 2250414 -- 0.1542ms
run(part2, fullInput); // part2: 6085575 -- 0.0721ms
