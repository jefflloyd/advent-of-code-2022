import * as path from 'path';
import * as fs from 'fs';

const filename = path.join(__dirname, '../../src/6-tuning-trouble/input.txt');
const data = fs.readFileSync(filename, 'utf-8').split('\n')[0].split('');

const performNCharacterLookback = (lookbackCount: number): number => {
  let i = lookbackCount - 1;

  for (; i < data.length; i++) {
    const set = new Set();
    
    for (let j = i; j >= i - (lookbackCount - 1); j--) {
      set.add(data[j]);
    }

    if (set.size === lookbackCount) {
      break;
    }  
  }

  return i;
};

// Part 1:
console.log(performNCharacterLookback(4) + 1);

// Part 2:
console.log(performNCharacterLookback(14) + 1);
