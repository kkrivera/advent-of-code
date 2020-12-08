import * as cloneDeep from 'clone-deep';
import { run } from './run';

type Instruction = 'jmp' | 'acc' | 'nop';

interface InstructionLine {
  instruction: Instruction;
  modifier: number;
}

type InstructionSet = InstructionLine[];

interface ExecutionResult {
  acc: number;
  failedPath: number[];
}

function performOperation(line: InstructionLine, acc: number, i: number): { nextAcc: number; nextI: number } {
  // Destructure instruction and modifier from input
  const { instruction, modifier } = line;

  // Perform operations
  switch (instruction) {
    case 'acc':
      acc += modifier;
      break;
    case 'jmp':
      i += modifier - 1;
      break;
  }
  return { nextAcc: acc, nextI: i };
}

function part1(input: InstructionSet) {
  let acc = 0;
  const visitedLines = new Set<number>();
  for (let i = 0; i < input.length; i++) {
    // Check if we've been to this line before
    if (visitedLines.has(i)) return acc;

    // Add the current index as a visited line
    visitedLines.add(i);

    // Destructure instruction and modifier from input
    const { nextAcc, nextI } = performOperation(input[i], acc, i);
    acc = nextAcc;
    i = nextI;
  }

  return acc;
}

// Returns the potentially corrupted line number
function executeInstructionSet(input: InstructionSet): ExecutionResult {
  let acc = 0;
  const visitedLines = new Set<number>();
  const failedPath = [];
  for (let i = 0; i < input.length; i++) {
    failedPath.push(i);

    // Check if we've been to this line before
    if (visitedLines.has(i)) {
      return { acc, failedPath };
    }

    // Add the current index as a visited line
    visitedLines.add(i);

    const { nextAcc, nextI } = performOperation(input[i], acc, i);
    acc = nextAcc;
    i = nextI;
  }

  return { acc, failedPath: [] };
}

function part2(input: InstructionSet) {
  const clonedInput = cloneDeep(input);
  const { failedPath } = executeInstructionSet(input);

  const revert: { i: number; instruction: Instruction } = { i: -1, instruction: 'acc' };
  for (let i = 0; i < failedPath.length; i++) {
    const instrIdx = failedPath[i];
    const { instruction } = clonedInput[instrIdx];
    if (instruction !== 'acc') {
      // Capture the original index and instruction to revert if it doesn't fix the program
      revert.i = instrIdx;
      revert.instruction = instruction;

      // Change jmp to nop or nop to jump
      clonedInput[instrIdx].instruction = instruction === 'jmp' ? 'nop' : 'jmp';

      const { acc, failedPath } = executeInstructionSet(clonedInput);
      if (!failedPath.length) return acc;
    }

    clonedInput[revert.i].instruction = revert.instruction;
  }
}

const providedInput = `jmp +11
nop +495
nop +402
jmp +570
jmp +569
jmp +451
acc -12
jmp +364
acc +30
acc +21
jmp +430
jmp +87
acc -12
acc -4
acc +11
jmp +50
jmp +149
jmp +341
nop +1
acc +33
jmp +461
acc +43
acc -15
jmp +440
acc +18
acc +22
acc -14
nop +576
jmp -22
acc +33
acc +0
acc +34
jmp +369
nop +497
nop +469
acc -12
jmp +93
acc -13
jmp +337
acc +5
acc +18
acc +26
nop +115
jmp +67
nop +282
nop -6
nop +289
jmp +303
acc +10
acc -15
jmp +153
nop +445
acc -8
acc +11
jmp +374
acc +35
acc -9
nop +199
jmp +1
jmp +369
jmp +1
acc +22
acc -18
acc +17
jmp +303
acc +37
acc +13
acc +22
nop +307
jmp +154
nop +381
acc -6
nop -54
acc +38
jmp +494
acc +37
acc +15
jmp +475
jmp +474
nop +534
acc +37
jmp +359
jmp +296
acc +40
jmp +157
acc +5
nop +139
acc +49
acc +45
jmp +237
acc +42
acc +8
acc +43
jmp +466
nop +362
acc +43
acc +44
jmp +233
acc +30
acc +42
acc -6
jmp -97
jmp +527
acc +2
acc +13
nop +425
jmp +113
nop +374
acc +31
jmp +48
acc +29
acc +15
acc +35
jmp +357
acc +19
acc -2
jmp +480
acc +1
jmp +385
acc +16
acc +47
jmp +397
jmp +1
jmp +1
acc +5
acc -5
jmp +529
acc +11
jmp +123
acc +44
acc +49
jmp +413
acc +13
acc +10
acc -6
acc +11
jmp -33
acc +25
acc +47
acc +40
acc +23
jmp +39
acc +50
acc +12
jmp +386
acc +23
jmp +464
acc +15
nop +361
acc +30
jmp +346
jmp +1
acc +19
acc +16
acc +23
jmp +441
jmp +69
acc +12
acc +46
acc -5
jmp +427
acc +49
nop +173
acc -12
jmp +249
acc +41
acc +29
nop +168
acc +31
jmp +349
acc +40
acc +8
acc +14
jmp +231
acc -17
jmp +215
nop +202
acc +0
nop +172
jmp +351
acc +21
acc +31
nop +405
acc +14
jmp +272
acc +5
acc +33
acc +31
acc +21
jmp -91
acc -18
acc +35
jmp +23
acc -10
nop +374
acc +27
jmp -157
acc +39
acc +8
acc +34
acc +34
jmp +333
jmp -51
acc -18
acc +26
jmp +377
acc -5
jmp +190
acc +45
jmp +1
acc +29
jmp +202
acc +25
acc +30
jmp +90
acc +49
nop +240
jmp +109
jmp +291
acc +9
jmp +348
acc +39
jmp +3
jmp +273
jmp -218
jmp +150
jmp +1
jmp +148
acc +9
acc +11
acc +20
acc +3
jmp -167
nop +223
jmp +275
nop +309
jmp +20
acc -18
acc -10
acc -2
jmp +173
acc +13
acc -17
nop +132
acc -6
jmp +240
acc +37
acc +4
acc +49
acc -16
jmp +171
jmp +239
nop +300
nop +311
acc -9
jmp -180
acc +32
acc +21
jmp +1
jmp -62
nop +141
acc +46
acc +25
nop -7
jmp +318
acc +3
jmp +185
nop +196
acc +16
acc +18
jmp -47
acc +39
acc +35
acc +21
acc +14
jmp +23
acc +20
acc +20
jmp +97
nop -71
acc +50
acc -11
jmp -145
nop -218
acc +42
acc +23
acc +35
jmp +183
nop +16
nop -206
acc +2
acc +11
jmp +129
acc +37
acc +41
acc +47
nop -280
jmp +93
acc -12
acc +31
jmp +10
acc +2
acc +29
jmp +64
acc -14
nop +308
jmp -251
acc +8
acc +10
jmp +259
acc +38
nop -131
acc +45
jmp +6
acc +18
acc +43
nop -218
nop -94
jmp +178
jmp +1
acc +27
acc +29
jmp +324
acc -12
acc +30
jmp +115
acc -1
jmp -224
jmp +1
jmp +205
acc +47
jmp -66
acc +21
acc +44
jmp +147
acc +2
acc +50
acc -14
acc +50
jmp -165
acc +33
acc +20
acc -5
acc +19
jmp -246
acc +26
acc +44
jmp -96
acc +22
jmp +127
nop +25
acc -14
acc -15
jmp -314
jmp +1
acc +11
acc +12
jmp +71
acc +0
acc +16
acc +26
nop +242
jmp -172
acc +8
acc +15
acc -4
jmp -78
acc +42
jmp +225
acc -7
jmp +243
jmp +242
acc +23
acc +21
jmp +54
acc +25
jmp -18
jmp -42
jmp +26
jmp -368
acc +29
acc +22
acc +1
acc +0
jmp +255
acc +39
jmp +1
nop -332
acc +22
jmp +92
acc +45
acc +29
jmp +12
jmp +1
acc +22
jmp +1
jmp -245
jmp -162
acc -4
acc -4
jmp +28
nop -4
jmp -386
jmp -28
acc -1
acc +25
nop -28
jmp -10
acc +9
acc +45
jmp +1
acc +13
jmp -171
acc +3
acc +19
acc -8
acc +11
jmp -266
acc -18
nop -380
jmp -155
acc +36
acc -13
acc +35
acc -16
jmp -414
nop -408
jmp +36
acc +5
jmp +101
acc -7
acc +17
jmp -204
acc -14
jmp -99
jmp +1
nop -165
acc +10
acc +13
jmp +46
acc -13
jmp -358
acc -7
acc -14
jmp -31
acc +21
acc -9
jmp -46
nop -220
acc -1
jmp -105
acc +42
acc -14
jmp -75
acc +6
jmp -34
nop -391
acc -11
jmp -123
nop -234
acc -9
acc +35
jmp -317
nop +150
acc +11
jmp +138
acc +30
acc -11
acc +31
jmp -134
acc +20
jmp -200
acc +13
acc +14
acc +25
jmp -310
acc +13
acc +18
acc -1
jmp +85
jmp +72
acc +1
jmp -78
acc -8
jmp -149
acc +13
jmp -438
acc +38
nop -25
jmp -264
acc +50
acc +47
nop -241
acc +31
jmp -419
jmp +57
nop -359
jmp -323
acc +48
acc +4
acc -12
acc +42
jmp -167
acc +50
acc -9
jmp -138
nop -171
acc +48
jmp -398
acc -8
acc +41
acc +21
jmp -508
acc +29
acc +41
acc +35
acc +25
jmp -388
jmp -439
acc +26
acc +19
acc +13
acc -16
jmp -165
nop -61
acc +16
acc +20
jmp -312
nop -19
jmp -101
acc +1
jmp -515
acc +19
jmp +96
jmp +1
acc +42
acc +34
acc +33
jmp +80
nop -314
acc +12
acc +36
nop -405
jmp -87
acc +16
nop -100
acc +11
acc +15
jmp -524
nop -369
acc +8
jmp -386
acc +32
jmp -77
acc -7
acc -16
acc +33
acc +30
jmp -213
acc -2
jmp -403
acc +35
nop -81
jmp -340
acc +7
acc +3
jmp -444
jmp -445
jmp -218
acc +39
acc -9
jmp +1
jmp -284
acc +43
acc +1
acc -12
nop -218
jmp -460
jmp -404
jmp +1
jmp -135
jmp -223
jmp +1
acc +30
acc +36
jmp -61
jmp -580
acc -8
jmp -79
acc +18
acc -1
acc +9
jmp -321
jmp -560
acc +2
jmp -182
acc +18
acc +29
acc +28
jmp -129
acc +10
nop -120
jmp +16
acc +23
acc +9
acc +36
acc +24
jmp -589
acc +21
jmp -419
nop -275
jmp -231
jmp -341
acc +33
acc +30
jmp -470
nop -337
jmp -389
jmp +5
acc -14
nop -27
acc +5
jmp -78
acc +40
acc +2
acc -5
nop -205
jmp -537
jmp -318
nop -404
acc +12
acc +0
acc -4
jmp -54
acc +8
acc +32
nop -357
acc +35
jmp -153
acc +42
acc +17
acc -9
jmp -13
nop -222
acc +27
jmp -63
acc +11
acc -17
nop -45
acc +4
jmp -217
acc +5
acc +26
nop -574
jmp -489
acc +29
acc +36
acc +31
nop -407
jmp +1`;

const input = providedInput.split('\n').map((line) => {
  const [instruction, modifier] = line.split(' ');
  return { instruction: instruction as Instruction, modifier: parseInt(modifier, 10) };
});

run(part1, input);
run(part2, input);
