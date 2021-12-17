import { readLines, run } from '../run';

type Input = string[];

const part1 = (input: Input) => {
  let bits = input.reduce((acc, hex) => acc + bin[hex], '');
  return parseBits(bits).vSum;
};

const part2 = (input: Input) => {
  let bits = input.reduce((acc, hex) => acc + bin[hex], '');
  return parseBits(bits).value;
};

const parseBits = (bits: string, depth: number = 0) => {
  //   if (bits.length < 12) return { vSum: 0, length: bits.length };

  const V = parseInt(bits.slice(0, 3), 2);
  const T = parseInt(bits.slice(3, 6), 2);

  let totalVSum = 0;
  let totalLength = 6;
  let totalValue = 0;
  if (T === 4) {
    // Literal
    const { length, value } = getLiteral(bits);
    totalLength += length;
    totalValue += value;
  } else {
    // Operator
    const operator = operators[T];

    const { vSum, length, value } = getOperator(bits, operator, depth);
    totalVSum += vSum;
    totalLength += length;
    totalValue += value;
  }

  return { vSum: V + totalVSum, length: totalLength, value: totalValue };
};

const getLiteral = (bits: string, depth: number = 0) => {
  let totalBin = '';
  const groupSize = 5;
  let groupStart = 6;
  let continueReading = true;
  let size = 0;
  while (continueReading) {
    const group = bits.slice(groupStart, groupStart + groupSize);
    totalBin += group.slice(1);
    continueReading = group[0] === '1';
    groupStart += groupSize;
    size++;
  }

  return { value: parseInt(totalBin, 2), length: groupSize * size };
};

const getOperator = (bits: string, operator: (a: number, b: number) => number, depth: number = 0) => {
  const I = bits[6];
  const lLength = I === '0' ? 15 : 11;
  const endL = 7 + lLength;
  let L = parseInt(bits.slice(7, endL), 2);
  let sum = 0;
  let opLength = 1 + lLength;

  const values: number[] = [];
  if (I === '0') {
    let slicedBits = bits.slice(endL, endL + L);
    while (slicedBits.length) {
      const { vSum, length, value } = parseBits(slicedBits, depth + 1);
      values.push(value);
      opLength += length;
      sum += vSum;
      slicedBits = slicedBits.slice(length);
    }
  } else {
    let packets = L;
    let slicedBits = bits.slice(endL);
    while (packets-- > 0) {
      const { vSum, length, value } = parseBits(slicedBits, depth + 1);
      values.push(value);
      sum += vSum;
      opLength += length;
      slicedBits = slicedBits.slice(length);
    }
  }

  return { length: opLength, vSum: sum, value: operator.apply(null, values) };
};

const sum = (...vals: number[]) => {
  return vals.reduce((acc, val) => acc + val, 0);
};

const product = (...vals: number[]) => {
  return vals.reduce((acc, val) => acc * val, 1);
};

const min = (a: number, b: number = Number.MAX_SAFE_INTEGER) => {
  return Math.min(a, b);
};

const max = (a: number, b: number = Number.MIN_SAFE_INTEGER) => {
  return Math.max(a, b);
};

const greater = (a: number, b: number) => {
  return a > b ? 1 : 0;
};

const less = (a: number, b: number) => {
  return a < b ? 1 : 0;
};

const equal = (a: number, b: number) => {
  return a === b ? 1 : 0;
};

const operators: { [op: number]: (a: number, b: number) => number } = {
  0: sum,
  1: product,
  2: Math.min,
  3: Math.max,
  5: greater,
  6: less,
  7: equal,
};

const bin = {
  '0': '0000',
  '1': '0001',
  '2': '0010',
  '3': '0011',
  '4': '0100',
  '5': '0101',
  '6': '0110',
  '7': '0111',
  '8': '1000',
  '9': '1001',
  A: '1010',
  B: '1011',
  C: '1100',
  D: '1101',
  E: '1110',
  F: '1111',
};

const [fullInput] = readLines('./day16-input');

const processInput = (input: string) => {
  return input.split('');
};

run(part1, processInput(fullInput)); // part1: 984 -- 0.138ms
run(part2, processInput(fullInput)); // part2: 1015320896946 -- 0.0881ms
