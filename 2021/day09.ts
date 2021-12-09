import { run, readLines } from '../run';

type Cell = { value: number; visited: boolean };
type Line = Cell[];
type Input = Line[];
type Coordinate = [number, number];

const part1 = (input: Input) => {
  return input.reduce((sum, row, i) => {
    return sum + row.reduce((subSum, { value }, j) => subSum + (isLowestDepth(value, [i, j], input) ? value + 1 : 0), 0);
  }, 0);
};

const part2 = (input: Input) => {
  const basinSizes = [];
  input.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (isLowestDepth(cell.value, [i, j], input)) {
        basinSizes.push(getBasinSize([i, j], input) + 1);
      }
    });
  });

  return basinSizes
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((acc, cur) => acc * cur, 1);
};

const isLowestDepth = (compare: number, [i, j]: Coordinate, input: Input) => {
  const toCheck: Array<[number, number]> = [
    [i - 1, j],
    [i + 1, j],
    [i, j - 1],
    [i, j + 1],
  ];

  for (let k = 0; k < toCheck.length; k++) {
    const [a, b] = toCheck[k];
    if (isInBounds(a, b, input) && compare >= input[a][b].value) {
      return false;
    }
  }

  return true;
};

const getBasinSize = ([i, j]: Coordinate, input: Input) => {
  input[i][j].visited = true;

  const toCheck: Array<[number, number]> = [
    [i - 1, j],
    [i + 1, j],
    [i, j - 1],
    [i, j + 1],
  ];

  return toCheck.reduce((acc, [a, b]) => {
    if (!isInBounds(a, b, input)) return acc;
    const { visited, value } = input[a][b];

    // Perform recursive call
    if (!visited && value !== 9) acc += getBasinSize([a, b], input) + 1;

    return acc;
  }, 0);
};

const isInBounds = (i: number, j: number, input: Input) => {
  return i >= 0 && i < input.length && j >= 0 && j < input[i].length;
};

const fullInput = readLines('./day09-input');

const processInput = (input: string[]): Input => {
  return input.map((line) => line.split('').map((cell) => ({ value: parseInt(cell), visited: false })));
};

run(part1, processInput(fullInput)); // part1: 468 -- 0.4839ms
run(part2, processInput(fullInput)); // part2: 1280496 -- 0.9778ms
