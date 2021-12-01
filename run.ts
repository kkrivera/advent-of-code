import * as cloneDeep from "clone-deep";

export function run<T extends (...args: any[]) => any>(
  fn: T,
  ...inputs: Parameters<T>
) {
  const runtimes = [];
  let lastResult;

  for (let i = 0; i < 100; i++) {
    const clonedInputs = cloneDeep(inputs);
    const start = process.hrtime();
    const result = fn.apply(fn, clonedInputs);
    const diff = hrTimeToMs(process.hrtime(start));

    if (lastResult !== undefined && result !== lastResult) {
      throw new Error("Answers do not match!!!");
    } else {
      lastResult = result;
      runtimes.push(diff);
    }
  }

  const averageRuntime =
    runtimes.reduce((acc, cur) => acc + cur, 0) / runtimes.length;

  console.log(`${fn.name}: ${lastResult} -- ${averageRuntime}ms`);
}

function hrTimeToMs(hrTime: [number, number]) {
  return hrTime[0] * 1000 + hrTime[1] / 1000000;
}
