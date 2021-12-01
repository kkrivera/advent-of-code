import { run } from '../run';

function part1(input: string[]) {
  return traverse(input, 3, 1);
}

function part2(input: string[]) {
  const iter = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ];

  return iter.reduce((acc, [x, y]) => acc * traverse(input, x, y), 1);
}

function traverse(input: string[], x: number, y: number) {
  let rowPos = x;
  let trees = 0;
  const [{ length }] = input;
  for (let i = y; i < input.length; i += y) {
    const row = input[i];
    if (row[rowPos] === '#') trees++;
    rowPos = (rowPos + x) % length;
  }
  return trees;
}

const input = `..#......###....#...##..#.#....
.#.#.....#.##.....###...##...##
..#.#..#...........#.#..#......
..#......#..........###........
...#..###..##.#..#.......##..##
......#.#.##...#...#....###....
..........##.....##..##......#.
......#...........#............
#....#..........#..............
.#........##.............###.##
....#.........#.......#.#....##
#.#..#..#..#.......#...#....##.
.#........#......#.##.......#..
..#.....#####.....#....#..#..##
.......#..##.......#......#.###
..#.#...#......#.##...#........
##...................#...##..#.
......#...#.##...##.#......#..#
.#.................#..##...#...
...#.....#.......##.....#.#....
.......#.#......#.....#..#..##.
..........#........#...........
..#.#..........................
.#.##..#.#...#...#.........#...
.....#....#.....#..#.....#.....
...#.#.#.....#.#..#.......#..#.
.....#...###...##...#......##..
#.###......#.#...#.#.#..###....
#.....#..##......#..........#.#
#...............#........#.#..#
.....#..#.........#......##.#..
.....#.##.##..#..##............
...#......##...............#.#.
.#..#.#............##.#........
#.....#..###.............##.#..
...##..#.#..#...........#..#...
#....#.........#.#.............
##.#.........#..###......#.#..#
...#...#......#.#.#.##..#.##...
.....##............#.##.##..#..
....#................#.##..#..#
...#..#.......#...#..#........#
....#...#...#................#.
....##...............#.#...#...
.#.....###...#.......#.##......
....######.#..............###.#
.#..#.........##...............
................##.#..#....###.
.......#............#.#..#..#..
......#.#...............##.#...
...#..####.#...#..#..#......#..
....#.#...#.....#.........#..##
.##..#...#......##....##.#.#...
.##.#.........##...#....#......
..#.#..#...#.#..#.......#...#.#
.........#..#.....##..#........
..#......#..##.....#..#...###..
..#...#....#.#..#..#.#.#..#.#..
...#..#####.....#......#.......
#.#............#......#..#...#.
.........#..........###.......#
......#....#..#.##.#......#..#.
...........##.#....#.#..#......
..#...................#..#.#...
#....##.............##....#...#
##..#....#.........#..........#
....#.#.#...#..#........#.##..#
...............#...#..##..#....
.##.......#.......#...........#
#.........................##...
#........#.#..#..##..####.#....
...................##.....###..
.#.......#..#......#......#...#
..#.........#...#..........#...
..........#......#....#........
.#......#..#...#..#...##....##.
...#.#..#..#......#.....##.####
.......#.#....#.......#........
#...#.#...##..##.#......#......
.#.........#...................
...#..........#.#......#.......
...#.....##....#..........#....
.#..........##..#..#..##....#.#
.##.#..........#...#.##.......#
#...###....#..#.#...#..#.......
..................##...........
..#...##.#...........#....#.##.
..#......#..##..#....##..#...#.
..#....#.....#.##..#.......#..#
#...#....#..#.#....#......##...
.......##..#..........#........
..#.............##.#.....#...#.
...............#....#...#...##.
##...........#.......#.##......
#..#...........#.........#.....
....###.............###.##..##.
.........#.#.....###.......#...
..#.##....#.#..........#....#..
#........#....##...#..#........
......#..........###..#.#......
.....#.#......##.....#..##...#.
.#.......#......#...#...#...#.#
.#..........##.......#.....##.#
###.#...#....#.....#...#......#
..#.#.#..#.##.#..#.............
.....#.........................
.#..###..#...#...#..#..#...#.#.
#................##...##.##....
......#...#...#..........#...#.
..........#.....##.............
..#.#......#........#.......#..
........##.............#.......
.......#......#.##.#..#........
#.#.#....#........#..........#.
##..##......#..#..#.....#.#..##
##..#..........#...............
#.....##...#.#......#.......#.#
#.....#...#....#..#.....##.....
##..........#.#.....#....#...##
..##.###..#.....#.......#...#..
.#.#.......#......###........#.
.#..............#.#..###.......
.#....#..##.........#..#.#.....
....#....#.#....#..#.......##.#
#.......#.......#.........#....
...#....#....#.....##..#..#.#.#
........#....#...........#.....
.#......##.#.#.##..............
#..#.#.....##........#........#
##...#.#.......##.......#...#..
#...#.....#.##...##.#.....#....
....#..##...#........#.#...#...
...#....#.#.#..###...##.#.....#
......#..#.....#..#........##..
.......#.....#.#.........#.#..#
..#.......#.#.#.#.#....#.##...#
.#...#........#..##..#......#..
.#..#............#...#..#.#....
...##......#......#............
..#...#.#.....#.....#..##.#....
.#......#.#......#..#.#........
..#..........##...#.#.....#..#.
#...#.....#..#...#.............
..##.................#....#....
.#....#.......#..##....#......#
.#....###............##....##.#
##..#........#..#...#.......#..
.....#.....#.#.#.##.........#..
.......#..#....#...#...#.......
...#...#...#.#.#..#.#.....#....
#.#........#..#.##..#..###.....
..................#..#.........
#.#.....#..##.........#.......#
###..#.......#..............#..
......#..#.....###..........#..
....#.#...#..#...........#.#...
...#.....#.......#.....#.#.....
#.....##..#......##...........#
#...###...........##..#...#.##.
......##.##.#...#..#....#......
...#.#......##.#......##....#.#
..............#.#.###.......#..
........#....#.......##..#..###
...#.....##.#....#......##..#.#
..##........#.....#.#..#...#...
.#..#.##.........#.....#...#..#
..#..#....#...........#........
.#...#....................#....
##.....##....#.............#.#.
....#.#..#.#..#.#.#..........##
.............##.#.....#..#..#..
.#....#.....##...#.###.........
..#........#........#.#..###...
.##....#...#...#.......#...#.#.
..#...#...#..##........#..#....
..##.#..#..#.....#......#.#..#.
.#........#..#....#..#.........
..#.#.....#.##..#........###.#.
.....#.##.....##.#.............
#.........#.......#...##...#...
..#.##.#..#..#............#....
.##....#..#............#.....#.
###........##.....##.#...#.....
#......##..##.#.#.#.#.#.#..##..
.....###.....#....#......#....#
........#.........##...#....#.#
.#.#.....#.#..#..##......#...#.
...#.##....#..#.###..#..##.....
....#..........##..#..#..#..#..
...#..#.##..#..#....#.........#
.....#..###.#.....#.....#..#...
......#...#....#.##...#.#......
.#.###..##.....##.##......##...
.....#.#...........#.#.........
#........#...#..#......##.#....
..#.......##....##....#.##.#..#
...###.#.........#......#.....#
..#.##..#....#.....##...#.##...
....##.##.............#...#....
##..#...#..#..#..#.............
.....#.....#.....#.............
...#.##.......#..#.#.....#....#
#.....##.........#......##.....
.....##..........#..#...#..#...
#...###....#.......#...##......
.#....#..#......#.....#...#.#..
#........#.#.#...#.....###.#.##
##...#...##..#..#....#.........
....#............#..#.....#....
#......#.........##....#.......
.#..#..#........#.............#
.##..........#......#.......#..
#............#..#....#.........
....#.#.....#.##...#.....#.#...
...#.#..#...##..#...#.#.#......
#....#..#.........##..#.#.#..##
.#...#..............#.......#..
#...#.....#.#........##......##
...#....##.####.#.........#.#.#
....###.#..#............#.#..#.
....#......#...#......##.#.#.#.
.....#..#.#.##.#...##..........
##..#...#.#...###.............#
....#...#..#.....#.#..#..#..#..
#..........####......#.....###.
.........#........#.##.#...#...
.........#..........#.#..###...
.....##........##.........#...#
..##....#...#.......##.........
.....#.#......##....#...#...#..
.##..#..##.....................
.......#...#..#..#...##....#...
.#...#.......###...#..#..#.....
.......#.....##.##.#.......#..#
.##......#...#....#..#......##.
.##....#..#....#...#...#.......
.........##..#..#.#.#.....##...
...#..............#..#.....####
.#.#.#..#.......#.......#......
..#.#......#..........#........
.#...#.#..#.......#..#..#..#...
.......##.#...#..#....#.....#..
.##...##....##...#........####.
....#.#..##....#...#....#.#....
.....#.....#..#..#.#.##..#.....
..#....#..............#....#...
..#.#.#.....##.#.....#..##.....
....#.....#....#...#...#..#.#..
#...#...........#..#..#........
...#.#..#.........##.#...#..##.
......#.#.........#.#...#......
......#..##.###......##.#....#.
.....#...#..#.......#..........
.#...#.......#.....###......#..
...........##.....#..#..#....#.
..#....#..#...#......#.......#.
..#...#...#.#..#....#...#......
.......#....###.####...###.#...
#.##.#.......#.......#....#.#.#
.##..........#.....#..###......
.....#...........#.##..#....#..
........##.....#.#........##...
#..#..#..................##....
#...###..........#.............
.......#.#.......#.#.......##..
.....#.#...#....#...####.....#.
..##.....##.......#....#.......
##..........#...#..##....##....
..........#..#......#........#.
##..#....#..#....#.....##....#.
##.##.....#...##.##.......#....
..#..#.###.#..##.#..#..#...#...
.#..#.....#........#...##.#....
..#..#.....#.#......##.#.#.....
.#..##...#.#....#...#...#.#.##.
.........#...#....###.#.....#..
...........###.#.#..#..#...#.#.
##...#......##...........#..#..
.........##..#...#.......#.....
#......#.#..........#..#.......
...#.................#....#....
#....#......................##.
##.......#..#......#.#...###.#.
..#....#..#.#......#...........
...#...........###.#.#.........
..#..##.....#.....##...##......
..#..#.#.#.#..#..#..##....#...#
#......##.....##..##.##...#....
#.....#.....#.#........#.......
.#.....#.................#....#
.###....#...#............#.#.#.
.#...#.#......#.#..............
....#...#......#.....#.......#.
........#.....#..........#....#
#..#......#...#...#.........#..
#....#......#...##.#...#...#...
#...#....#....#..#..#.....#..#.
#......##..#..#.#.#..#.#.......
..#..#...............#...##...#
............#..............#.##
.#.#.#......##.......#.......#.
....#.........##.......#...###.
.......#.#...#.#.#.......#.....
....#..#..#...#....#.##.#.##...
...##.##.#...#......#..........
#.....#...#.#...#.##..##.#.....
.......#.....#...#.#...##.#....
.#.............#.....#....##..#
##......#.......#...#....#.....
.###......#.................#..
#.#......##.........##..#......
...#....#..........#.#.........
..##..#.........#..............
.....#...#..................#.#
.............#.........#...#..#
....#....#......#.#.......#...#
#..#............#.#.......#...#
..#.....#............#.........
.#.....................###....#
........#.####.........#.#.#...
#...........##...#.........#..#
...........#..#......#...#.#...
....##...##.....#.....#........`.split('\n');

run(part1, input);
run(part2, input);
