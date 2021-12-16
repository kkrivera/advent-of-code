import { readLines, run } from '../run';

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

  return getComplexSutions(expandedInput);
};

const getComplexSutions = (input: Input) => {
  const end: Coordinate = [input.length - 1, input[0].length - 1];
  const solutions: Solutions = Array.from({ length: input.length }, () =>
    Array.from({ length: input[0].length }, () => Number.MAX_SAFE_INTEGER)
  );
  const [ei, ej] = end;
  solutions[ei][ej] = input[ei][ej];

  let lastSolution = 0;
  let solution = -1;

  while (lastSolution != solution) {
    for (let i = ei; i >= 0; i--) {
      for (let j = ej; j >= 0; j--) {
        const value = getCellValue([i, j], solutions);
        const right: Coordinate = [i, j + 1];
        const up: Coordinate = [i - 1, j];
        const left: Coordinate = [i, j - 1];
        const down: Coordinate = [i + 1, j];

        updateSolution(up, value, solutions, input);
        updateSolution(right, value, solutions, input);
        updateSolution(left, value, solutions, input);
        updateSolution(down, value, solutions, input);
      }
    }
    lastSolution = solution;
    solution = solutions[0][0] - input[0][0];
  }

  return solution;
};

function updateSolution(coordinate: Coordinate, modifier: number, solutions: Solutions, input: Input) {
  if (isValidCell(coordinate, solutions)) {
    const solution = getCellValue(coordinate, solutions);
    const proposal = modifier + getCellValue(coordinate, input);
    if (proposal < solution) {
      const [si, sj] = coordinate;
      solutions[si][sj] = proposal;
    }
  }
}

const getSolution = (input: Input) => {
  const end: Coordinate = [input.length - 1, input[0].length - 1];
  const solutions: Solutions = Array.from({ length: input.length }, () => Array.from({ length: input[0].length }));
  const [ei, ej] = end;
  solutions[ei][ej] = getCellValue(end, input);

  for (let i = ei; i >= 0; i--) {
    for (let j = ej; j >= 0; j--) {
      const value = getCellValue([i, j], input);
      const down: Coordinate = [i + 1, j];
      const right: Coordinate = [i, j + 1];

      let downSolution: Solution;
      if (isValidCell(down, input)) {
        downSolution = value + getCellValue(down, solutions);
      }

      let rightSolution: Solution;
      if (isValidCell(right, input)) {
        rightSolution = value + getCellValue(right, solutions);
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

const isValidCell = <T>([i, j]: Coordinate, input: T[][]) => {
  return i >= 0 && i < input.length && j >= 0 && j < input[i].length;
};

const getCellValue = <T>([i, j]: Coordinate, input: T[][]): T => {
  return input[i][j];
};

const fullInput = readLines('./day15-input');
const processInput = (input: string[]): Input => {
  return input.map((line) => line.split('').map((cell) => parseInt(cell)));
};

run(part1, processInput(fullInput)); // part1: 626 -- 0.8936ms
run(part2, processInput(fullInput)); // part2: 2966 -- 148.1752ms
