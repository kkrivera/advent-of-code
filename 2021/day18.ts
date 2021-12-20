import { isNil, readLines, run } from '../run';
import * as cloneDeep from 'clone-deep';

const BASE_DEPTH = 0;
const EXPLODE_DEPTH = 4;
const SPLIT_NUM = 10;
type Position = 'left' | 'right';
type BaseSnailNumber = [number | BaseSnailNumber, number | BaseSnailNumber];
type SnailNumber = {
  depth: number;
  left: number | SnailNumber;
  right: number | SnailNumber;
  position: Position;
  parent: SnailNumber;
  id: string;
};
type SplitConfig = [SnailNumber, Position];
type Input = SnailNumber[];

const part1 = (input: Input) => {
  let top: SnailNumber;
  for (let i = 0; i < input.length - 1; i++) {
    const left = i == 0 ? input[i] : top;
    const right = input[i + 1];
    const addition: SnailNumber = { depth: BASE_DEPTH, left, right, position: null, parent: null, id: random() };
    left.parent = addition;
    left.position = 'left';
    right.parent = addition;
    right.position = 'right';

    traverse(addition, (snailNumber) => {
      if (typeof snailNumber === 'object') {
        snailNumber.depth++;
      }
    });
    top = addition;

    let hasExploded: boolean = true;
    let hasSplit: boolean = true;
    while (hasExploded || hasSplit) {
      hasExploded = false;
      hasSplit = false;

      let continueExploding = true;
      while (continueExploding) {
        continueExploding = false;
        try {
          traverse(top, (snailNumber) => {
            if (typeof snailNumber === 'object' && snailNumber.depth >= EXPLODE_DEPTH) {
              explode(snailNumber);
              continueExploding = true;
              throw 'explode';
            }
          });
        } catch (e) {
          if (e === 'explode') hasExploded = true;
        }
      }

      let continueSplitting: boolean = true;
      while (continueSplitting) {
        continueSplitting = false;
        try {
          traverse(top, (snailNumber, fromPosition, fromParent) => {
            if (typeof snailNumber === 'number' && snailNumber >= SPLIT_NUM) {
              split([fromParent, fromPosition]);
              continueSplitting = true;
              throw 'split';
            }
          });
        } catch (e) {
          hasSplit = true;
        }
      }
    }
  }

  return calculatSum(top);
};

const part2 = (input: string[]) => {
  let sum = Number.MIN_SAFE_INTEGER;

  for (let i = 0; i < input.length; i++) {
    for (let j = 1; j < input.length; j++) {
      const a = processInput([input[i], input[j]]);
      const b = processInput([input[j], input[i]]);

      const forwardSum = part1(a);
      if (forwardSum > sum) sum = forwardSum;

      const reverseSum = part1(b);
      if (reverseSum > sum) sum = reverseSum;
    }
  }

  return sum;
};

const calculatSum = (num: SnailNumber) => {
  const [left, right] = [num.left, num.right];
  return 3 * (typeof left === 'number' ? left : calculatSum(left)) + 2 * (typeof right === 'number' ? right : calculatSum(right));
};

const traverse = (num: SnailNumber, onFind: (num: number | SnailNumber, fromPosition: Position, parent: SnailNumber) => void) => {
  const [left, right] = [num.left, num.right];

  if (typeof left === 'object') traverse(left, onFind);
  onFind(left, 'left', num);

  if (typeof right === 'object') traverse(right, onFind);
  onFind(right, 'right', num);
};

const split = (config: SplitConfig) => {
  const [parent, position] = config;

  const num = parent[position];
  if (typeof num === 'object') return;

  const splitNum = num / 2;
  const snailNumber: SnailNumber = {
    depth: parent.depth + 1,
    position,
    left: Math.floor(splitNum),
    right: Math.ceil(splitNum),
    parent,
    id: random(),
  };

  parent[position] = snailNumber;

  if (snailNumber.depth >= EXPLODE_DEPTH) {
    explode(snailNumber);
  }
};

const explode = (snailNumber: SnailNumber) => {
  if (typeof snailNumber !== 'object') return [];

  if (typeof snailNumber.left === 'object' || typeof snailNumber.right === 'object') {
    throw 'Bad explosion';
  }

  const resultIds: string[] = [];
  const left = snailNumber.left;
  /**************
   * EXPLODE LEFT
   **************/
  let beforeLeft: SnailNumber = snailNumber;
  let nextLeft: SnailNumber = snailNumber.parent;
  let ascendingLeft = true;
  while (!isNil(nextLeft)) {
    if (ascendingLeft) {
      if (typeof nextLeft.left === 'number') {
        nextLeft.left += left;
        resultIds.push(nextLeft.id);
        break;
      } else if (beforeLeft.id !== nextLeft.left.id) {
        ascendingLeft = false;
        beforeLeft = nextLeft;
        nextLeft = nextLeft.left;
      } else {
        beforeLeft = nextLeft;
        nextLeft = nextLeft.parent;
      }
    } else {
      if (typeof nextLeft.right === 'number') {
        nextLeft.right += left;
        resultIds.push(nextLeft.id);
        break;
      } else {
        beforeLeft = nextLeft;
        nextLeft = nextLeft.right;
      }
    }
  }

  /***************
   * EXPLOED RIGHT
   ***************/
  const right = snailNumber.right;
  let beforeRight: SnailNumber = snailNumber;
  let nextRight: SnailNumber = snailNumber.parent;
  let ascendingRight = true;
  while (!isNil(nextRight)) {
    if (ascendingRight) {
      if (typeof nextRight.right === 'number') {
        nextRight.right += right;
        resultIds.push(nextRight.id);
        break;
      } else if (beforeRight.id !== nextRight.right.id) {
        ascendingRight = false;
        beforeRight = nextRight;
        nextRight = nextRight.right;
      } else {
        beforeRight = nextRight;
        nextRight = nextRight.parent;
      }
    } else {
      if (typeof nextRight.left === 'number') {
        nextRight.left += right;
        resultIds.push(nextRight.id);
        break;
      } else {
        beforeRight = nextRight;
        nextRight = nextRight.left;
      }
    }
  }

  // Finally
  snailNumber.parent[snailNumber.position] = 0;
};

const format = (num: number | SnailNumber, ...wrapId: string[]) => {
  if (typeof num === 'number') return num;

  let disp = `[${format(num.left, ...wrapId)},${format(num.right, ...wrapId)}]`;
  if (wrapId.includes(num.id)) disp = `\x1b[31m${disp}\x1b[0m`;

  return disp;
};

const getTop = (snailNumber: SnailNumber) => {
  let top = snailNumber;
  while (!!top.parent) {
    top = top.parent;
  }

  return top;
};

const random = (length = 8) => {
  return Math.random().toString(16).substr(2, length);
};

const processInput = (input: string[]): Input => {
  return input.map((line) => JSON.parse(line)).map((line: BaseSnailNumber) => toSnailNumber(line));
};

const toSnailNumber = (base: BaseSnailNumber, depth: number = BASE_DEPTH): SnailNumber => {
  const [baseLeft, baseRight] = base;
  const left = typeof baseLeft === 'number' ? baseLeft : toSnailNumber(baseLeft, depth + 1);
  const right = typeof baseRight === 'number' ? baseRight : toSnailNumber(baseRight, depth + 1);

  const snailNumber: SnailNumber = { depth, left, right, position: null, parent: null, id: random() };

  if (typeof left === 'object') {
    left.parent = snailNumber;
    left.position = 'left';
  }
  if (typeof right === 'object') {
    right.parent = snailNumber;
    right.position = 'right';
  }

  return snailNumber;
};

const fullInput = readLines('./day18-input');
run(part1, processInput(fullInput)); // part1: 3524 -- 33.028ms
run(part2, fullInput); // part2: 4656 -- 570.2361ms
