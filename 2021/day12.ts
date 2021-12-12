import { readLines, run } from '../run';

type Node = string;
type Input = { [node: Node]: Node[] };
type Visitations = { [node: Node]: number };
type ValidCheckFn = (node: Node, visitations: Visitations) => boolean;

const part1 = (input: Input) => {
  const visitations = getStartingVisitations(input);
  return visit('start', visitations, input, isPart1Valid);
};

const part2 = (input: Input) => {
  const visitations = getStartingVisitations(input);
  return visit('start', visitations, input, isPart2Valid);
};

const getStartingVisitations = (input: Input) => {
  return Object.keys(input).reduce((acc, node) => {
    acc[node] = 0;
    return acc;
  }, {} as Visitations);
};

const visit = (node: Node, visitations: Visitations, input: Input, validCheck: ValidCheckFn): number => {
  if (node === 'end') return 1;
  visitations[node]++;

  return input[node].reduce((acc, nextNode) => {
    return acc + (validCheck(nextNode, visitations) ? visit(nextNode, { ...visitations }, input, validCheck) : 0);
  }, 0);
};

const isPart1Valid = (node: Node, visitations: Visitations) => {
  // Capital 65 - 90
  const charCode = node.charCodeAt(0);
  return visitations[node] === 0 || (charCode >= 65 && charCode <= 90) || node === 'end';
};

const isPart2Valid = (node: Node, visitations: Visitations) => {
  // Capital 65 - 90
  const charCode = node.charCodeAt(0);
  return visitations[node] === 0 || (charCode >= 65 && charCode <= 90) || node === 'end' || smallCavesVisitedAtMostOnce(visitations);
};

const smallCavesVisitedAtMostOnce = (visitations: Visitations) => {
  const nodes = Object.keys(visitations);
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const charCode = node.charCodeAt(0);
    // Lowercase 97 - 122
    if (node !== 'start' && node !== 'end' && charCode >= 97 && charCode <= 122 && visitations[node] > 1) {
      return false;
    }
  }

  return true;
};

const fullInput = readLines('./day12-input');

const processInput = (input: string[]) => {
  const out = input.reduce((acc, line) => {
    const [pt1, pt2] = line.split('-');
    if (pt1 !== 'end' && pt2 !== 'start') {
      const set1 = (acc[pt1] ??= new Set());
      set1.add(pt2);
    }

    if (pt1 !== 'start' && pt2 !== 'end') {
      const set2 = (acc[pt2] ??= new Set());
      set2.add(pt1);
    }

    return acc;
  }, {} as { [node: Node]: Set<Node> });

  return Object.entries(out).reduce((acc, [node, set]) => {
    acc[node] = Array.from(set);
    return acc;
  }, {} as Input);
};

run(part1, processInput(fullInput));
run(part2, processInput(fullInput));
