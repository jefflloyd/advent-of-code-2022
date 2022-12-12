import * as path from 'path';
import * as fs from 'fs';

type Crates = Array<string>;
type Stacks = Array<Crates>;

const filename = path.join(__dirname, '../../src/05-supply-stacks/input.txt');
const data = fs.readFileSync(filename, 'utf-8').split('\n');

const stacksForCrateMover9000: Stacks = [];
const stacksForCrateMover9001: Stacks = [];
let initializedStacks = false;

const parseStackLine = (line: string) => {
  const characters = line.split('');

  characters.forEach((char: string, index: number) => {
    const charCode = char.charCodeAt(0);

    if (charCode > 64 && charCode < 91) {
      const stackToAddTo = (index - 1) / 4;

      while (stackToAddTo >= stacksForCrateMover9000.length) {
        stacksForCrateMover9000.push([]);
        stacksForCrateMover9001.push([]);
      }

      stacksForCrateMover9000[stackToAddTo].push(char);
      stacksForCrateMover9001[stackToAddTo].push(char);
    }
  });
}

const updateStacksForCrateMover9000 = (numCratesToMove: number, from: number, to: number): void => {
  for (let i = 0; i < numCratesToMove; i++) {
    const removedCrate = stacksForCrateMover9000[from].shift();
    
    stacksForCrateMover9000[to].unshift(removedCrate);
  }
};

const updateStacksForCrateMover9001 = (numCratesToMove: number, from: number, to: number): void => {
  const removedCrates: Crates = [];

  for (let i = 0; i < numCratesToMove; i++) {
    const removedCrate = stacksForCrateMover9001[from].shift();

    removedCrates.push(removedCrate);
  }

  stacksForCrateMover9001[to].unshift(...removedCrates);
};

const parseMoveCrateInstruction = (line: string) => {
  const splitLine = line.split(' ');
  const numCratesToMove = parseInt(splitLine[1], 10);
  const fromStackIndex = parseInt(splitLine[3], 10) - 1;
  const toStackIndex = parseInt(splitLine[5], 10) - 1;

  updateStacksForCrateMover9000(numCratesToMove, fromStackIndex, toStackIndex);
  updateStacksForCrateMover9001(numCratesToMove, fromStackIndex, toStackIndex);  
};

data.forEach(line => {
  if (!line.length) {
    initializedStacks = true;
  } else if (!initializedStacks) {
    parseStackLine(line);
  } else {
    parseMoveCrateInstruction(line);
  }
});

const getTopCratesForStacks = (stacks: Stacks): string => {
  let stringifiedTopCrates = '';

  stacks.forEach(stack => {
    stringifiedTopCrates += stack[0];
  });

  return stringifiedTopCrates;
};

// Part 1:
console.log(getTopCratesForStacks(stacksForCrateMover9000));

// Part 2:
console.log(getTopCratesForStacks(stacksForCrateMover9001));
