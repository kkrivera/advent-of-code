import { log, readLines } from '../run';

type Point = [number, number, number];
type Position = { point: Point; overlaps: Position[]; parent: Position; counted: boolean };
type Rotation = [number, number, number];
type Scanner = {
  id: number;
  absolutePosition: Point;
  absoluteRotation: Rotation;
  relativeScanners: { scanner: Scanner; offset: Point; rotation: Rotation }[];
  rotation: Rotation;
  beacons: Position[];
  overlappingScanners: Scanner[];
};
type Input = Scanner[];
const rotations = [0, 90, 180, 270];

const part1 = (input: Input) => {
  getBeacons(input);

  // for (let i = 1; i < input.length; i++) {
  //   console.log(i);
  //   const scanner = input[i];
  //   scanner.absolutePosition = getAbsPosition(scanner);
  // }

  console.log('\nAbsolute positions');
  display(input);

  console.log(`
  0 [0, 0, 0]
  1 [68, -1246, -43]
  2 [1105, -1205, 1229]
  3 [-92, -2380, -20]
  4 [-20, -1133, 1061]`);

  // console.log(1, rotate([68, -1246, -43], 0, 180, 0));
  // console.log(2, rotate([168, -1125, 72], 0, 180, 90));
  // console.log(3, rotate([160, -1134, -23], 0, 0, 0));
  // console.log(4, rotate([88, 113, -1104], 0, 270, 90));

  // const vec: Point = [168, -1125, 72];
  // rotations.forEach((x) =>
  //   rotations.forEach((y) => rotations.forEach((z) => console.log(`${vec} rot(${[x, y, z]}) = ${rotate(vec, x, y, z)}`)))
  // );

  // return input.reduce((acc, scan) => acc + scan.length, 0) - counts;
  // 311 is too low
  // 377 is too high
};

const getAbsPosition = (scanner: Scanner): Point => {
  if (scanner.absolutePosition) return scanner.absolutePosition;
  if (!scanner.relativeScanners.length) throw 'no rel position';

  for (let i = 0; i < scanner.relativeScanners.length; i++) {
    const { scanner: relScanner, offset } = scanner.relativeScanners[i];
    try {
      const absolutePosition = add(offset, getAbsPosition(relScanner));
      console.log();
      return absolutePosition;
    } catch (e) {
      console.log(e);
    }
  }
  throw 'no abs position';
};

const display = (scanners: Scanner[]) => {
  scanners.forEach(({ id, absolutePosition, absoluteRotation, relativeScanners }) => {
    console.log(JSON.stringify({ id, absolutePosition, absoluteRotation }));
    relativeScanners.forEach(({ scanner: relScanner, offset, rotation }) => {
      console.log(
        `  ↳ [${offset}] { id: ${relScanner.id}, absolutePosition: [${relScanner.absolutePosition}], relativeRotation: [${rotation}] }`
      );
    });
    console.log('');
  });
};

const getBeacons = (input: Input) => {
  for (let h = 0; h < input.length; h++) {
    const referenceScanner = input[h];
    if (!referenceScanner.absolutePosition) continue;
    for (let i = 0; i < input.length; i++) {
      const scanner = input[i];
      if (i === h || !!scanner.absolutePosition) continue;
      try {
        rotations.forEach((xRot) => {
          rotations.forEach((yRot) => {
            rotations.forEach((zRot) => {
              const rotatedScannerPositions = scanner.beacons.reduce((acc, position) => {
                const rotatedPosition: Position = { ...position, parent: position };

                // Perform the above rotations on the cloned position
                rotatedPosition.point = rotX(rotatedPosition.point, xRot);
                rotatedPosition.point = rotY(rotatedPosition.point, yRot);
                rotatedPosition.point = rotZ(rotatedPosition.point, zRot);
                acc.push(rotatedPosition);
                return acc;
              }, [] as Position[]);

              for (let j = 0; j < referenceScanner.beacons.length; j++) {
                for (let k = 0; k < rotatedScannerPositions.length; k++) {
                  // Get offset by which to test other points
                  const translationVector = diff(referenceScanner.beacons[j].point, rotatedScannerPositions[k].point);

                  const overlaps: { ref: Position; overlap: Position }[] = [];
                  for (let l = 0; l < rotatedScannerPositions.length; l++) {
                    const rotatedPosition = rotatedScannerPositions[l];
                    // Translate the point by the above offset
                    const translatedPoint = add(rotatedPosition.point, translationVector);

                    // Determine if we can find the same point within this translation
                    const found = referenceScanner.beacons.find((referencePosition) => compare(referencePosition.point, translatedPoint));
                    if (found) {
                      overlaps.push({ ref: found, overlap: rotatedPosition.parent });
                    }
                  }

                  if (overlaps.length >= 12) {
                    console.log(`\n${overlaps.length}`, translationVector, referenceScanner.absoluteRotation);

                    const relativeRotation: Rotation = [xRot, yRot, zRot];

                    scanner.relativeScanners.push({
                      scanner: referenceScanner,
                      offset: translationVector,
                      rotation: relativeRotation,
                    });

                    // console.log(
                    //   `[${relativeRotation}] + [${referenceScanner.absoluteRotation}] = [${addRotation(
                    //     relativeRotation,
                    //     referenceScanner.absoluteRotation
                    //   )}]`
                    // );

                    console.log(
                      `[${referenceScanner.absolutePosition}] + [${rotate(
                        translationVector,
                        ...referenceScanner.absoluteRotation
                      )}] = [${add(referenceScanner.absolutePosition, rotate(translationVector, ...referenceScanner.absoluteRotation))}]`
                    );
                    scanner.absoluteRotation = addRotation(relativeRotation, referenceScanner.absoluteRotation);
                    scanner.absolutePosition = add(
                      referenceScanner.absolutePosition,
                      rotate(translationVector, ...referenceScanner.absoluteRotation)
                    );

                    overlaps.forEach(({ ref, overlap }) => {
                      console.log(`(${h})`, ref.point, '-->', `(${i})`, overlap.point);
                      //   ref.overlaps.push(overlap);
                    });
                    throw 'found';
                  }
                }
              }
            });
          });
        });
      } catch (e) {}
    }
  }
};

const addRotation = ([x1, y1, z1]: Rotation, [x2, y2, z2]: Rotation): Rotation => {
  return [(x1 + x2) % 360, (y1 + y2) % 360, (z1 + z2) % 360];
};

const mult = ([x, y, z]: Point, by: number) => {
  return [x * by, y * by, z * by];
};

const diff = ([x1, y1, z1 = 0]: Point, [x2, y2, z2 = 0]: Point): Point => {
  return [x1 - x2, y1 - y2, z1 - z2];
};

const add = (...points: Point[]): Point => {
  return points.reduce(
    (acc, [x, y, z]) => {
      acc[0] += x;
      acc[1] += y;
      acc[2] += z;
      return acc;
    },
    [0, 0, 0] as Point
  );
};

const compare = ([x1, y1, z1 = 0]: Point, [x2, y2, z2 = 0]: Point): boolean => {
  return x1 === x2 && y1 === y2 && z1 === z2;
};

const rotate = (p: Point, θx: number, θy: number, θz: number) => {
  let rot = rotX(p, θx);
  rot = rotY(rot, θy);
  return rotZ(rot, θz);
};

const rotX = (p: Point, θ: number): Point => {
  return multMatrix(p, getXRotationMatrix(θ)) as Point;
};

const rotY = (p: Point, θ: number): Point => {
  return multMatrix(p, getYRotationMatrix(θ)) as Point;
};

const rotZ = (p: Point, θ: number): Point => {
  return multMatrix(p, getZRotationMatrix(θ)) as Point;
};

const multMatrix = (array: number[], matrix: number[][]): number[] => {
  if (array.length !== matrix.length) throw 'bad matrix or array error';
  const mult: number[] = [];
  for (let i = 0; i < matrix[0].length; i++) {
    const column = matrix.reduce((acc, row) => {
      acc.push(row[i]);
      return acc;
    }, []);
    mult.push(dotProduct(array, column));
  }
  return mult;
};

const dotProduct = (array1: number[], array2: number[]): number => {
  if (array1.length !== array2.length) throw 'bad array for dot product';
  return array1.reduce((sum, cur, i) => sum + cur * array2[i], 0);
};

const getXRotationMatrix = (θ: number) => {
  return [
    [1, 0, 0],
    [0, cos(θ), -sin(θ)],
    [0, sin(θ), cos(θ)],
  ];
};

const getYRotationMatrix = (θ: number) => {
  return [
    [cos(θ), 0, sin(θ)],
    [0, 1, 0],
    [-sin(θ), 0, cos(θ)],
  ];
};

const getZRotationMatrix = (θ: number) => {
  return [
    [cos(θ), -sin(θ), 0],
    [sin(θ), cos(θ), 0],
    [0, 0, 1],
  ];
};

const cos = (θ: number) => {
  const map = { 0: 1, 90: 0, 180: -1, 270: 0, [-90]: 0, [-180]: 1, [-270]: 0 };
  return map[θ % 360];
};

const sin = (θ: number) => {
  const map = { 0: 0, 90: 1, 180: 0, 270: -1, [-90]: -1, [-180]: 0, [-270]: 1 };
  return map[θ % 360];
};

const exampleInput1 = `--- scanner 0 ---
0,2,0
4,1,0
3,3,0

--- scanner 1 ---
-1,-1,0
-5,0,0
-2,1,0
0,1,0

--- scanner 2 ---
0,-1,0
-2,-1,0
-1,-3,0`.split('\n');

const exampleInput2 = `--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14`.split('\n');

const processInput = (input: string[]): Input => {
  const output: Input = [];
  let beacons: Position[];
  let id = 0;
  input.forEach((line) => {
    if (line.startsWith('---')) {
      beacons = [];
      output.push({
        id: id++,
        relativeScanners: [],
        absolutePosition: output.length === 0 ? [0, 0, 0] : null,
        absoluteRotation: output.length === 0 ? [0, 0, 0] : null,
        rotation: [0, 0, 0],
        beacons,
        overlappingScanners: [],
      });
    } else if (line) {
      beacons.push({ point: line.split(',').map((dim) => parseInt(dim)) as Point, overlaps: [], parent: null, counted: false });
    }
  });

  return output;
};

const fullInput = readLines('./day19-input');
console.log(part1(processInput(exampleInput2)));

/*
(0,2) - (-5,0) = (5,2)

(5,2) + (-5,0)  = (0,2) 
(5,2) + (-1,-1) = (4,1)
(5,2) + (-2,1)  = (3,3)
*/

/*

--- scanner 0 ---
0,2
4,1
3,3

--- scanner 1 ---
-1,-1
-5,0
-2,1
0,1

--- scanner 2 ---
0,-1
-2,-1
-1,-3



.....S
...B.B
B....S
....B.
S.....


(0,1)-(0,-1) = (0,2)

(0,2) + (0,-1)  = (0,1)
(0,2) + (-2,-1) = (-2,1) 
(0,2) + (-1,-3) = (-1,-1)

0 -> 1 = (5,2)
1 -> 2 = (0,2)
0 -> 2 = 0 -> 1 + 1 -> 2 = (5,2) + (0,2) = (5,4)
*/

/*
0 [0, 0, 0]
1 [0, 0, 0] + [68, -1246, -43] = [68, -1246, -43]
2 [-20, -1133, 1061] + [ 1125, -72, 168 ] = [1105, -1205, 1229]
3 [ 68, -1246, -43 ] + [ -160, -1134, 23 ] = [-92, -2380, -20]
4 [ 68, -1246, -43 ] + [ -88, -113, 1104 ] = [-20, -1133, 1061]


0 [0, 0, 0]
1 [68, -1246, -43]
2 [1105, -1205, 1229]
3 [-92, -2380, -20]
4 [-20, -1133, 1061]
*/
