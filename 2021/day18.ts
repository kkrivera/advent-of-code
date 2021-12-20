import { readLines, log, isNil } from '../run';

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

    console.log('\n++++ ADDITION +++++');
    display(addition);

    traverse(addition, (snailNumber) => {
      if (typeof snailNumber === 'object') {
        snailNumber.depth++;
      }
    });

    let leftMostActionPerformed = true;
    while (leftMostActionPerformed) {
      leftMostActionPerformed = false;
      try {
        traverse(addition, (snailNumber, fromPosition, fromParent) => {
          if (typeof snailNumber === 'object') {
            if (snailNumber.depth >= EXPLODE_DEPTH) {
              explode(snailNumber);
              throw 'explode';
            }
          } else if (snailNumber >= SPLIT_NUM) {
            split([fromParent, fromPosition]);
            throw 'split';
          }
        });
      } catch (e) {
        leftMostActionPerformed = true;
      }
    }

    top = addition;
  }

  console.log('');
  //   log(top);
  display(top);
};

const traverse = (num: SnailNumber, onFind: (num: number | SnailNumber, fromPosition: Position, parent: SnailNumber) => void) => {
  const [left, right] = [num.left, num.right];

  if (typeof left === 'object') traverse(left, onFind);
  onFind(left, 'left', num);

  if (typeof right === 'object') traverse(right, onFind);
  onFind(right, 'right', num);
};

const display = (num: number | SnailNumber) => {
  console.log(format(num));
};

const split = (config: SplitConfig) => {
  const [parent, position] = config;

  const num = parent[position];
  if (typeof num === 'object') return;

  console.log(`\n^^^^^ SPLIT ${num} ^^^^^`);
  const splitNum = num / 2;
  const snailNumber: SnailNumber = {
    depth: parent.depth + 1,
    position,
    left: Math.floor(splitNum),
    right: Math.ceil(splitNum),
    parent,
    id: random(),
  };

  console.log('---', format(parent), '-->', format(snailNumber));
  console.log('+++', format(getTop(parent)));
  parent[position] = snailNumber;
  console.log('==>', format(getTop(snailNumber)));
};

const explode = (snailNumber: SnailNumber) => {
  if (typeof snailNumber !== 'object') return [];
  console.log(`\n==== EXPLODE ${format(snailNumber)} ====`);
  console.log('+++', format(getTop(snailNumber)));

  if (typeof snailNumber.left === 'object' || typeof snailNumber.right === 'object') {
    throw 'Bad explosion';
  }

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
        break;
      } else {
        beforeRight = nextRight;
        nextRight = nextRight.left;
      }
    }
  }

  // Finally
  snailNumber.parent[snailNumber.position] = 0;
  console.log('==>', format(getTop(snailNumber)));
};

const format = (num: number | SnailNumber) => {
  if (typeof num === 'number') return num;
  return `[${format(num.left)},${format(num.right)}]`;
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

// [[[[1,1], [2,2]], [3,3]], [4,4]]
const exampleInput1 = `[1,1]
[2,2]
[3,3]
[4,4]`.split('\n');

// [[[[3,0], [5,3]], [4,4]], [5,5]]
const exampleInput2 = `[1,1]
[2,2]
[3,3]
[4,4]
[5,5]`.split('\n');

// [[[[5,0],[7,4]],[5,5]],[6,6]]
const exampleInput3 = `[1,1]
[2,2]
[3,3]
[4,4]
[5,5]
[6,6]`.split('\n');

// [[[[0,7],4],[[7,8],[6,0]]],[8,1]]
const myExample = `[[[[4,3],4],4],[7,[[8,4],9]]]
[1,1]`.split('\n');

// [[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]
const exampleInput4 = `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]`.split('\n');

// [[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]
const p1 = `[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]`.split('\n');

// [[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]
const p2 = `[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]`.split('\n');

console.log(part1(processInput(p1)));
