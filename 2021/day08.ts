import { readLines, run } from '../run';

type Input = Array<[string[], string[]]>;
const uniqueLengths = new Set([2, 3, 4, 7]);

const part1 = (input: Input) => {
  console.log(input);
  return input.reduce((acc, [, displays]) => {
    return acc + displays.reduce((acc1, display) => acc1 + (uniqueLengths.has(display.length) ? 1 : 0), 0);
  }, 0);
};

const fullInput = readLines('./day08-input')
const exampleInput = readLines(
  `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`,
  { isFileContents: true }
);

const processInput = (input: string[]): Input => {
  return input.map((line) => {
    console.log(line);
    const [signals, displays] = line.split(' | ');
    return [signals.split(' '), displays.split(' ')];
  }) as Input;
};

console.log(part1(processInput(fullInput)));
