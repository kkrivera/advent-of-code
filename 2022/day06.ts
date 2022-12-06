import { readLines, run } from '../run-deno.ts';
const [, __filename] = new URL('', import.meta.url).pathname.match(/(day\d+?).ts/) || [];

type Input = string;

const noRepeats = (input: Input, len: number) => {
  const charCount: Record<string, number> = {};
  const idx = len - 1;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    charCount[char] ??= 0;

    // Increment current char count
    charCount[char]++;

    if (i >= idx) {
      // Check if we have any repeats
      if (!Object.values(charCount).some((count) => count > 1)) return i + 1;

      // Decrement char count of the first coming off of the queue
      charCount[input[i - idx]]--;
    }
  }
};

const part1 = (input: Input) => {
  return noRepeats(input, 4);
};

const part2 = (input: Input) => {
  return noRepeats(input, 14);
};

const [line] = readLines(`./${__filename}-input`);
const input: Input = line;

run(part1, input); // part1: 1544 -- 0.44ms
run(part2, input); // part2: 2145 -- 0.52ms
