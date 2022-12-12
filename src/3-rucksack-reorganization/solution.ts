import * as path from 'path';
import * as fs from 'fs';

const filename = path.join(__dirname, '../../src/3-rucksack-reorganization/input.txt');
const data = fs.readFileSync(filename, 'utf-8').split('\n');

let compartmentsPrioritySum = 0;
let badgesPrioritySum = 0;

const calculatePriorityScore = (character: string): number => {
  const charCode = character.charCodeAt(0);
  return charCode > 96
    ? charCode - 96
    : charCode - 64 + 26;
};

const findDuplicatedItemInRucksack = (rucksack: string): string => {
  const midpoint = rucksack.length / 2;
  const firstCompartment = rucksack.slice(0, midpoint).split('');
  const secondCompartment = rucksack.slice(midpoint).split('');

  return firstCompartment.find(item => secondCompartment.includes(item));
};

const findBadgeInElfTrioRucksacks = (rucksacks: Array<string>): string => {
  const firstElfRucksack = rucksacks[0].split('');
  const secondElfRucksack = rucksacks[1].split('');
  const thirdElfRucksack = rucksacks[2].split('');

  return firstElfRucksack.find(item => secondElfRucksack.includes(item) && thirdElfRucksack.includes(item));
};

data.forEach(line => {
  if (line.length) {
    const duplicatedItemInRucksack = findDuplicatedItemInRucksack(line);
    compartmentsPrioritySum += calculatePriorityScore(duplicatedItemInRucksack);
  }
});

for (let i = 2; i < data.length; i += 3) {
  const sharedBadge = findBadgeInElfTrioRucksacks([data[i - 2], data[i - 1], data[i]]);
  badgesPrioritySum += calculatePriorityScore(sharedBadge);
}

// Part 1:
console.log(compartmentsPrioritySum);

// Part 2:
console.log(badgesPrioritySum);
