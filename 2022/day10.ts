import { readLines, run } from '../run-deno.ts';
const [, __filename] = new URL('', import.meta.url).pathname.match(/(day\d+?).ts/) || [];

type Instruction = 'addx' | 'noop';
type Operation = { instruction: Instruction; value?: number };
type Input = Operation[];

const performCycles = (operations: Input, onCycle: (cycle: number, registerX: number) => void) => {
  let registerX = 1;
  let cycle = 1;

  let current: Operation | undefined;
  while (operations.length > 0) {
    if (current) {
      const { instruction, value } = current;
      if (instruction === 'addx' && value) registerX += value;
      current = undefined;
    } else {
      const next = operations.shift();
      if (next?.instruction !== 'noop') {
        current = next;
      }
    }

    onCycle(++cycle, registerX);
  }
};

const part1 = (input: Input) => {
  let cycleStrength = 0;

  performCycles(input, (cycle, registerX) => {
    if ((cycle - 20) % 40 === 0) {
      cycleStrength += cycle * registerX;
    }
  });

  return cycleStrength;
};

const part2 = (input: Input) => {
  const pixels: string[][] = [['#']];
  performCycles(input, (cycle, registerX) => {
    const idx = cycle - 1;
    const row = Math.floor(idx / 40);
    const rowPos = idx % 40;
    (pixels[row] ??= []).push(rowPos >= registerX - 1 && rowPos <= registerX + 1 ? '#' : '.');
  });

  pixels.forEach((row) => console.log(row.join('')));
};

const fullInput = readLines(`./${__filename}-input`);
const input: Input = fullInput.map((line) => {
  const [instruction, param] = line.split(' ');
  const ret: Operation = { instruction: instruction as Instruction };
  if (param) ret['value'] = parseInt(param);
  return ret;
});

run(part1, input); // part1: 11820 -- 0.02ms
run(part2, input); /* part2:  0.06ms
####.###....##.###..###..#..#..##..#..#.
#....#..#....#.#..#.#..#.#.#..#..#.#..#.
###..#..#....#.###..#..#.##...#..#.####.
#....###.....#.#..#.###..#.#..####.#..#.
#....#....#..#.#..#.#.#..#.#..#..#.#..#.
####.#.....##..###..#..#.#..#.#..#.#..#.
*/