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
  let bit: number = 0;
  while (bit < input[0].length) {
    if (o2Input.length > 1) {
      const o2Ones: string[] = [];
      const o2Zeroes: string[] = [];
      o2Input.forEach((line) => (line[bit] === '1' ? o2Ones.push(line) : o2Zeroes.push(line)));
      o2Input = o2Ones.length >= o2Zeroes.length ? o2Ones : o2Zeroes;
    }

    if (co2Input.length > 1) {
      const co2Ones: string[] = [];
      const co2Zeroes: string[] = [];
      co2Input.forEach((line) => (line[bit] === '1' ? co2Ones.push(line) : co2Zeroes.push(line)));
      co2Input = co2Zeroes.length <= co2Ones.length ? co2Zeroes : co2Ones;
    }

    bit++;
  }

  return parseInt(o2Input.join(''), 2) * parseInt(co2Input.join(''), 2);
};

const fullInput = readLines('./day03-input') as Input;

run(part1, fullInput); // part1: 2250414 -- 0.1542ms
run(part2, fullInput); // part2: 6085575 -- 0.0721ms
