import { readLines, run } from '../run-deno.ts';
const [, __filename] = new URL('', import.meta.url).pathname.match(/(day\d+?).ts/) || [];

type DataSources = Record<string, DataSource>;

interface DataSource {
  name: string;
  type: 'dir' | 'file';
  size: number;
  children?: DataSources;
  parent?: DataSource;
}

type Input = DataSource;

const storeSumsRecursive = (dataSource: DataSource): number => {
  const { type, children, size } = dataSource;
  if (type === 'file') {
    return size;
  } else {
    dataSource.size = Object.values(children || {}).reduce(
      (acc, _dataSource) => acc + storeSumsRecursive(_dataSource),
      0
    );
    return dataSource.size;
  }
};

const part1 = (input: Input) => {
  storeSumsRecursive(input);

  const findSums = ({ type, size, children }: DataSource): number => {
    return Object.values(children || {}).reduce(
      (acc, dataSource) => {
        return acc + findSums(dataSource);
      },
      type === 'dir' && size < 100000 ? size : 0
    );
  };

  return findSums(input);
};

const part2 = (input: Input) => {
  storeSumsRecursive(input);

  const remainingSpace = 70000000 - input.size;
  const requiredSpace = 30000000;
  const minRequired = requiredSpace - remainingSpace;

  const collectFolderSizes = ({ type, size, children }: DataSource, sizes: number[] = []) => {
    if (type === 'dir') {
      if (size > minRequired) sizes.push(size);
      Object.values(children || {}).forEach((dataSource) => collectFolderSizes(dataSource, sizes));
    }
    return sizes;
  };

  const [toDelete] = collectFolderSizes(input).sort((a, b) => a - b);

  return toDelete;
};

const toFileSystem = (lines: string[]): DataSource => {
  let dataSource = lines.reduce(
    (acc, line) => {
      const [start, ...rest] = line.split(' ');

      if (start === '$') {
        // Command
        const [command, param] = rest;
        if (command === 'cd') {
          // Changing Directory
          if (param === '..') {
            return acc.parent as any;
          } else if (param !== '/') {
            return (acc.children || {})[param];
          }
        }
      } else {
        const [name] = rest;
        const isDir = start === 'dir';
        (acc.children ??= {})[name] = {
          name,
          type: isDir ? 'dir' : 'file',
          size: isDir ? 0 : parseInt(start),
          parent: acc,
        };
      }

      return acc;
    },
    { name: '/', type: 'dir' } as DataSource
  );

  while (dataSource.parent) dataSource = dataSource.parent;

  return dataSource;
};

const fullInput = readLines(`./${__filename}-input`);
const input: Input = toFileSystem(fullInput);

run(part1, input); // part1: 1908462 -- 0.04ms
run(part2, input); // part2: 3979145 -- 0.1ms
