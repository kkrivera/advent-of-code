import { readLines } from '../run';

type Coordinate = [number, number];
type Row = number[];
type Input = Row[];

const part1 = (input: Input) => {
  const end: Coordinate = [input.length - 1, input[0].length - 1];
  return reverseRecursiveOptimalPath(end, input);
};

const reverseRecursiveOptimalPath = (start: Coordinate, input: Input) => {
  let [si, sj] = start;
  let sum = input[si][sj];
  console.log('==>', [si, sj], getValue(start, input));

  let next: Coordinate = start;
  let [i, j] = next;
  while (i !== 0 || j !== 0) {
    const up: Coordinate = [i - 1, j];
    const left: Coordinate = [i, j - 1];

    if (!isValidCell(up, input)) {
      next = left;
    } else if (!isValidCell(left, input)) {
      next = up;
    } else {
      // Both are valid paths

      const upVal = getValue(up, input);
      const leftVal = getValue(left, input);
      if (upVal < leftVal) {
        next = up;
      } else if (leftVal < upVal) {
        next = left;
      } else {
        // The values are equal. We have to check both
        const leftRecursiveSum = reverseRecursiveOptimalPath(left, input);
        const upRecursiveSum = reverseRecursiveOptimalPath(up, input);

        if (leftRecursiveSum < upRecursiveSum) {
          console.log('-- left --');
          return sum + leftRecursiveSum;
        } else {
          console.log('-- up --');
          return sum + upRecursiveSum;
        }
      }
    }

    sum += getValue(next, input);
    [i, j] = next;
    console.log([i, j], getValue(next, input));
  }

  return sum;
};

const isValidCell = ([i, j]: Coordinate, input: Input) => {
  return i >= 0 && i < input.length && j >= 0 && j < input[i].length;
};

const getValue = ([i, j]: Coordinate, input: Input) => {
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

console.log(part1(processInput(exampleInput)));
