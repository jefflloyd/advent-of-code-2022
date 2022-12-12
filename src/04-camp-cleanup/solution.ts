import * as path from 'path';
import * as fs from 'fs';

const filename = path.join(__dirname, '../../src/04-camp-cleanup/input.txt');
const data = fs.readFileSync(filename, 'utf-8').split('\n');

let completelyOverlappingPairCount = 0;
let partiallyOverlappingPairCount = 0;

data.forEach(line => {
  if (line.length) {
    const [sectionOne, sectionTwo] = line.split(',');
    const sectionOneStart = parseInt(sectionOne.split('-')[0], 0);
    const sectionOneEnd = parseInt(sectionOne.split('-')[1], 0);
    const sectionTwoStart = parseInt(sectionTwo.split('-')[0], 0);
    const sectionTwoEnd = parseInt(sectionTwo.split('-')[1], 0);

    if (
      (sectionOneStart <= sectionTwoStart && sectionOneEnd >= sectionTwoEnd) ||
      (sectionTwoStart <= sectionOneStart && sectionTwoEnd >= sectionOneEnd)
    ) {
      completelyOverlappingPairCount++;
    }

    if (
      (sectionOneStart <= sectionTwoStart && sectionOneEnd >= sectionTwoStart) ||
      (sectionOneStart >= sectionTwoStart && sectionTwoEnd >= sectionOneStart)
    ) {
      partiallyOverlappingPairCount++;
    }
  }
});

// Part 1:
console.log(completelyOverlappingPairCount);

// Part 2:
console.log(partiallyOverlappingPairCount);
