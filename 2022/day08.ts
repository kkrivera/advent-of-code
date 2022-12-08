import { readLines, run } from '../run-deno.ts';
const [, __filename] = new URL('', import.meta.url).pathname.match(/(day\d+?).ts/) || [];

type Input = number[][];

const walkDirection = (
  input: Input,
  [startI, startJ]: [number, number],
  [iDiff, jDiff]: [number, number],
  exitCondition: (i: number, j: number) => boolean,
  onComplete?: () => void
) => {
  for (
    let i = startI + iDiff, j = startJ + jDiff;
    i >= 0 && i < input.length && j >= 0 && j < input[i].length;
    i += iDiff, j += jDiff
  ) {
    if (exitCondition(i, j)) return;
  }

  onComplete?.();
};

const isVisibleForDir = (input: Input, [startI, startJ]: [number, number], diff: [number, number]) => {
  const height = input[startI][startJ];

  let isVisible = true;
  walkDirection(input, [startI, startJ], diff, (i, j) => {
    const notTallEnough = height <= input[i][j];
    if (notTallEnough) isVisible = false;
    return notTallEnough;
  });

  return isVisible;
};

const isVisible = (input: Input, pos: [number, number]) => {
  return (
    isVisibleForDir(input, pos, [0, 1]) ||
    isVisibleForDir(input, pos, [0, -1]) ||
    isVisibleForDir(input, pos, [1, 0]) ||
    isVisibleForDir(input, pos, [-1, 0])
  );
};

const countTressInDir = (input: Input, pos: [number, number], diff: [number, number]) => {
  let count = 0;
  const [i, j] = pos;
  const height = input[i][j];
  walkDirection(input, pos, diff, (i, j) => {
    ++count;
    return height <= input[i][j];
  });

  return count;
};

const countTrees = (input: Input, pos: [number, number]) => {
  return [
    countTressInDir(input, pos, [0, 1]),
    countTressInDir(input, pos, [0, -1]),
    countTressInDir(input, pos, [1, 0]),
    countTressInDir(input, pos, [-1, 0]),
  ];
};

const part1 = (input: Input) => {
  let visibleTrees = input.length * 4 - 4;
  for (let i = 1; i < input.length - 1; i++) {
    const row = input[i];
    for (let j = 1; j < row.length - 1; j++) {
      if (isVisible(input, [i, j])) {
        visibleTrees++;
      }
    }
  }

  return visibleTrees;
};

const part2 = (input: Input) => {
  let highestScenicScore = 0;
  for (let i = 1; i < input.length - 1; i++) {
    const row = input[i];
    for (let j = 1; j < row.length - 1; j++) {
      const scenicScore = countTrees(input, [i, j]).reduce((acc, count) => acc * count, 1);
      if (scenicScore > highestScenicScore) highestScenicScore = scenicScore;
    }
  }

  return highestScenicScore;
};

const toTreeGrid = (input: string[]) => {
  return input.reduce((acc, line) => {
    const trees: number[] = line.split('').map((height) => parseInt(height));
    acc.push(trees);
    return acc;
  }, [] as Input);
};

const fullInput = readLines(`./${__filename}-input`);
const input: Input = toTreeGrid(fullInput);

run(part1, input); // part1: 1796 -- 1.18ms
run(part2, input); // part2: 288120 -- 1.4ms
