import { readLines, run } from '../run';

type Coordinate = [number, number];
type Fold = [string, number];
type Graph = string[][];
type Input = { graph: Graph; folds: Fold[] };
const mark = '#';
const empty = '.';

const part1 = ({ graph, folds }: Input) => {
  const [[fold, line]] = folds;
  fold === 'y' ? performYFold(line, graph) : performXFold(line, graph);
  return graph.reduce((acc, row) => acc + row.reduce((acc1, cell) => acc1 + (cell === mark ? 1 : 0), 0), 0);
};

const part2 = ({ graph, folds }: Input) => {
  folds.forEach(([fold, line]) => (fold === 'y' ? performYFold(line, graph) : performXFold(line, graph)));
};

const performYFold = (yEquals: number, graph: Graph) => {
  const end = yEquals - 1;
  const foldStart = yEquals + 1;
  for (let y = graph.length - 1; y >= foldStart; y--) {
    const mapToY = end - (y - foldStart);
    graph[y].forEach((cell, x) => {
      if (cell === mark) graph[mapToY][x] = mark;
    });
    graph.pop();
  }
  graph.pop();
};

const performXFold = (xEquals: number, graph: Graph) => {
  const end = xEquals - 1;
  const foldStart = xEquals + 1;
  graph.forEach((row, y) => {
    for (let x = row.length - 1; x >= foldStart; x--) {
      const mapToX = end - (x - foldStart);
      if (row[x] === mark) {
        row[mapToX] = mark;
      }
      row.pop();
    }
    row.pop();
  });
};

const fullInput = readLines('./day13-input');

const processInput = (input: string[]): Input => {
  const coordinates: Coordinate[] = [];
  const points: { [x: number]: Set<number> } = {};
  const folds: Fold[] = [];

  let isFolds = false;
  let maxX = 0;
  let maxY = 0;
  input.forEach((line) => {
    if (line === '') {
      isFolds = true;
      return;
    }

    if (!isFolds) {
      const [x, y] = line.split(',').map((coord) => parseInt(coord)) as Coordinate;
      coordinates.push([x, y]);

      (points[x] ??= new Set<number>()).add(y);

      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    } else {
      const [axis, numStr] = line.replace('fold along ', '').split('=');
      folds.push([axis, parseInt(numStr)]);
    }
  });

  const graph: Graph = [];
  for (let y = 0; y <= maxY; y++) {
    graph.push(Array.from({ length: maxX + 1 }, (v, x) => (points[x]?.has(y) ? mark : empty)));
  }

  return { graph, folds };
};

run(part1, processInput(fullInput)); // part1: 701 -- 3.272ms
run(part2, processInput(fullInput)); // part2: undefined -- 2.4241ms
