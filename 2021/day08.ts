import { readLines, run } from '../run';

type SignalUnit = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
type Signal = SignalUnit[];
type InputLine = [Signal[], Signal[]];
type Input = InputLine[];
type Display = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
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
  return input.reduce((sum, line) => {
    const processedLine = processLine(line);
    return sum + processedLine;
  }, 0);
};

const processLine = ([signals, displays]: InputLine) => {
  // lengths
  // 1 === 2
  // 0, 6, 9 === 6
  // 2, 3, 5 === 5
  // 4 === 4
  // 7 === 3
  // 8 === 7

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

  // Determine display 6 (has length 6)
  // 9 and 0 both have all of 1, so 6 would be the one that is missing part of 1
  // Determine display 0 (length 6)
  // Between 9 and 0, 9 has all of 4 but 0 does not
  const oneSignal = displaySignals[1];
  const fourSignal = displaySignals[4];
  const lengthSixSignals = signalsByLength[6];
  for (let i = 0; i < lengthSixSignals.length; i++) {
    const signal = lengthSixSignals[i];
    const signalSet = new Set(signal);

    if (!displaySignals[6]) {
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
        lengthSixSignals.splice(i--, 1);
        continue;
      }
    }

    if (!displaySignals[9]) {
      // Check if all of 1 is in the signal
      let isZero = true;
      for (let j = 0; j < fourSignal.length; j++) {
        if (!signalSet.has(fourSignal[j])) {
          isZero = false;
          break;
        }
      }

      // Assign the signal
      if (isZero) {
        displaySignals[9] = signal;
        lengthSixSignals.splice(i--, 1);
        continue;
      }
    }
  }

  // Determine display 3 (has length 5)
  // 3 is the only display in the length 5 signals that has all of 1 in it
  // Determine display 2 (and therefore 5 since it will be the only one left)
  // 5 is only missing one length of 6 where 2 is missing two lengths from 6
  const sixSignal = displaySignals[6];
  const lengthFiveSignals = signalsByLength[5];
  for (let i = 0; i < lengthFiveSignals.length; i++) {
    const signal = lengthFiveSignals[i];
    const signalSet = new Set(signal);

    if (!displaySignals[3]) {
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
        lengthFiveSignals.splice(i--, 1);
        continue;
      }
    }

    if (!displaySignals[2]) {
      // Check if all of 1 is in the signal
      let missingSegments = 0;
      for (let j = 0; j < sixSignal.length; j++) {
        if (!signalSet.has(sixSignal[j])) {
          if (++missingSegments === 2) break;
        }
      }

      // Assign the signal
      if (missingSegments === 2) {
        displaySignals[2] = signal;
        lengthFiveSignals.splice(i--, 1);
        continue;
      }
    }
  }

  // Only length five signal is a 2
  const [fiveSignal] = lengthFiveSignals;
  displaySignals[5] = fiveSignal;

  // Last remaining length six signal is 9
  const [zeroSignal] = lengthSixSignals;
  displaySignals[0] = zeroSignal;

  const signalSetsByLength: SignalSetsByLength = Object.entries(displaySignals).reduce((acc, [display, signal]) => {
    (acc[signal.length] ??= []).push({ value: parseInt(display), signalSet: new Set(signal) });
    return acc;
  }, {} as SignalSetsByLength);

  return displays.reduce((acc, signal, i) => {
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
    return acc + Math.pow(10, 3 - i) * signalValue;
  }, 0);
};

const fullInput = readLines('./day08-input');

const processInput = (input: string[]): Input => {
  return input.map((line) => {
    const [signals, displays] = line.split(' | ');
    return [signals.split(' ').map((signal) => signal.split('')), displays.split(' ').map((display) => display.split(''))];
  }) as Input;
};

run(part1, processInput(fullInput)); // part1: 514 -- 0.0238ms
run(part2, processInput(fullInput)); // part2: 1012272 -- 1.0518ms
