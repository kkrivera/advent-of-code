type State = '#' | '.';
interface Point {
  x: number;
  y: number;
  z: number;
}

interface Point4d extends Point {
  w: number;
}

function iter3d<T>(box: T[][][], onCell: (val: T, point: Point) => void) {
  for (let z = 0; z < box.length; z++) {
    for (let y = 0; y < box[z].length; y++) {
      for (let x = 0; x < box[z][y].length; x++) {
        onCell(box[z][y][x], { x, y, z });
      }
    }
  }
}

function about3d(
  center: Point,
  onPoint: (x: number, y: number, z: number) => void,
  range: number = 1
) {
  const { x, y, z } = center;
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      for (let k = -range; k <= range; k++) {
        if (i === 0 && j === 0 && k === 0) continue;
        onPoint(x + i, y + j, z + k);
      }
    }
  }
}

function about4d(
  center: Point4d,
  onPoint: (x: number, y: number, z: number, w: number) => void,
  range: number = 1
) {
  const { x, y, z, w } = center;
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      for (let k = -range; k <= range; k++) {
        for (let l = -range; l <= range; l++) {
          if (i === 0 && j === 0 && k === 0 && l === 0) continue;
          onPoint(x + i, y + j, z + k, w + l);
        }
      }
    }
  }
}

function getActiveNeighbors(center: Point, space: State[][][]): number {
  let active = 0;
  about3d(center, (x, y, z) => space[z]?.[y]?.[x] === '#' && active++);
  return active;
}

function getActiveNeighbors4d(center: Point4d, space: State[][][][]): number {
  let active = 0;
  about4d(center, (x, y, z, w) => space[w]?.[z]?.[y]?.[x] === '#' && active++);
  return active;
}

function cycle(box: State[][][]): State[][][] {
  const zn = box.length;
  const yn = box[0].length;
  const xn = box[0][0].length;
  const out: State[][][] = [];

  for (let z = -1; z < zn + 1; z++) {
    const rows = [];
    out.push(rows);

    for (let y = -1; y < yn + 1; y++) {
      const cells = [];
      rows.push(cells);

      for (let x = -1; x < xn + 1; x++) {
        let state: State = box[z]?.[y]?.[x] || '.';
        const activeNeighbors = getActiveNeighbors({ x, y, z }, box);

        if (state === '.' && activeNeighbors === 3) {
          state = '#';
        } else if (
          state === '#' &&
          (activeNeighbors < 2 || activeNeighbors > 3)
        ) {
          state = '.';
        }

        cells.push(state);
      }
    }
  }

  return out;
}

function cycle4d(boxes: State[][][][]): State[][][][] {
  const wn = boxes.length;
  const zn = boxes[0].length;
  const yn = boxes[0][0].length;
  const xn = boxes[0][0][0].length;

  const out: State[][][][] = [];
  for (let w = -1; w < wn + 1; w++) {
    const box: State[][][] = [];
    out.push(box);
    for (let z = -1; z < zn + 1; z++) {
      const rows: State[][] = [];
      box.push(rows);

      for (let y = -1; y < yn + 1; y++) {
        const cells: State[] = [];
        rows.push(cells);

        for (let x = -1; x < xn + 1; x++) {
          let state: State = boxes[w]?.[z]?.[y]?.[x] || '.';
          const activeNeighbors = getActiveNeighbors4d({ x, y, z, w }, boxes);

          if (state === '.' && activeNeighbors === 3) {
            state = '#';
          } else if (
            state === '#' &&
            (activeNeighbors < 2 || activeNeighbors > 3)
          ) {
            state = '.';
          }

          cells.push(state);
        }
      }
    }
  }

  return out;
}

function part1(input: State[][][]) {
  for (let i = 0; i < 6; i++) {
    input = cycle(input);
  }

  let activeCubes = 0;
  iter3d(input, (state) => (activeCubes += state === '#' ? 1 : 0));

  return activeCubes;
}

function part2(input: State[][][]) {
  let input4d: State[][][][] = [input];

  for (let i = 0; i < 6; i++) {
    input4d = cycle4d(input4d);
  }

//   console.log(JSON.stringify(input4d, null, 2));

  let activeCubes = 0;
  for (let w = 0; w < input4d.length; w++) {
    iter3d(input4d[w], (state) => (activeCubes += state === '#' ? 1 : 0));
  }

  return activeCubes;
}

const providedInput = `##...#.#
#..##..#
..#.####
.#..#...
########
######.#
.####..#
.###.#..`;

const exampleInput1 = `.#.
..#
###`;

const input: State[][][] = [
    providedInput.split('\n').map((line) => line.split('') as State[]),
];

console.log(part1(input));
console.log(part2(input));
