import * as path from 'path';
import * as fs from 'fs';

const filename = path.join(__dirname, '../../src/1-calorie-counting/input.txt');
const data = fs.readFileSync(filename, 'utf-8').split('\n');

let currentElfCalories = 0;
let elfCalories: number[] = [];

data.forEach(line => {
  if (line.length) {
    currentElfCalories += parseInt(line, 10);
  } else {
    elfCalories.push(currentElfCalories);

    currentElfCalories = 0;
  }
});

elfCalories.sort((a, b) => a > b ? -1 : 1);

// Part 1:
console.log(elfCalories[0]);

// Part 2:
console.log(elfCalories.slice(0, 3).reduce((prev, curr) => prev + curr));