import { readLines, run } from '../run-deno.ts';

type Input = string[];

const toScore = (char: string): number => {
  const charCode = char.charCodeAt(0);

  if (charCode >= 65 && charCode <= 90) {
    // A-Z
    return charCode - 65 + 27;
  } else {
    // a-z
    return charCode - 97 + 1;
  }
};

const part1 = (input: Input) => {
  return input.reduce((acc, line) => {
    const half = line.length / 2;
    const first = line.substring(0, half);
    const second = line.substring(half);

    const set = new Set(first);
    for (const char of second) {
      if (set.has(char)) {
        acc += toScore(char);
        break;
      }
    }
    return acc;
  }, 0);
};

const part2 = (input: Input) => {
  let sum = 0;
  for (let i = 0; i < input.length; i += 3) {
    // First iteration
    const initial = new Set(input[i]);

    // Second iteration
    const found = new Set();
    for (const char of input[i + 1]) {
      if (initial.has(char)) found.add(char);
    }

    // Final iteration
    for (const char of input[i + 2]) {
      if (found.has(char)) {
        sum += toScore(char);
        break;
      }
    }
  }
  return sum;
};

const fullInput = readLines('./day03-input');
run(part1, fullInput);
run(part2, fullInput);
