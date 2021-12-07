import { run } from '../run';

type Input = number[];

const part1 = (input: Input) => {};

const exampleInput = `16,1,2,0,4,2,7,1,2,14`;

const processInput = (input: string): Input => {
  return exampleInput.split(',').map((num) => parseInt(num));
};

console.log(part1(processInput(exampleInput)));
