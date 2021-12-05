import { readLines, run } from '../run';

type MarkedCoordinates = { [x: number]: { [y: number]: number } };
type Point = [number, number];
type Line = [Point, Point];
type Input = Line[];

const part1 = (input: Input) => {
  const markedCoordinates: MarkedCoordinates = {};
  input.forEach((line) => {
    const [[x1, y1], [x2, y2]] = line;
    const isStraight = x1 === x2 || y1 === y2;
    if (isStraight) traverseAndMarkCoordinates(line, markedCoordinates);
  });
  return countOverlaps(markedCoordinates);
};

const part2 = (input: Input) => {
  const markedCoordinates: MarkedCoordinates = {};
  input.forEach((line) => {
    const [[x1, y1], [x2, y2]] = line;
    const isStraight = x1 === x2 || y1 === y2;
    const isDiagnol = Math.abs(x2 - x1) === Math.abs(y2 - y1);
    if (isStraight || isDiagnol) traverseAndMarkCoordinates(line, markedCoordinates);
  });

  return countOverlaps(markedCoordinates);
};

const traverseAndMarkCoordinates = ([[x1, y1], [x2, y2]]: Line, markedCoordinates: MarkedCoordinates) => {
  const [xStep, yStep] = [x2 - x1, y2 - y1].map((diff) => (diff === 0 ? 0 : diff / Math.abs(diff)));

  let [x, y] = [x1, y1];
  while (x !== x2 + xStep || y !== y2 + yStep) {
    const yMarkedCoordinates = (markedCoordinates[x] ??= {});
    yMarkedCoordinates[y] ??= 0;
    yMarkedCoordinates[y]++;
    (x += xStep), (y += yStep);
  }
};

const countOverlaps = (markedCoordinates: MarkedCoordinates): number => {
  return Object.values(markedCoordinates).reduce((acc, yCounts) => {
    const yCount = Object.values(yCounts).reduce((acc1, count) => acc1 + (count > 1 ? 1 : 0), 0);
    return acc + yCount;
  }, 0);
};

const processInput = (input: string[]): Input => {
  return input.map((line) => {
    const coords = line.split(' -> ');
    return coords.map((coord) => {
      const [x, y] = coord.split(',');
      return [parseInt(x), parseInt(y)] as Point;
    }) as Line;
  });
};

const processedInput = processInput(readLines('./day05-input'));

run(part1, processedInput); // part1: 5145 -- 8.5563m
run(part2, processedInput); // part2: 16518 -- 13.9256ms
