import { run, readLines } from '../run';

type Input = number[][];
type Coordinate = [number, number];

const part1 = (input: Input) => {
  let totalFlashes = 0;
  for (let i = 0; i < 100; i++) {
    // Increase the energy levels and see what is initially flashing
    const initialFlashes = increaseEnergy(input);

    // Perform flash
    totalFlashes += initialFlashes.reduce((flashes, flashPoint) => flashes + flash(flashPoint, input), 0);
  }

  return totalFlashes;
};

const part2 = (input: Input) => {
  let i = 1;
  while (true) {
    const numFlashes = increaseEnergy(input).reduce((flashes, flashPoint) => flashes + flash(flashPoint, input), 0);
    if (numFlashes === 100) break;
    i++;
  }

  return i;
};

const increaseEnergy = (input: Input): Coordinate[] => {
  return input.reduce((toFlash, row, i) => {
    row.forEach((cell, j) => {
      input[i][j]++;
      if (input[i][j] > 9) {
        toFlash.push([i, j]);
        input[i][j] = 0;
      }
    });
    return toFlash;
  }, [] as Coordinate[]);
};

const flash = (coordinate: Coordinate, input: Input) => {
  const [i, j] = coordinate;
  input[i][j] = 0;
  let numFlashes = 1;

  getValidNeighbors(coordinate, input).forEach(([a, b]) => {
    if (input[a][b] !== 0) {
      input[a][b]++;
    }

    if (input[a][b] > 9) {
      numFlashes += flash([a, b], input);
    }
  });

  return numFlashes;
};

const getValidNeighbors = ([i, j]: Coordinate, input: Input): Coordinate[] => {
  const neighbors: Coordinate[] = [
    [i + 1, j + 1], // bottom right
    [i, j + 1], // right
    [i - 1, j + 1], // top right
    [i + 1, j - 1], // bottom left
    [i, j - 1], // left
    [i - 1, j - 1], // top left
    [i + 1, j], // bottom
    [i - 1, j], // top
  ];

  return neighbors.filter((coordinate) => isValidCoordinate(coordinate, input));
};

const isValidCoordinate = ([i, j]: Coordinate, input: Input) => {
  return i >= 0 && i < input.length && j >= 0 && j < input[i].length;
};

const fullInput = readLines('./day11-input');
const processInput = (input: string[]): Input => {
  return input.map((line) => line.split('').map((cell) => parseInt(cell)));
};

run(part1, processInput(fullInput)); // part1: 1686 -- 0.3997ms
run(part2, processInput(fullInput)); // part2: 360 -- 0.9437ms
