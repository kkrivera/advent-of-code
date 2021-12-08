import { readLines, run } from '../run';
import { inspect } from 'util';

type SignalUnit = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
type Signal = SignalUnit[];
type Input = Array<[Signal[], Signal[]]>;
type Display = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type DisplayPart = 'top' | 'top-left' | 'top-right' | 'middle' | 'bottom-left' | 'bottom-right' | 'bottom';
type UniqueLengths = 2 | 3 | 4 | 7;
type SignalSetsByLength = { [length: number]: Array<{ signalSet: Set<string>; value: number }> };
const lengthToDisplay: { [length in UniqueLengths]: Display } = { 2: 1, 3: 7, 4: 4, 7: 8 };
const uniqueLengths = new Set([2, 3, 4, 7]);

const part1 = (input: Input) => {
  return input.reduce((acc, [, displays]) => {
    return acc + displays.reduce((acc1, display) => acc1 + (uniqueLengths.has(display.length) ? 1 : 0), 0);
  }, 0);
};

const part2 = (input: Input) => {
  const [[signals, displays]] = input;
  const displayParts: Partial<{ [part in DisplayPart]: SignalUnit }> = {};
  const displaySignals: Partial<{ [display in Display]: Signal }> = {};
  const signalsByLength: { [len: number]: Signal[] } = {};
  for (let i = 0; i < signals.length; i++) {
    const signal = signals[i];
    const signalLength = signal.length;
    const display: Display = lengthToDisplay[signal.length];
    if (display) {
      displaySignals[display] = signal;
    } else {
      (signalsByLength[signalLength] ??= []).push(signal);
    }
  }

  // lengths
  // 1 === 2
  // 0, 6, 9 === 6
  // 2, 3, 5 === 5
  // 4 === 4
  // 7 === 3
  // 8 === 7

  // Assign top part
  const oneSignal = displaySignals[1];
  const oneSignalSet = new Set(oneSignal);
  const sevenSignal = displaySignals[7];
  for (let i = 0; i < sevenSignal.length; i++) {
    const signal = sevenSignal[i];
    if (!oneSignalSet.has(signal)) {
      displayParts.top = signal;
      break;
    }
  }

  // Determine display 3 (has length 5)
  // 3 is the only display in the length 5 signals that has all of 1 in it
  const lengthFiveSignals = signalsByLength[5];
  for (let i = 0; i < lengthFiveSignals.length; i++) {
    const signal = lengthFiveSignals[i];
    const signalSet = new Set(signal);

    // Check if all of 1 is in the signal
    let isThree = true;
    for (let j = 0; j < oneSignal.length; j++) {
      if (!signalSet.has(oneSignal[j])) {
        isThree = false;
        break;
      }
    }

    // Assign the signal
    if (isThree) {
      displaySignals[3] = signal;
      lengthFiveSignals.splice(i, 1);
      break;
    }
  }

  // Determine display 6 (has length 6)
  // 9 and 0 both have all of 1, so 6 would be the one that is missing part of 1
  const lengthSixSignals = signalsByLength[6];
  for (let i = 0; i < lengthSixSignals.length; i++) {
    const signal = lengthSixSignals[i];
    const signalSet = new Set(signal);

    // Check if all of 1 is in the signal
    let isSix = false;
    for (let j = 0; j < oneSignal.length; j++) {
      if (!signalSet.has(oneSignal[j])) {
        isSix = true;
        break;
      }
    }

    // Assign the signal
    if (isSix) {
      displaySignals[6] = signal;
      lengthSixSignals.splice(i, 1);
      break;
    }
  }

  // Determine display 5 (and therefore 2 since it will be the only one left)
  // 5 is only missing one length of 6 where 2 is missing two lengths from 6
  const sixSignal = displaySignals[6];
  for (let i = 0; i < lengthFiveSignals.length; i++) {
    const signal = lengthFiveSignals[i];
    const signalSet = new Set(signal);

    // Check if all of 1 is in the signal
    let missingSegments = 0;
    for (let j = 0; j < sixSignal.length; j++) {
      if (!signalSet.has(sixSignal[j])) {
        if (++missingSegments === 2) break;
      }
    }

    // Assign the signal
    if (missingSegments === 2) {
      displaySignals[5] = signal;
      lengthFiveSignals.splice(i, 1);
      break;
    }
  }

  // Only length five signal is a 2
  const [twoSignal] = lengthFiveSignals;
  displaySignals[2] = twoSignal;

  // Determine display 0 (length 6)
  // Between 9 and 0, 9 has all of 4 but 0 does not
  const fourSignal = displaySignals[4];
  for (let i = 0; i < lengthSixSignals.length; i++) {
    const signal = lengthSixSignals[i];
    const signalSet = new Set(signal);

    // Check if all of 1 is in the signal
    let isZero = false;
    for (let j = 0; j < fourSignal.length; j++) {
      if (!signalSet.has(fourSignal[j])) {
        isZero = true;
        break;
      }
    }

    // Assign the signal
    if (isZero) {
      displaySignals[0] = signal;
      lengthSixSignals.splice(i, 1);
      break;
    }
  }

  // Last remaining length six signal is 9
  const [nineSignal] = lengthSixSignals;
  displaySignals[9] = nineSignal;

  const signalSetsByLength: SignalSetsByLength = Object.entries(displaySignals).reduce((acc, [display, signal]) => {
    (acc[signal.length] ??= []).push({ value: parseInt(display), signalSet: new Set(signal) });
    return acc;
  }, {} as SignalSetsByLength);

  console.log(inspect({ displaySignals, signalSetsByLength }, { showHidden: false, depth: null, colors: true }));

  const display = displays.reduce((acc, signal) => {
    const length = signal.length;
    const signalSets = signalSetsByLength[length];
    let signalValue;
    if (uniqueLengths.has(length)) {
      const [{ value }] = signalSets;
      signalValue = value;
    } else {
      for (let i = 0; i < signalSets.length; i++) {
        const signalObj = signalSets[i];

        let isValidSignalObj = true;
        for (let j = 0; j < signal.length; j++) {
          if (!signalObj.signalSet.has(signal[j])) {
            isValidSignalObj = false;
            break;
          }
        }

        if (isValidSignalObj) {
          signalValue = signalObj.value;
        }
      }
    }
    return acc + signalValue;
  }, '');
  console.log(display);
};

const fullInput = readLines('./day08-input');
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
    const [signals, displays] = line.split(' | ');
    return [
      signals.split(' ').map((signal) => signal.split('')),
      displays.split(' ').map((display) => display.split('')),
    ];
  }) as Input;
};

console.log(part1(processInput(fullInput)));
console.log(part2(processInput(exampleInput)));
