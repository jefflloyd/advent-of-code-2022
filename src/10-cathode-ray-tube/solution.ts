import * as path from 'path';
import * as fs from 'fs';

enum Instruction {
  AddX = "addx",
  Noop = "noop",
}

const filename = path.join(__dirname, '../../src/10-cathode-ray-tube/input.txt');
const data = fs.readFileSync(filename, 'utf-8').split('\n');

let cpuXRegister = 1;
let sumOfSignalStrengths = 0;
const signalStrengths: Array<number> = [];

data.forEach(line => {
  if (line.length) {
    const splitLine = line.split(' ');
    const instruction = splitLine[0] as Instruction;
    const xArg = splitLine[1] && parseInt(splitLine[1], 10);

    if (instruction === Instruction.AddX) {
      signalStrengths.push(cpuXRegister);
      signalStrengths.push(cpuXRegister);

      cpuXRegister += xArg;
    } else {
      signalStrengths.push(cpuXRegister);
    }
  }
});

[20, 60, 100, 140, 180, 220].forEach(cycle => {
  sumOfSignalStrengths += cycle * signalStrengths[cycle - 1];
});

let crtOutput = '';

for (let i = 0; i < 6; i++) {
  let currentLine = '';

  for (let j = 0; j < 40; j++) {
    const spritePosition = signalStrengths[(i * 40) + j];
  
    if (Math.abs(spritePosition - j) < 2) {
      currentLine += '#';
    } else {
      currentLine += '.';
    }
  }

  crtOutput += currentLine + '\n';
}

// Part 1:
console.log(sumOfSignalStrengths);

// Part 2:
console.log(crtOutput); // prints out "EALGULPG"
