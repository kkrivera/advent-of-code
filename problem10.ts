import { run } from './run';

function isWithinRange(num: number) {
  return num <= 3 && num >= 1;
}

function part1(input: number[]) {
  const sortedInput = input.sort((a, b) => a - b);

  let prev = 0;
  let oneDiffs = 0;
  let threeDiffs = 0;
  for (let i = 0; i < sortedInput.length; i++) {
    const num = sortedInput[i];
    const diff = num - prev;
    if (isWithinRange(diff)) {
      prev = num;
      if (diff === 1) oneDiffs++;
      else if (diff === 3) threeDiffs++;
    } else {
      break;
    }
  }

  return oneDiffs * (threeDiffs + 1);
}

function traverse(input: number[], startIdx: number, from: number): number {
  // Break recursion
  if (startIdx >= input.length) {
    return 1;
  }

  let validPaths = 0;

  const idx1 = startIdx;
  const idx2 = startIdx + 1;
  const idx3 = startIdx + 2;
  if (isWithinRange(input[idx1] - from)) validPaths += traverse(input, idx1 + 1, input[idx1]);
  if (isWithinRange(input[idx2] - from)) validPaths += traverse(input, idx2 + 1, input[idx2]);
  if (isWithinRange(input[idx3] - from)) validPaths += traverse(input, idx3 + 1, input[idx3]);

  return validPaths;
}

function getValidPaths(set: Set<number>, value: number) {
  let validPaths = 0;
  if (set.has(value + 1)) validPaths++;
  if (set.has(value + 2)) validPaths++;
  if (set.has(value + 3)) validPaths++;

  return validPaths;
}

function rangeFinder(input: number[]): Array<{ start: number; end: number }> {
  const set = new Set(input);
  const ranges = [];

  for (let i = 0; i < input.length; i++) {
    const value = input[i];
    const validPaths = getValidPaths(set, value);

    if (validPaths > 1) {
      const start = i;
      let max = i + validPaths;
      let end;
      for (let j = i + 1; j < max; j++) {
        const subValidPaths = getValidPaths(set, input[j]);
        if (j === max - 1 && subValidPaths === 1) {
          end = j + 1;
          break;
        }

        max += subValidPaths - 2;
      }

      ranges.push({ start, end });
      i = end - 1;
    }
  }

  return ranges;
}

function part2(input: number[]) {
  const sortedInput = input.sort((a, b) => a - b);
  const ranges = rangeFinder(sortedInput);
  return ranges.reduce((acc, { start, end }) => {
    const from = start === 0 ? 0 : sortedInput[start - 1];
    const result = traverse(sortedInput.slice(start, end + 1), 0, from);
    return acc * result;
  }, 1);
}

function part2Paths(input: number[]) {
  const sortedInput = input.sort((a, b) => a - b);
  const set = new Set(input);

  const pathCounts = [0];
  const lookBackIter = [1, 2, 3];

  let sum = 0;
  for (let i = 1; i <= sortedInput[sortedInput.length - 1] + 1; i++) {
    if (set.has(i)) {
      if (i < 4) {
        sum = pathCounts.reduce((acc, cur) => acc + cur, 0);
        pathCounts.push(1 + sum);
      } else {
        sum = lookBackIter.reduce((acc, j) => acc + pathCounts[i - j], 0);
        pathCounts.push(sum);
      }
    } else {
      pathCounts.push(0);
    }
  }

  return sum;
}

const providedInput = `26
97
31
7
2
10
46
38
112
54
30
93
18
111
29
75
139
23
132
85
78
99
8
113
87
57
133
41
104
98
58
90
13
91
20
68
103
127
105
114
138
126
67
32
145
115
16
141
1
73
45
119
51
40
35
150
118
53
80
79
65
135
74
47
128
64
17
4
84
83
147
142
146
9
125
94
140
131
134
92
66
122
19
86
50
52
108
100
71
61
44
39
3
72`;

const input = providedInput.split('\n').map((intStr) => parseInt(intStr));

run(part1, input);
run(part2Paths, input);
