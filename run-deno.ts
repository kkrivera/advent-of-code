export function run<T extends (...args: any[]) => any>(fn: T, ...inputs: Parameters<T>) {
  const runTimes = [];
  let lastResult;

  for (let i = 0; i < 100; i++) {
    const clonedInputs = self.structuredClone(inputs);
    performance.mark('start');
    const result = fn(...clonedInputs);
    performance.mark('end');
    const runTime = performance.measure('duration', 'start', 'end');

    if (lastResult !== undefined && result !== lastResult) {
      throw new Error('Answers do not match!!!');
    } else {
      lastResult = result;
      runTimes.push(runTime.duration);
    }
  }

  // Calculate average runtime and reduce precision with Math.floor
  const precision = 100000;
  const averageRunTime = runTimes.reduce((acc, cur) => acc + cur, 0) / runTimes.length;
  const reducedPrecisionAverageRunTime = Math.floor(averageRunTime * precision) / precision;

  console.log(`${fn.name}: ${lastResult} -- ${reducedPrecisionAverageRunTime}ms`);
}

export function readLines(
  pathOrContent: string,
  { isFileContents = false }: Partial<{ isFileContents: boolean }> = {}
) {
  const fileContents = isFileContents ? pathOrContent : Deno.readTextFileSync(pathOrContent);
  return fileContents.split('\n');
}

export function displayGrid(input: any[][], delimiter: string = '') {
  input.forEach((row) => console.log(row.join(delimiter)));
}

export function spacer(num: number = 1) {
  return Array.from({ length: num * 4 }, () => ' ').join('');
}

export function isNil(obj: unknown) {
  return obj === null || obj === undefined;
}

export function log(...objs: any[]) {
  console.log(...objs.map((obj) => Deno.inspect(obj, { colors: true })));
}
