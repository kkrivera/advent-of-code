import { readLines, run } from '../run-deno.ts';

interface Instruction {
  count: number;
  from: number;
  to: number;
}

type Column = string[];

type Input = { columns: Column[]; instructions: Instruction[] };

const getSolution = (columns: Column[]) => columns.reduce((acc, column) => acc + column.slice(-1), '');

const part1 = ({ columns, instructions }: Input) => {
  instructions.forEach(({ count, from, to }) => {
    for (let i = 0; i < count; i++) {
      columns[to - 1].push(columns[from - 1].pop() as string);
    }
  });

  return getSolution(columns);
};

const part2 = ({ columns, instructions }: Input) => {
  instructions.forEach(({ count, from, to }) => {
    columns[to - 1].push(...columns[from - 1].splice(-count));
  });

  return getSolution(columns);
};

const input: Input = readLines('./day05-input').reduce(
  (acc, line) => {
    if (line.startsWith(' 1') || line === '') {
      acc.readColumns = false;
    } else {
      if (acc.readColumns) {
        for (let j = 0; j < line.length; j += 4) {
          const char = line[j + 1];
          char !== ' ' && (acc.columns[j / 4] ??= []).unshift(char);
        }
      } else {
        const [, count, from, to] = (line.match(/move (\d+?) from (\d+?) to (\d+?)/) || []).map((str) => parseInt(str));
        acc.instructions.push({ count, from: from, to });
      }
    }

    return acc;
  },
  { columns: [] as string[][], instructions: [] as Instruction[], readColumns: true }
);

run(part1, input); // part1: ZSQVCCJLL -- 0.08ms
run(part2, input); // part2: QZFJRWHGS -- 0.02ms
