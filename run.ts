import * as cloneDeep from 'clone-deep';

export function run<T extends (...args: any[]) => any>(fn: T, ...inputs: Parameters<T>) {
  const runtimes = [];
  let lastResult;

  for (let i = 0; i < 10; i++) {
    const clonedInputs = cloneDeep(inputs);
    const start = new Date();
    const result = fn.apply(fn, clonedInputs);
    const end = new Date();

    if (lastResult !== undefined && result !== lastResult) {
      throw new Error('Answers do not match!!!');
    } else {
      lastResult = result;
      runtimes.push(end.getTime() - start.getTime());
    }
  }

  const averageRuntime = runtimes.reduce((acc, cur) => acc + cur, 0) / runtimes.length;

  console.log(`${fn.name}: ${lastResult} -- ${averageRuntime}ms`);
}
