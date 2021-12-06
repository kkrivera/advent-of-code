import { readLines, run } from '../run';

type Input = number[];

const part1 = (input: Input, passes: number) => {
  for (let i = 0; i < passes; i++) {
    input.forEach((fish, i) => {
      const nextAge = fish - 1;
      input[i] = nextAge;
      if (nextAge < 0) {
        input[i] = 6;
        input.push(8);
      }
    });
  }
  return input.length;
};

const part2 = (input: Input, passes: number) => {
  // Create efficient structure for keeping count
  const jsonInput: { [age: number]: { cur: number; next: number } } = [...Array(9)].reduce((acc, undf, i) => {
    acc[i] = { cur: 0, next: 0 };
    return acc;
  }, {});

  // Add counts to empty structure
  input.forEach((fish) => jsonInput[fish].cur++);

  for (let i = 0; i < passes; i++) {
    // Perform a pass
    for (let j = 8; j >= 0; j--) {
      const nextAge = j - 1;
      if (nextAge < 0) {
        jsonInput[8].next += jsonInput[0].cur;
        jsonInput[6].next += jsonInput[0].cur;
        jsonInput[0].cur = 0;
      } else {
        jsonInput[nextAge].next += jsonInput[j].cur;
        jsonInput[j].cur = 0;
      }
    }

    // Store next values as cur values and reset next values
    for (let j = 8; j >= 0; j--) {
      jsonInput[j].cur = jsonInput[j].next;
      jsonInput[j].next = 0;
    }
  }

  return Object.values(jsonInput).reduce((acc, fish) => acc + fish.cur, 0);
};

const [fullInput] = readLines('./day06-input');
const processInput = (input: string) => {
  return input.split(',').map((num) => parseInt(num));
};

run(part1, processInput(fullInput), 80); // part1: 345793 -- 40.8331ms
run(part2, processInput(fullInput), 256); // part2: 1572643095893 -- 0.1181ms
