import * as cloneDeep from 'clone-deep';
import { readFileSync } from 'fs';

export function run<T extends (...args: any[]) => any>(fn: T, ...inputs: Parameters<T>) {
  const runTimes = [];
  let lastResult;

  for (let i = 0; i < 100; i++) {
    const clonedInputs = cloneDeep(inputs);
    const start = process.hrtime();
    const result = fn(...clonedInputs);
    const runTime = hrTimeToMs(process.hrtime(start));

    if (lastResult !== undefined && result !== lastResult) {
      throw new Error('Answers do not match!!!');
    } else {
      lastResult = result;
      runTimes.push(runTime);
    }
  }

  // Calculate average runtime and reduce precision with Math.floor
  const precision = 10000;
  const averageRunTime = runTimes.reduce((acc, cur) => acc + cur, 0) / runTimes.length;
  const reducedPrecisionAverageRunTime = Math.floor(averageRunTime * precision) / precision;

  console.log(`${fn.name}: ${lastResult} -- ${reducedPrecisionAverageRunTime}ms`);
}

function hrTimeToMs([seconds, nanoseconds]: [number, number]) {
  return seconds * 1000 + nanoseconds / 1000000;
}

export function readLines(
  pathOrContent: string,
  { isFileContents = false }: Partial<{ isFileContents: boolean }> = {}
) {
  const fileContents = isFileContents ? pathOrContent : readFileSync(pathOrContent, 'utf-8');
  return fileContents.split('\n');
}
