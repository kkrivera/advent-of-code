import { readLines } from '../run';

type Coordinate = [number, number];
type Row = number[];
type Input = Row[];
type Solution = number;
type Solutions = Solution[][];

const part1 = (input: Input) => {
  return getSolution(input);
};

const part2 = (input: Input) => {
  const iLength = input.length;
  const jLength = input[0].length;
  const expandedInput: Input = Array.from({ length: input.length * 5 }, (a, i) =>
    Array.from({ length: input[0].length * 5 }, (b, j) => {
      const modifier = Math.floor(i / iLength) + Math.floor(j / jLength);
      let value = input[i % iLength][j % jLength] + modifier;
      if (value > 9) value %= 9;
      return value;
    })
  );

  return getSolution(expandedInput);
};

const getSolution = (input: Input) => {
  const end: Coordinate = [input.length - 1, input[0].length - 1];
  const solutions: Solutions = Array.from({ length: input.length }, () => Array.from({ length: input[0].length }));
  const [ei, ej] = end;
  solutions[ei][ej] = getValue(end, input);

  for (let i = ei; i >= 0; i--) {
    for (let j = ej; j >= 0; j--) {
      const value = getValue([i, j], input);
      const down: Coordinate = [i + 1, j];
      const right: Coordinate = [i, j + 1];

      let downSolution: Solution;
      if (isValidCell(down, input)) {
        downSolution = value + getValue(down, solutions);
      }

      let rightSolution: Solution;
      if (isValidCell(right, input)) {
        rightSolution = value + getValue(right, solutions);
      }

      if (!downSolution && !!rightSolution) {
        solutions[i][j] = rightSolution;
      } else if (!rightSolution && !!downSolution) {
        solutions[i][j] = downSolution;
      } else if (!!downSolution && !!rightSolution) {
        solutions[i][j] = downSolution < rightSolution ? downSolution : rightSolution;
      }
    }
  }

  return solutions[0][0] - input[0][0];
};

const isValidCell = ([i, j]: Coordinate, input: Input) => {
  return i >= 0 && i < input.length && j >= 0 && j < input[i].length;
};

const getValue = <T>([i, j]: Coordinate, input: T[][]): T => {
  return input[i][j];
};

const exampleInput = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`.split('\n');

const fullInput = readLines('./day15-input');

const processInput = (input: string[]): Input => {
  return input.map((line) => line.split('').map((cell) => parseInt(cell)));
};

console.log(part1(processInput(fullInput)));
console.log(part2(processInput(fullInput)));
