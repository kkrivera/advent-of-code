import { readLines, run } from '../run';

type Input = string[];
type OpenTag = '{' | '(' | '[' | '<';
type CloseTag = '}' | ')' | ']' | '>';
const tagPairs: { [tag in OpenTag]: CloseTag } = {
  '{': '}',
  '(': ')',
  '[': ']',
  '<': '>',
};

const part1 = (input: Input) => {
  const score: { [tag in CloseTag]: number } = { ')': 3, ']': 57, '}': 1197, '>': 25137 };
  return input.reduce((sum, line) => {
    const openingTags: string[] = [];
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (tagPairs.hasOwnProperty(char)) {
        openingTags.push(char);
      } else if (char !== tagPairs[openingTags.pop()]) {
        sum += score[char];
        break;
      }
    }
    return sum;
  }, 0);
};

const part2 = (input: Input) => {
  const score: { [tag in CloseTag]: number } = { ')': 1, ']': 2, '}': 3, '>': 4 };
  const incompleteOpeningTags = input.reduce((acc, line) => {
    const openingTags: OpenTag[] = [];
    let isCorruptedLine = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (tagPairs.hasOwnProperty(char)) {
        openingTags.push(char as OpenTag);
      } else if (char !== tagPairs[openingTags.pop()]) {
        isCorruptedLine = true;
        break;
      }
    }
    if (!isCorruptedLine) acc.push(openingTags);
    return acc;
  }, [] as OpenTag[][]);

  const scores = incompleteOpeningTags.reduce((sums, line) => {
    let lineSum = 0;
    for (let i = line.length - 1; i >= 0; i--) {
      lineSum = lineSum * 5 + score[tagPairs[line[i]]];
    }
    sums.push(lineSum);
    return sums;
  }, [] as number[]);

  return scores.sort((a, b) => b - a)[(scores.length - 1) / 2];
};

const fullInput = readLines('./day10-input');
run(part1, fullInput); // part1: 339537 -- 0.2049ms
run(part2, fullInput); // part2: 2412013412 -- 0.2372ms
