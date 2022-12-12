import { readLines, run } from '../run-deno.ts';
const [, __filename] = new URL('', import.meta.url).pathname.match(/(day\d+?).ts/) || [];

type Items = number[];
type Operation = (old: number) => number;
type Test = (next: number) => number;
interface Monkey {
  items: Items;
  operation: { exec: Operation; op: string; operator: string };
  throwTo: { exec: Test; divisor: number };
  inspected: number;
}
type Input = Monkey[];

const part1 = (input: Input) => {
  for (let round = 0; round < 20; round++) {
    input.forEach((monkey, i) => {
      const { items, operation, throwTo } = monkey;
      monkey.inspected += items.length;
      while (items.length > 0) {
        const worry = items.shift() || 0;
        const nextWorry = Math.floor(operation.exec(worry) / 3);
        const to = throwTo.exec(nextWorry);
        input[to].items.push(nextWorry);
      }
    });
  }

  const [first, second] = input.map(({ inspected }) => inspected).sort((a, b) => b - a);
  return first * second;
};

const part2 = (input: Input) => {
  for (let round = 0; round < 5; round++) {
    console.log(`Round ${round + 1}`);
    input.forEach((monkey, i) => {
      const { items, operation, throwTo } = monkey;
      monkey.inspected += items.length;
      while (items.length > 0) {
        const worry = items.shift() || 0;
        const processedWorry = operation.exec(worry);
        const to = throwTo.exec(processedWorry);
        
        // We want to look at the upcoming divisor, modulo the current worry, and perform 
        const nextWorry = operation.operator === '*' ? operation.exec(worry % input[to].throwTo.divisor) : processedWorry

        input[to].items.push(nextWorry);

        console.log(
          `${processedWorry % throwTo.divisor === 0 ? '*' : '|'} Monkey ${i}: ${worry} ${operation.op} = ${processedWorry} % ${throwTo.divisor} = ${
            processedWorry % throwTo.divisor
          } -> [${to}]`
        );
      }
    });

    console.log('==============');
    input.forEach(({ inspected }, i) => {
      console.log(`Monkey ${i}: ${inspected}`);
    });
  }

  const [first, second] = input.map(({ inspected }) => inspected).sort((a, b) => b - a);
  return first * second;
};

const exampleInput = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`.split('\n');

// const fullInput = readLines(`./${__filename}-input`);
const input: Input = [];
const lines: string[] = exampleInput;
for (let i = 1; i < lines.length; i += 7) {
  let items: Items = [];
  let operation: Operation = () => -1;
  let throwTo: Test = () => 0;
  let divisor = 0;
  let op = '';
  let _operator = '';
  for (let j = i; j < i + 3; j++) {
    const relIdx = j - i;
    const line = lines[j].trim();
    if (relIdx === 0) {
      items = line
        .replace('Starting items: ', '')
        .split(', ')
        .map((num) => parseInt(num));
    } else if (relIdx === 1) {
      const [, operator, right] = line.replace('Operation: new = ', '').split(' ');
      op = `${operator} ${right}`;
      _operator = operator;
      const rightNum = parseInt(right);
      operation = (old: number) => {
        const operand = Number.isNaN(rightNum) ? old : rightNum;
        return operator === '*' ? old * operand : old + operand;
      };
    } else if (relIdx === 2) {
      divisor = parseInt(line.replace('Test: divisible by ', ''));
      const trueIdx = parseInt(lines[j + 1].replace('If true: throw to monkey ', ''));
      const falseIdx = parseInt(lines[j + 2].replace('If false: throw to monkey ', ''));
      throwTo = (next: number) => (next % divisor === 0 ? trueIdx : falseIdx);
    }
  }
  input.push({ items, operation: { exec: operation, op, operator: _operator }, throwTo: { exec: throwTo, divisor }, inspected: 0 });
}

console.log(part2(input));

// run(part1, input); // part1: 11820 -- 0.02ms
// run(part2, input); /* part2:  0.06ms
