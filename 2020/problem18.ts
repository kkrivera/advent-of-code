import { run } from '../run';

type Operator = '*' | '+';

function performOperation(left: number, operator: Operator, right: number) {
  return operator === '*' ? left * right : left + right;
}

function evaluate(input: string): number {
  let result = 0;
  let operator: Operator = '+';

  for (let i = 0; i < input.length; i++) {
    const char = input.charAt(i);

    if (char === '*' || char === '+') operator = char;
    else if (char === '(') {
      let depth: number = 1;
      for (let j = i + 1; j < input.length; j++) {
        const subChar = input.charAt(j);
        if (subChar === '(') {
          depth++;
        } else if (subChar === ')' && --depth === 0) {
          result = performOperation(result, operator, evaluate(input.slice(i + 1, j)));
          i = j;
          break;
        }
      }
    } else {
      const num = parseInt(char, 10);
      result = performOperation(result, operator, num);
    }
  }

  return result;
}

function evaluatePlusFirst(input: string): number {
  for (let i = 0; i < input.length; i++) {
    const char = input.charAt(i);
    if (char === '(') {
      let depth: number = 1;
      for (let j = i + 1; j < input.length; j++) {
        const subChar = input.charAt(j);
        if (subChar === '(') {
          depth++;
        } else if (subChar === ')' && --depth === 0) {
          input = input.slice(0, i) + evaluatePlusFirst(input.slice(i + 1, j)) + input.slice(j + 1);

          // Rewind to check prior operator
          i -= 2;
          break;
        }
      }
    } else {
      if (char === '+' && input.charAt(i + 1) !== '(') {
        // Retrieve left side character
        let left: string = '';
        let j = i - 1;
        while (input.charCodeAt(j) >= 48 && input.charCodeAt(j) <= 57) {
          left = input.charAt(j--) + left;
        }

        // Retrieve right side character
        let right: string = '';
        j = i + 1;
        while (input.charCodeAt(j) >= 48 && input.charCodeAt(j) <= 57) {
          right = right + input.charAt(j++);
        }

        // Perform addition
        const result = parseInt(left) + parseInt(right);

        // Replace addition strings with resulting value
        input = input.slice(0, i - left.length) + result + input.slice(i + right.length + 1);

        // Rewind to evaluate prior characters
        i--;
      }
    }
  }

  // Multiply all values together
  return input.split('*').reduce((acc, cur) => acc * parseInt(cur), 1);
}

function part1(input: string[]) {
  return input.reduce((acc, cur) => acc + evaluate(cur), 0);
}

function part2(input: string[]) {
  return input.reduce((acc, cur) => {
    return acc + evaluatePlusFirst(cur);
  }, 0);
}

const providedInput = `(3 + 8 * 9 * (4 * 6 + 3 + 4)) * 9 + 9 * 7 * ((9 * 7) + 4)
(9 + (9 * 3 + 2 * 2 + 6 * 2) + 7 + 9) + 5
8 * 7 * (3 + (2 * 5 + 8)) + 6 + 8 + 6
(4 * 6 + 7 + 7 * 4 + 7) * (5 + 6 * 6 * 6 * 8) * 8 * (5 * 4 * 9 + 4 + 3 * 9) * 3
(8 + 8 * 2) * 9 * 5 + (2 + 2 + 3 * 7 * 5 + 6) + 5
(4 * (2 + 4) + 3 + (7 * 5 * 6 * 5 + 2 + 9)) + 8 * ((6 * 6 + 2 + 7 + 2) * (4 * 9 * 7 * 4 * 7)) + 8 * 2 * 4
(5 + 4 + 6) * (6 * 7 + 5 * 9 * 6) * 6 + ((4 + 5 + 3 * 5 + 6) * 6 + 2)
(4 * 7) * 2 * (2 * 9 * 6 + 8)
7 * (3 * 4 * 5 * 8)
(8 * (9 + 5 * 5 + 9 + 5 + 2) * 6) * (4 + 5 * 9 + (7 + 2 + 8) + 5 * 7) + 3
(2 * 4 * (3 * 4 * 5) + 5) * 2 + (6 * 4) + ((4 * 4) * 3 + 2 * 6) + 9 * ((7 * 6 * 8 + 2 + 7 + 9) * 7 + 3 * (8 + 7) * 6)
6 * 3 * (9 * 2 + 8)
2 + (6 * 4) * 7 * 7
2 + (9 + (9 + 7 + 3 * 4 + 6 * 7) * 9) * (7 * (5 * 8 + 8 + 6 + 6) * 7)
(2 + (5 + 5 + 9 * 4) + 3) * 2 + 2 * 6 * 4
5 * 3 * ((8 + 8 + 7 + 3 + 2) + 9)
((9 * 4 + 5 + 7) * 8 * 3 * 6 * (7 + 8 + 8 * 7 * 5)) + 5 + 8 * 9
(5 * 7 * 5 + (8 * 3 * 9 * 3)) * (8 + 7 + 8) + (2 + (3 * 7 + 4 * 8 + 4 * 3) * 3)
7 + 4 * (3 + 9 * 5 + 3 * 3) * (5 * 7 + 5 + 3)
(7 * 9 * 3 + (2 * 7 * 4 * 5 + 8 + 8)) * ((9 + 6 * 3) + 8 + (3 + 4) * 6 * 8 * 6) + 6 * 4
4 * (3 * 4 + 3 + 4 * 4 + 9) + 5 + 8
3 + 7 * (4 * (6 * 9 * 3 * 2 + 5 + 3) + 5) + 4 + 9
5 + 6 * 2 * 5 + (9 + 6)
4 * (4 * 6) + 7 * (3 * 3 + 6) * 8
((8 + 8) + (7 + 4) + 5 * (9 * 2 * 9 * 8) * 5 * (2 + 3 * 3 + 2 * 5)) + 5 * 7 * (4 * 7 + (3 + 3 * 5 * 5 + 5 + 2) + 8 * (2 + 2 + 9 + 6 + 3)) + 2
6 + 8 + (3 * (8 * 2 + 3) + 9 * 6 + (7 + 9 + 3 * 6) + (7 * 3 * 7))
7 + (5 * 7 * 6 * 3) + 5
7 + 5 + (3 + 8 * (6 + 8 * 3))
9 + (9 + 2 * 3 + 8 * 7) + 6 + (4 + 2)
(4 + 8 * 7 * 9 + 7 + (4 + 7 + 2 * 3)) + (2 + 7) * 6 * 6 * 6 + 9
2 + 5 + 8
6 + ((4 * 8) * 9 * 2 + 7)
6 + 9 + 6 + 4 * 5 + (8 * 9 + 9 + 4 + (5 * 3 + 8 * 7 * 4 * 7) + 5)
9 + (8 * 2 * 5 * 5 + 6)
(4 * 3 + (2 + 3 * 6 + 2) * (9 + 8 + 2 + 8 * 6 * 2)) + 9 + 3
((5 * 9) * (7 + 7) * 8 + 6 + 9 * 3) + (2 + 7 + 7 * 9 + 4)
((5 + 5 * 2 + 8 + 2) * (7 + 4 + 5) * (3 + 2 + 5 + 5 + 6) * 2) * 4 * 5 + 9 * 6 * 9
8 + (4 + (5 + 9 * 9) + 7) + ((7 * 3) + 7 * (4 + 7 * 5 + 8 + 7 + 9) * 3 * 5 + 3) + 4 * 3 * 4
((8 * 5 * 7 + 4) + 5) + 2 + (4 + (7 * 9 + 2 * 9 + 5 + 6) + 3 + 8 * (3 + 9 * 8 + 5 + 6 + 2)) * 7
6 * 9 * (3 + 9 + 9) + 7
4 + 4
(2 + (3 * 8 + 6 * 6 * 8) * 3) + ((3 + 6 + 2 * 6 * 6 + 4) * (7 * 4 + 4 * 9) + 3 + 5 * (7 * 3 * 9 * 4 + 3 + 2)) + 3
(2 + (7 * 3 + 4 * 8)) + 5 + 2
(3 + (8 + 9 * 2 + 4) * (9 * 7 * 8)) + (3 * 2) * 7 * 5
5 + 7 + 3 + ((2 * 9 + 8) + 9) * 7 + 7
(4 * 4 * 2 + (2 + 2) * 8 * 2) * 4 + (5 + 6 + 3 * 6 + 2 * 2) * 9 + 6 + 9
9 + 9 + ((8 * 5 * 6) * 3 + 2 * 2 + (2 * 4 + 7 + 6 + 7) * 3)
((6 * 9 + 6 * 3) * (5 * 7) + 2) + (2 + 6 + 6 + (6 * 3 * 3 * 5 * 5) * 4)
2 * 4 + 2 + 3 + 3
9 * 2 + 6 * 6 * 4 + 7
3 * (4 + (6 * 5 * 7 + 7 + 4) + 6 + 8) * 8 * 3 * 6 * 2
5 * (7 + (4 * 3 * 9) * 8 * 6) * 2
3 + 6 + (5 + 4) * 7 * 2
7 + (6 * 6 * 4) * 9 + 9 + 3
9 + ((2 * 5 * 7 * 9 + 2) * (2 + 6 + 7) + 8 * 2 * 9 + 8) * (2 + 2 + 6 * 8 + (8 * 6 + 3 * 6) * 3) * 6 + 8
(5 + 2 + 6) * (7 * 7 * 8)
(6 * 2 + 9) + 9 * (3 + 9 * 5 + 3)
5 + 2 + (6 + (9 + 2 + 5 * 5 * 8 + 5)) + 3 * 2 + (4 + 4 * 2 * 6)
6 + 4 * (8 * 5 + 4 * 2) + 8
9 * 6 * 6 + 2
7 * (6 + 2 + 4 * 5 + 6) * 6 * (6 + (8 + 9 * 9 + 9) * 8) + 8 + (3 + 2)
5 * 2 * (4 + 8) + 8 * 3 + (2 + 8 + 8 * 6 * 9)
3 + 6 * (8 + (2 + 9 + 5 + 2 * 6) + 3 * 9 * 7 + 2) + 3 + 5
(6 + 9 + 5 + 7 * (5 * 5 + 6 * 5) + 3) * 9 + 4
4 * (3 * 9 + (9 + 9 + 6 + 7)) * 8 + (2 * 8 + 2 * (2 * 8) * 4 * (4 + 6)) * (4 * 6 * (9 * 5 + 9 * 3 * 6) * 2) + 7
4 * 3 + (4 + 8 + 4) * 7 * 3 + 9
4 * 8 * 3 * (3 * (9 + 9 * 8 + 3 + 4) + 8 * 6 + 6)
2 + 8 * (5 * 4 + 3 + 9) * 2 * 8
3 * 8 + 4 * 6 + (5 * 8 * 3 * 8)
2 + 7 * (3 + 5 + 2 + 5) * 7 + 9 * 4
2 * 4 + 5 * (6 * 7 + 3 * 8 + 4) + (2 * (4 + 6 + 7 + 5 * 2 * 2) + (6 * 4 * 4 + 3 + 7) + 6 + 8)
3 + ((6 + 9 + 7) * (2 + 3) * 6) * 2 * (3 * 3 + (9 * 2 + 8) * 7) * 4 + 7
8 * (2 + 9) * (6 + (3 * 5 + 7 * 8 + 5 + 9) * 6 * 9) * 6
6 + 9 * 8 * 5 + (8 + 5 + 7 * (6 * 6 * 5) * 5 * 7) + (4 + 6 * 2 * 9 * 5)
2 * 8 + 3 * 4 * (2 * 8 + 7 + (6 + 9 * 7 + 2 * 9)) * 2
5 * (9 + (9 * 6 * 2 + 2) + 6 * 6) + (5 * 4) * 7 * 6
((9 + 8 * 7 * 4 * 2) + 3 + 3 * 5) * 8 + 5 + 9 * 4 * 5
9 + ((9 + 9) + 4 + 4 + 3 + 6 + (3 + 6)) + 6 * 9 + ((6 + 2 + 3) * 4)
6 + ((3 * 5 * 4 + 6) + 6 * 5 + 4 * 9 + (3 + 9 * 2))
3 + 3 + (7 + 8) + 8 * (4 * 9 + 8 * 9 + 9 * 9)
(5 * 9 * 7 * 4) + 6 + 3 * 5
(7 * 8 * 3 + 4 + (8 + 7) * 4) * 2 + 8 + 5 + 4 * 4
9 + (8 * 6 + 2 * (8 * 6 + 4 + 2 * 5 + 2) + 4)
(7 + 5 + (2 + 4 + 6)) + 9 + 5
(4 + 2 * 5 * 6 + 3) * 2 + 2
((7 * 8 * 8 + 8 + 5 * 6) * 6 * 8) * 5 * 4 * (7 + 3 * (8 + 6 + 5 + 8) * 8 + 9) * 3 * 9
3 + 9 * 8 * (7 + 8) + (9 + 6 + 5 + (8 + 4 + 6 * 5 * 9 * 7))
5 + 2 + 6
(9 + 2 * 7 + (9 + 3 + 6 * 7) * (9 + 3 * 4)) + 8 * 6 + ((3 * 6 + 8 * 6) + 4 * 4 * 8) + 6 * 6
3 + 7 * (8 + 7 * (7 * 2 + 6 + 4 + 3 * 9) + 8 * 7) * ((4 + 7) + 8 + 9 + 5) * 3 + ((2 * 8 + 2 * 3) + 3 + 8)
8 + 5 * 9 * (5 + 3 * 4 * 8 * 8) * 7 + (2 + 9 * 4 + 4 + 3 + 8)
6 + (9 + 4) + 4 + ((7 + 8 * 3 * 6) * 2 + 6 + 9 * 6) + ((2 + 2 + 3 + 3 + 5) * 5 + 5 + 8 + 7 + 4)
(4 + 6 + 7 + (7 * 4 + 7 + 2 + 2)) + 4 * ((9 * 9 + 8) + 3 * 3) + 4
5 * (4 + (6 * 9) * 2 + 5 * 8)
(7 * 5 + (6 + 2 * 3 + 3 + 2 + 7) * 6 + 5 + 8) + 3 + 5
(6 + 4 * 8 + 8 * (7 + 4 + 3 + 9 + 3)) * 5 + (3 + 7 + 4 + (2 + 6 + 5 * 2 + 2) + 7) * 8 + 4
8 * ((5 * 9 * 7 * 6) * 5 + 3) * 9 * (6 * 6 * 8 * 2)
((4 * 4) + 2) * 5 + 8
6 * (4 + (8 + 7 + 8 + 6)) + (9 + 5 * 5 * 6 + 9)
((5 + 9 * 6 * 7 + 7 * 3) + 8 + 2 * 8 + 9 * 5) * 2 * 9 * 4 * 6
(7 * 5 * 9 + 4) * 3 + 5
(5 + 5) + 8 * 9 + 2 * 8 + (7 + 4)
8 + (4 * 7 * (7 + 5 * 3 + 7) * 9) * 8
2 * (7 * 8 + (7 + 5 + 9 + 8)) * 9 + 9 + 9
9 + 8 + (2 + 6 * (9 * 2 * 7 * 7) + 5 + 2 * 5) + 4 + 5
(9 + 3 * 4 + 2 * 9) + (7 + 4 + 9)
2 * (5 * 5 * 6 * (5 * 6 + 2 + 9 + 5 * 3)) * ((2 * 5 * 6 + 5 + 8) + 8 * 2 + 7 * 9 * 2) + 7 * 2
9 * 2 + 7 + 3 + ((9 * 9 * 3 + 7 * 2) + 2 * 2 * (5 * 8 * 3 + 2 * 9 + 6) * 3)
4 + (4 * 9 * 2 + 9 + 9 + 2) + 6 * 2 * (7 + 9)
2 + 4 + (5 * 9 * 4 + (2 * 4 * 2) * (5 + 8 + 5 * 8 * 4 + 6) + 2) + 9 + 6
(7 + 9 * 7 + 8 + 3) * 7 * 6 + (2 + 9 * 7 + 5 * 5) + 2 * ((4 + 3 * 5 + 8) + 7 * 3 * 6 * 9 * 6)
(4 * 8 + 8 * 2) + 5 + (5 * 7 + 6 + 2 + 7 + 2) + 3
9 * (5 * (2 + 3 + 4 * 3)) * 5 + 9 + 9 * 9
9 * 5
5 + (9 * 6)
7 + 7
3 * 4 + 3 + (7 + 3 + 4 + 8 * 4)
8 * (5 + 3 + 3 + 2 * (4 + 6)) + (8 + 5 * 9) * 6
5 + (2 + (6 * 2)) + 5 + 8 * 9 * 3
(9 * 4 * 6 * (4 + 8 * 5) * 5 + 6) + 2 * 8 + 6 * (3 * (6 * 2 * 9 * 4 * 2 * 8) + 9 + (8 * 9 + 3 * 4 + 3 + 8) + 4 + 7)
8 * (5 * 8) + (7 + 7 * 5 * 6 * 3 * 4) + (4 * 7) * (3 * 6 + 9 * 4 * 2)
2 + (8 + 7 * 2 * (6 * 4 + 9 + 7 * 8) + 2) + 4 * 4
2 * (7 + 3 + 2 + (9 + 4 + 8 + 9)) * 2
9 * 8 + ((9 * 8) + 8 + 9 * 3 * 6 + 8) + 5 * 6 + (7 + (3 + 5 + 8 + 7) + 2 * (7 * 5 + 5 * 7) * (8 + 3 + 8) * 4)
2 + 5 + 4 * (6 * 2 * (8 + 8 + 7) + 3 * 9 * 9)
(5 * 5) + 4 * 9 + 8 * 8
((4 + 5 * 4 + 2) + (2 * 9)) * (2 + 4 + 3 * 9) * 9 + ((2 + 7) + 9 * (3 + 6 + 2 + 3) * (7 * 8 + 5 * 6) * 9) * 8 * 6
2 * 9 * (8 * 6 + 6) + 4 * (5 * 8 * 6 * 4)
6 * 7 * 2 * 3 + (8 + 8) * 6
(5 * 7) + 3
8 * 2 * (8 + 8)
5 * 7 + (6 + 4 * 3) + 3 + 9
6 * 2 * 6 * 2 + 8 * 4
(2 * 8 + 9 * 6 * (7 + 3 + 4 * 4 + 4 * 9)) + 2 + (6 + 3 * 5 + 4 + 9 + 8) + (3 * 7 + 3 * 2 + 6)
((3 * 8 * 8 * 4 + 6 * 6) * 7) * 6
(2 + 6 * 2 * 8 * (2 + 6 + 5 * 6) * 4) + 9 * 2 + 7
3 + 4 * 4 + 8
((8 * 6 * 8 + 7) * 8 * 7) * 4 + ((5 + 3 * 9 + 2 + 3 * 4) + 2 + 6 + 4 + (4 + 3 + 2)) * 7
((6 * 9 * 4 + 5) * 5) * 7 * 3 * 7
2 * 5 + 8 * ((6 + 5 * 6 * 5 * 3 * 2) * (7 * 7) * (8 * 3 * 3 * 3 * 8) * (6 + 8 * 9 + 9 * 4)) * 5 * 6
6 * ((6 * 7) + 9)
8 + 2 + 5 * 3 * ((4 + 3 + 8) + 7 + 5 * 6 * (2 * 6 * 2)) * 9
(5 * 5 + (2 * 9 + 8) + 8 * 8 * (3 * 6)) * 9 * 3 * 2
(9 * 8 * 7) * 7 + 7 * 4 + 8 * 7
((3 + 8 + 2 * 7) + 3 + 7 * 2) + 4 + 3
6 * 5 + 3 + (4 + 6 * 2 + (2 * 7)) + 2 * 2
7 * (4 * 9 + 3 + 4 * 2 * 5) * 9 + 7 * (9 + 6 * 7 * 8) * 3
((2 + 2) + 8 * 7 + (5 + 6 * 7 * 9 * 3) + 6 + 4) * 9
((6 * 5 * 2 * 4) * 6 * 6 + 2 + 7 + 6) + 2
7 * 4 + 3 * 3 * 9
5 * ((3 + 9 * 2) * 6 * 3 * (5 * 3) * 6 + 6) * 4
(3 * 7 * 9 + 9 * 6) * 5
6 + (8 + 5 * 3 * (7 * 6 + 5 + 4 * 7 + 8))
4 * 2 * 4 * (7 + 8 * (7 * 5 + 3 * 3))
((5 + 9 + 4 * 2) * 2 * (7 * 3 + 7 + 3 * 8 + 6) + 9 + (2 + 6 + 7 * 2 * 9) * 8) + 7 * (4 + 4)
9 + (7 * (8 * 2 + 5 * 8 + 7) * 7 + 6 + 6 * 2) * 2
(2 * 4) + 6 + (8 * 7 + 8 * 2 + (5 * 7 + 9 + 8 * 8))
3 + (3 + 2 * (5 * 4)) * 2 + (4 + 2 + 6 * (4 + 7 + 2)) * 3
(9 * 6 + 9) + (9 * 8 * (4 * 6 + 5 * 6 * 4)) + 3 + 2 * (9 + 3 + 5 + 5 + (4 + 8 + 8 + 2 * 5))
(8 + 7 * 3 + 2 * 5 * 4) * 4 * 9 + (2 + 5)
6 * 5 + 6 * 9 + 2
(3 * 3 + 5 * 6) + 2 * 5 * 3 + 8 * 7
(8 + 9) * 5 * 7
7 + (2 * 8 + (6 + 5 + 2 + 3 * 8 + 3)) * 8 * 3 * 4
(6 + 9 * 2 * 2 + 4 * 7) + 2 * (9 + 9 + 8 + 9 + 7) + (2 + 5 * 6 * 3 + 3 + 3)
3 + 3 + ((2 + 2 + 9 * 8 * 9) + 4 * 8 + 6 + 8 + 6) * 9 * (4 + (8 * 8 + 5 * 9 * 9 * 9) + (3 + 4) + 6 + 9) * 7
9 + (3 + (4 + 6 + 9 * 2 * 7 * 4) * 9) + 9
7 + (4 + 8) * 2 * 9 * 9
6 + (9 * (5 * 4 * 3 * 5) * 4)
3 * 8 + 4 + 2 + 5 * (4 * (8 * 6 + 2 * 5 + 8 * 4))
(4 + 9 * 3) * 2
5 + 3 * ((9 + 6) * 5 * (3 + 8 + 4))
((9 + 5 * 2 + 9) + 7 + 6 + 9 * (3 + 9 + 6)) + 4 + (3 + (9 * 3 + 7 * 9) * 6 + 9 + 9)
(9 + 6 + 6) + 3 + ((6 + 5) * 6 + 9 * 7) * (8 * (5 * 5 * 3 + 8 + 5 * 4) + (7 + 8 + 3 * 2 * 3 * 8) * 8 + 8) * (7 * (8 + 6 + 9 + 8) + 4 + 3 * 6) * 3
6 + 2 + 4 * (5 + 6 * 6) + 6 + 5
(2 * 7 + 5 + (4 * 4 + 8 * 5) * 4) * 6 * (4 + 2 * 2 * 3)
9 + (8 * 8 * 8 * 2) + 8 * 5 + 5 + (3 + 6 + 4 + 6 + 6)
(3 * (2 * 5) * 6 * 9 * 9 * (7 + 5 + 3)) + 6 + (4 + 2 * 9) * (2 * 6 + 7 + 6 + 3) + 4
3 + 7 + 6 * 6 * (4 * (6 * 6)) + 5
(7 + 2) + 4 * 3 * (5 + 9 + 6)
4 * 7 * (6 * 8 * 3 * 6 + 5) + (8 * 8 * 4 + 5) * 4
9 * 3 * 8 + 7
3 + 7 + 3 + (6 * (2 * 2 + 7 * 4)) + 8
5 * 6 * (7 * 9 * (4 + 8) + (5 * 3 + 7 * 4 * 7))
3 + 4 + 2 + ((6 + 5 * 7 * 8) * 9 * 8 * 8)
(5 + 5 * 2) * 6 + 3 * (4 * 5 + 5 * 5 * 2) + 4
(4 + 4 + 9 * 7 * 9) * 3 + (3 * 4) + 5 * 6 + 7
6 * (4 * 5 + 6 * 3 + 3 * 3) * 8 + 2 * 8
3 * (3 * (4 + 3 * 2 * 5) * (2 + 4 * 5 + 8) * 5 + 3 * 8) * 6
6 + (2 * 3 * 7 * 8 + 7) * 4
4 * 9 * (7 + 6 + 5 * 6 * (8 * 9) + 9) + 8 * (9 * 2 + 9) + 6
9 * 5 + 4 * ((3 + 6 * 4 + 4) + 8 + 4 + (7 + 4 * 3 + 7 * 5 + 9))
3 + ((9 * 4 * 6 + 4) * 4 * (7 + 3 + 8 + 7 + 3 * 4)) + 7 * 4 + 5 * 6
(8 + 2) * ((4 + 8 * 8) * 8) * 5
2 + 8 * 8 + (5 * 7 + 3 * 4) * 4 + 4
5 * 5 + 3 * 8 + ((7 + 5) * 3)
(5 + 8) * (4 * 3 * 9 * 8) * 7
(3 + 4 * (5 + 4) + 7) + (7 * 9 * 3) + 2 * 4
2 * 3 * ((6 * 2 + 8 + 2 * 9 + 5) * 3 * (4 + 4 * 3 + 2) + 8 * (7 * 3 * 5 * 9 + 3) * 8)
3 * 4 * (7 * 4 + 5 + 8 * 5) + ((9 * 5 * 5) + 4 + (6 * 6 + 8 * 2 + 9) * 2) + (3 + 4 + 7 * 7 + 9 * 5)
6 * 2 + 8 * 4 * (9 * 4 + (5 * 3 + 8) + 3 + 9) + 2
5 + (9 * 4 + 4) + (5 * 8 * 6 + 7 + 2 + 2) * 3 + (3 * (4 * 4 + 6) + 4)
5 + 8 * (5 * 7 * 8 * 4 + 6)
8 * 3 + 4
6 + 2 + 5 + 4 * (9 + 2 * 9) + 5
5 + 2 + 6 * (4 * (8 + 7 * 6 * 7) + (4 * 4 + 7) + (2 * 3 + 3 * 4 + 6 + 3) * 4 + 4) * 3
((5 * 4 * 2 * 4 + 9) * 4 + 3 + 4 * 7 + 8) * 3 * 6 + 4 * 2
(9 + 7) * 7 * 7 * ((6 * 3 * 4 * 8) + 9) + (7 + 4 * (3 * 3 + 6 * 2 + 7) * 9)
9 * (7 * 4 + 9) * (8 * 2 * 5 * 7 * (8 * 3 + 9 + 3 * 4) + 6) * 2 * 3 + 3
8 + ((3 * 5 + 3) + 5 * 7 * 8 * 8) + 3
((9 + 3 * 5 + 2) * 6) + 9 * (5 * 5) * 6
5 + (5 * (5 * 8) * 9 + 2) * (8 + (7 + 4 + 9 * 6 * 6 + 8)) * (4 + 8 * (6 + 6) + 7) * 3
5 * (2 + (6 + 9 * 4) + 4 * (8 * 2 + 7) * 8 * 2) * 6 * (7 + (6 + 8 * 6 * 8) * 6)
(7 * 7 * 5 + 8 + 2 + 3) * 3
5 + 3 + 3 + (6 + (3 + 7)) * (4 + 6 + 9) * 8
4 + 3 * (9 + (5 * 8 * 8 * 5 + 3) + 4 + 2 + 9)
2 + 7 + 5 * 6 + ((4 * 6 * 9 * 2 + 2 + 5) * (7 + 2 * 4 * 7 + 8) + 8)
(9 + 7 * 8 * (6 * 5 + 7 * 3)) + 4 * 7 + 5 * 9 + 9
((7 * 7 + 7 + 2) + 9 + 5 + (8 + 6 * 3 * 6 + 9) * (6 * 2 + 4 * 7) * 9) + 6
(3 + (3 * 4 * 6 + 4)) * 7
(6 * 2 * (5 + 5 + 4 + 7 + 8)) * 6 + 4 * 4
4 * 8 + (5 + 8) + 3
3 + 8 + 3 * (9 + (5 * 4 * 9) * 5) * (8 + (6 * 7 * 3 + 7 * 6) * 2) * 8
3 + 8 * (2 * 8 * 5 + 2) + 2 * ((8 + 7 * 6 + 5 + 2) * 6 * 3 * 3 * 5) * (7 * (5 + 5 + 3 * 6 * 3) * (5 * 4 + 4 * 9 + 4) + (9 + 9 + 9 * 5) + 7 * 3)
5 + (9 + 5 + 9 + 7 + (3 + 4 + 3 * 8)) * 8
4 * (9 + 4) + 4 + 3 + 6 + 9
((5 * 4 * 8 * 8 + 8 + 7) + 4) + (5 * 8 + 2) * (8 * 7 * 4 + 9 * 4 + (4 * 2 * 7 + 6)) + 3 + 6
5 * (8 + (9 * 9 * 5 * 2 + 8 + 4) * 6 + 6) + (7 * 5 * 7 * (9 * 2 * 8 + 5 * 7) * (5 + 4 + 2 * 8 * 8 * 9) * 4) + 6 + 9
((4 * 4 * 8) + 8) * 7 * 3 + 8 * 7
5 + 4 * 2 + 8 * (7 + 2 + 9 * 2) + 4
5 * (4 + 9 + (3 * 4 * 5) * 9)
4 + 2 + 3 * 3 + 9 * (9 + 4 * 9)
5 * 4 + 3 * 8
(8 + 4 * 6) * (8 * 3 + 4 * 8 * 9 * 2)
(9 + (8 + 4)) * 6
(9 + 5 * 5 * 8 + 7 * (9 * 6 * 6)) + 2 + 4 * 2 * (3 * 8 * (5 * 5 + 5 * 7) + 8 + (3 + 7 * 5 + 4 * 5) + 5) + 9
3 * 9 + 2 * (7 + 8 + (9 * 6 + 4) * (4 + 8 * 9 + 2 + 3) + 3)
(4 + 7) * 3 + 7 * 5
6 * (4 * 5 + (2 + 7 * 8 + 9 + 5) * 7 + 9 * 2) + 8
8 * (8 * 3 * (3 * 3 + 2) + 9) * 5 + (7 * 3 * 2 * 4)
9 + 3 + 4 * (8 + 4 * (2 * 8 * 3) * (5 * 4) * 7 + 5) * 8
8 * 9 + 6 * (3 * (6 * 8 * 6) + 7 + 9 * 5 * 7) * (7 * 3 + 3 * 6 * 8)
8 + (8 * 6 + 7 + 2 * (4 * 6 * 3))
4 + 2 * 7 * ((7 + 6 + 7) * 8 * 6) * (2 * 7 * (2 + 4 + 9 + 2) * (4 + 3 + 6 + 2 + 6) + 6 + 7)
(3 + 9) * 7 + 5 * (3 + 3 * 2 * 6) * 3 * 2
(5 * (8 * 3 + 6 + 5 * 9) * 8 * 6 + 9 * 9) + 8 + 5
8 + ((9 + 3 + 2) * (7 + 9 * 6 * 3) + (4 + 6 * 5 + 8 + 3) * (6 + 9)) + 9 * 7 * 7
2 + 9 * 3 * ((6 + 3 + 3 + 6 * 7 + 9) + 8 + (5 * 5) * (4 * 8 * 5) * 3)
8 + 6 + 4 * 2 * ((5 * 8 + 9 * 2 * 3) * 3 * 9 + 4 * 9 + (3 + 5 * 9)) + 2
7 * ((6 + 8 + 5) + 9) * 4 + 4
9 + 3 * 4 * (6 + (9 * 3 + 7 * 3 + 7 + 3)) * (4 * (4 * 3 + 4))
7 * (5 + 7 * 5) + 2 + ((7 + 6 * 7 * 9) + 5 + 3 + 9 + 6) * (7 + 4) * 2
2 + 4 * 5 + 6 * 3
2 * 9 * ((9 * 5 * 8) + (8 + 3 * 8)) + (7 * 8)
7 * 6 + 5 + (5 * 4) + 9 * 2
4 * 5 + 2 + (4 * 4 * 7) + 4
5 + 5 + 2 * (8 * (3 + 5 + 9 + 4) + 7) * 3
3 + ((2 * 8 + 7 * 3 * 3 * 4) * 3 + 9) + ((6 * 9 * 4) + 4) * 8 * 6
((2 * 5 + 4) * 2 + (3 + 4) * 8) * 7 * 9 + 2 + (9 * 7 * 8 + 5 + 9) + 8
7 * (9 * (5 * 3 * 2) * 7 * 5 + 3 + 7) + 7 * 9 * 3 + 6
((3 * 3) * 7 + 9 * 7) * 6 * 8 + (4 * 3 + (7 + 4 * 2) * (5 * 9 * 6 + 4 + 6 + 4)) * 2
3 * 6 * 2 + ((4 * 9 + 7) + 6) * 3
9 * (3 + 8) * 6 * 3 * 7 * (4 * 3 + 7 * 2 + (8 + 7 * 6 * 2 * 8 + 3) * 3)
((5 * 4 * 5 * 6) * 8 * 8) + 8
((2 * 9 + 2 + 6 * 5) * 4 * 2 * (4 + 4 * 9 + 3 * 2 * 8)) * 4 * 7 * 3 + 4 + 7
6 * 3 + 5 * 4 + 8 + 9
8 * 2 + (7 + (6 + 4) * (6 * 5) * 3 * 7 * 8) * 2 * 9 + 5
6 + (3 * 2 * 9 * 8 * 5) * 2 + 6 + ((6 * 8 * 7 + 5 * 9) + 3 * 3) * 5
(8 + 3) + 3 * (3 * 3 * 7) + 8 * 8 + 3
6 + 2 * (2 + 2 + 9 * 2)
(7 * 2 * 6 * 3 * 4 + (7 + 6 + 6 + 3 + 2 * 7)) * 8
(7 + 2 + 2 + (9 + 8) + 3) + (4 + (5 + 7 * 6 * 2) + 7 + 9 + (2 * 8 * 4 * 3 + 6)) * (6 * (9 * 6 + 4 + 7) + 8) * 6 + 2 * 6
6 + 5
(9 * (6 * 9 * 2 + 3 + 5) + 7 + 2 + 4) + 8 * (6 + 5 * 9)
8 * (5 * 8) + 5
9 * 2 * 9 * 9 + 7
(8 + 9 + (8 + 7 * 4 + 4) + 4 + 2) + 6 * ((9 + 4 * 9 * 3 + 5 + 2) * 8 * 3 * 8 * 3) + 8
5 + (8 * 4 * 5)
(3 * 7 * 4) + 6 * 8 * (5 + 4 + 8 + 5) * (4 + 8 + 9 * 8 + 7 * 7) + (4 * 8 + (5 + 4 + 2 * 2))
9 + 6 * 7 + 2 * (9 * (3 + 2 + 7 * 9) * 3 * 4 * (6 * 6 * 9 + 4)) + 9
7 + (8 * (5 + 7 * 6) * 8 + (2 * 4 + 5 * 4 + 6 * 7) + 3) + 9
5 + 7 * (3 + 8 + 2 * 8 * 5 + 4) * 7 * 8 + 8
9 * 4 * 4
(9 * 3) * ((5 * 7) * 8 * 2 + 4) + 5 + 9 * 3 + 5
((2 * 5) + 2 + (7 * 5 * 9) * 2 + 5) + 7 + (5 + 2 + (8 + 4 * 4 + 6))
((5 + 4 + 9) * 4 * 4 * 6) * 4 * 6 + 5
4 * 8 + 3 * ((8 + 8) * 5 * 7 + 9)
8 * 6 + 5 + (5 * 9 + 5 * 7 * (9 + 8 * 7) * 5)
7 * (3 + 4 * (3 + 6) + 6 + (3 * 8) * 9) + ((8 * 5 + 3 * 8) + 2 + 3) + (9 + 6 * (6 + 8 + 6 * 8 + 8 + 6)) * 2 * 7
8 + ((6 + 6 + 5 + 3 * 3) * 5 * 8 + 9) + 2
((9 + 8 * 8) * 8 + (6 + 2 + 7 + 3 * 3 + 6) + 2) * ((2 + 3 * 7 + 6) + 3 * 7 + 8 + 6 * 6) * 3 * 8 + 9
5 + (8 * (4 * 2) * 2 + 9) * 2 * 6
(4 + 4 * 9) + (6 + 5 * (4 + 2 * 2 * 4 * 8) * 2 + 4)
6 + 7 + 5 + (6 * (2 + 6 * 2 + 5 + 9)) * 6
5 * 3 + 2 + 2 * ((7 + 6 * 8 + 6 * 7 + 5) * 4)
6 * (7 * 8) * (6 + 6 + 2 + 4 + 6 + 6)
((7 + 3 * 7 * 4) + 7 + 9 * 4) + 4 * (2 * 9 * 7 + (3 + 9 * 3)) + 8 * 9
2 * 3 * 2 * 5 + 9 * 6
((3 * 7 * 9 + 4 + 5 + 3) * 8 + (4 + 5 + 8 + 3) + 2 * 2) * 7 * 5
3 + ((8 * 2) + 8 * 4 + 2) * 4 + 9 * 5 + 5
3 + 9 + (6 * 9 * 8) * ((8 * 3 + 9) * 4 + 5 * 7 + 6) + 7
9 + (8 * 4 + 2 * 6 * 4 * 4) * 9
5 + 3 + 5 * 3 + 4 * 3
(5 * 3 * 4) + 7 + 8 + 6 + 5
(6 * (9 * 7 + 5) + 7 * 4) * 2 * 9 + (7 + 5 * 4 + 7 + 3 * 6)
6 * 9 + 2 * 2 + (6 + (6 * 6 + 2 * 4 + 8) + 7 * 5)
((5 * 9 + 3 * 6) + (5 + 2 + 3 * 4) + 3 + 8) * (9 * 2 + 7 * (8 * 5)) * 6 * 2 + 5
(9 + (5 + 7 + 2 * 9) * 4 * 2) * 5 * 5 + 7 + 7 + 9
9 + 7 + 4 + (9 * 7 + 2 * (5 + 4 + 3 * 4))
6 + (3 + 5 * 4 * 8 + (7 + 4 * 3 * 4)) * 7 * 4
9 * ((7 + 6 * 3 * 6) * 7 + (4 * 5 * 3)) + 9 + (7 * 6 + 8 * 5) + 9
4 + 7 * 6 + 6 + (7 + (7 + 8 * 7 + 8 * 4 * 9) + 3 * 9) + 7
(9 + 7 + 2) * 3 + (7 * 8 + 9)
2 + 4 * (2 * 8 + (7 + 5) * 6) + 4 + 4 + (3 + 2)
(5 + (2 * 4 + 9 * 6) * 9 + 3 * 7 * 3) + (5 + (2 * 4 + 7 + 6) * 4 + 3 + 2) * (7 + 9 + (6 * 9 + 6 * 9) + (2 * 2 + 5 + 5) * 4 + 7)
(8 * 6 * 8 * 7 + 7 + 6) + 8 + 9
6 + (3 * 4 + 6) + 9
5 * 2 * 6 + 2 + (4 * 8 * 2 + (4 + 7 + 3 * 8 + 2)) * (4 + 8)
(4 + 2 + 7) + (7 * 2 * 3 * 8)
(9 * 6 * 2 * 9 * 7) * 4 + 4 * 4 + 4 * 8
9 * 3 * (9 + (5 + 3 + 2 + 6)) + (8 * 6 * 4) * 8
8 + (6 + 3 * 6) * 2 * 8
5 * 4 * 3 + (9 * 8 + 6)
(2 + 4 * 8 * 9 * 9 * 2) + 7 + 7 + 3 * 8
(2 * (4 + 7 + 8 * 4) * 4 * 6 * 7 + 4) * 6 + 5 * (6 + 4 * (6 + 9 * 2 + 2) + 2 + 5) * 4 * 5
(9 + 4 * 8 * 8) * 8 * (6 + (8 * 5) * (2 * 7 * 4 + 4 * 6) + 3 + 4 + 9) + 9 * 9 + 4
(7 * 4 + 3) + 4 + 7 * 9 * 7 + (6 * 3)
4 * 2 + 8 + (3 * 2 * (4 * 8) + 3)
6 + 6 * 3 + (9 * 5 * 5 + 4 + 9 * 9) * 3
2 + 8 * (2 + 8 + 2) + (8 * 6 * (3 * 6 * 4 + 8 * 6 * 6) + (3 + 5 + 7 * 8)) * 9 * (4 * 9 * 5 * 6 * 5 * 7)
4 + ((8 + 9 * 5 * 6) + 3 + 9)
(5 + 5 + 5 * 6 * (6 * 5)) * 7 * 2
4 + 6 + (7 * 2 * (9 * 7 * 5 + 5) + 4 * 2) + 9 * 9 * 2
6 + 9 * 8 * 3 + 9 * (3 * (3 * 2 + 2 + 9 + 7) * 2 + 2 + 3 * 8)
8 * 6 * (9 + 7 * (8 * 9 + 7)) + 8 * (3 + 3 + (4 * 2) + 4 * 7 + 4) * 4
9 * 2 + 2 * 4
(6 + (6 + 9 + 3 + 5 + 6)) * 8 + 8 + 3 * 8 * 9
(8 + 2) + 3 * ((2 + 2 * 5 * 2 + 9 + 6) * 6 * 6 + 3 + 3 + (5 + 9 + 7 + 5 + 9)) * 2 * ((4 * 7 + 4) * 6)
(4 + 8 * (9 + 8) + 2 + 4 * 2) + (7 + 5 + 3 + 9 * 4)
8 * 5 + 8 + (7 + 2 + 8 + 7 + 8) * (9 * 7)
7 + (9 * (9 * 4 * 8)) + (8 + 8 * (2 + 6 + 2 + 6) + (7 * 9 * 2 + 3 + 8 + 7)) * ((5 + 4) + 6 + 3) * 2 + 7
6 + ((4 + 2 * 5) + 3 * 7) * 2 + (4 + 9) * 3 + 3
9 * 4 + 7
((5 + 6 + 6 * 3 * 5 * 8) + 8 + 4) * 6 * 5 * 4
6 + ((4 + 7 * 6 * 4) + 8 * 2 + 6)
7 + 4 * 8 * 8 * 3 * (7 * 6 + 6 + (8 * 6 * 9))
((8 * 5 + 7 + 3 + 7) + 3 + 7 * (4 + 2 * 9)) + (7 * 6 + 2 + 5 + 6) + 2 * 6
(9 + 4) + 2 + 8 * (6 + (7 + 8 * 9 + 6 * 8) + 6) + 3
6 + (6 * 7 + 3 * 7 * (2 + 2 * 2 * 2) * 8) * (2 * 6 * 7 + 4 * (9 + 9 * 3 + 4) + 4) * 6
(6 + 9 + 6 + 8 * 5) * 8 * ((4 * 9 + 2 + 7 * 6 + 4) + (7 + 2 * 4 + 5)) * 3
((9 * 8 + 9 + 8 * 2 * 3) + 7 * (4 * 6 + 7 * 3 + 2 * 3) + 9) * 7 * 9
(3 + 6 + 7 + 9) * (2 + (4 * 7 * 6 + 9 + 3 + 5) + 9 + (2 + 3 + 7 + 4 + 3) + 9) + 8
(6 + 8 * 2) + 3 + 7 * 5
7 * (5 + 4 * 5 + 9 + 6 * (3 + 4 + 4 + 8 + 4))
(4 + 7 * 5 + 4 + 6) + (3 + (5 + 4)) * 3 * (2 * 4) + 2 + 6
(6 * 4) + 8 * (4 * (8 + 7 + 3)) + 4
5 + 6 * 8 + 3 + (7 * 5 + 5)
7 + 2 * 5 * ((8 + 4 * 8 + 3 * 5) + (8 + 4) * 6 + 4 + 9 * 4) * 8
(3 * 3 * (7 + 7 * 7 + 7) * 5 * 9 * 9) * 4 * (5 * 2 * 9 + 8 * (4 + 2) * 7) * 9 + 8 * 4
5 * 7 + (7 * (2 * 4))
3 + (9 + (5 * 9)) + 8 * 4
9 * 5 * 3 + 3 + 3 * (9 * 6 * 6 + 2 * 4)
2 + ((2 * 7 + 4 * 4) + 8 * 6 * (9 + 4))
9 + (8 + (7 * 5 * 7 * 5 * 7)) + 2
(4 * 5 * 6 * 3) + 9
6 + (2 * 5 * 9 + 8 + 2) * (2 * 8 * 3 * 2)
3 * (5 * (3 * 5 + 3) + 5 + (2 + 6 * 8 * 2 + 4 + 6) * 2) * 9 * (6 + 6 + 3) * 2
(2 + 5 + 8) + (2 + 8 + 3 * 7 + 4) * 3 + 3 * 9
6 * 6
5 * 9 * ((6 * 5 + 9 + 9) * 6) * 4
5 + 5 * 6 + (3 * 5) + 5
3 + (8 + 8 * (6 + 9 * 4 + 8 * 6) + 6 + 7 * 3) + 2 + 8 * 6 * 7
(3 * 2 + 6 * 3) * 7 * 6 * 9 + 5
2 + ((6 + 4 + 7 + 5 * 3 * 8) * 3 * 5)
(3 * 9 * 5 + 3 + 2) * 4 + 8 + (6 + 3 * 8 * 8) * (7 + 5 + 8) + (8 + 9)
5 * 2 + 2 * 8 * 5 * (2 * 5)`;

const exampleInput1 = `((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`;

const input = providedInput.replace(/ /g, '').split('\n');

run(part1, input);
run(part2, input);

export {};
