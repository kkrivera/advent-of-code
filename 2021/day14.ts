import { readLines, run } from '../run';

type Insertions = { [pair: string]: string };
type Input = {
  template: string[];
  insertions: Insertions;
};
type Counts = { [part: string]: number };
type DPResults = { [depth: number]: { [key: string]: Counts } };

const part1 = (input: Input) => {
  for (let pass = 0; pass < 10; pass++) {
    const { template, insertions } = input;
    const nextTemplate = [];
    for (let i = 0; i < template.length - 1; i++) {
      const first = template[i];
      const second = template[i + 1];
      const pair = `${first}${second}`;
      const insertion = insertions[pair];
      nextTemplate.push(first);
      nextTemplate.push(insertion);
    }
    nextTemplate.push(template[template.length - 1]);
    input.template = nextTemplate;
  }

  const counts = input.template.reduce((acc, part) => {
    acc[part] ??= 0;
    acc[part]++;
    return acc;
  }, {} as Counts);

  return getResult(counts);
};

const part2 = ({ template, insertions }: Input) => {
  // Setup solution space for dynamic programming
  const depth = 40;
  const dpResults = Object.keys(insertions).reduce((acc, key) => {
    key.split('').forEach((part) => {
      acc[depth] ??= {};
      acc[depth][key] ??= {};
      acc[depth][key][part] ??= 0;
      acc[depth][key][part]++;
    });
    return acc;
  }, {} as DPResults);

  // Perform the depth traversals for each key pair
  for (let i = 0; i < template.length - 1; i++) {
    dynamicPass(template[i], template[i + 1], insertions, dpResults);
  }

  // Merge all top level counts together into a single solution map
  const allCounts = dpResults[0];
  const counts: Counts = { ...allCounts[`${template[0]}${template[1]}`] };
  for (let i = 1; i < template.length - 1; i++) {
    const key = `${template[i]}${template[i + 1]}`;
    mergeResults(counts, allCounts[key], template[i]);
  }

  // Return final results
  return getResult(counts);
};

const dynamicPass = (left: string, right: string, insertions: Insertions, results: DPResults, depth: number = 0): Counts => {
  // Exit early if we already have the result at the given depth
  const key = `${left}${right}`;
  const prevResult = results[depth]?.[key];
  if (prevResult) return prevResult;

  // Get insertion key
  const insertion = insertions[key];

  // Find left and right results
  const leftCounts = dynamicPass(left, insertion, insertions, results, depth + 1);
  const rightCounts = dynamicPass(insertion, right, insertions, results, depth + 1);

  // Merge and store results
  const counts: Counts = mergeResults({ ...leftCounts }, rightCounts, insertion);
  results[depth] ??= {};
  results[depth][key] = counts;

  // Return results count
  return counts;
};

const mergeResults = (counts: Counts, mergeCounts: Counts, insertion: string) => {
  Object.entries(mergeCounts).forEach(([part, value]) => {
    counts[part] ??= 0;
    counts[part] += value;

    // Make sure that the insertion key is not counted twice
    if (part == insertion) counts[part]--;
  });

  return counts;
};

const getResult = (counts: Counts) => {
  const sorted = Object.values(counts).sort((countA, countB) => countB - countA);
  return sorted[0] - sorted[sorted.length - 1];
};

const fullInput = readLines('./day14-input');
const processInput = (input: string[]): Input => {
  return input.reduce(
    (acc, line, i) => {
      if (i === 0) {
        acc.template = line.split('');
      } else if (i > 1) {
        const [pair, insertion] = line.split(' -> ');
        acc.insertions[pair] = insertion;
      }

      return acc;
    },
    { template: null, insertions: {} } as Input
  );
};

run(part1, processInput(fullInput)); // part1: 3230 -- 1.6718ms
run(part2, processInput(fullInput)); // part2: 3542388214529 -- 3.6003ms
