import * as path from 'path';
import * as fs from 'fs';

enum Direction {
  Up = "U",
  Down = "D",
  Left = "L",
  Right = "R",
}

type Knot = [number, number];
type Rope = Array<Knot>;

const filename = path.join(__dirname, '../../src/09-rope-bridge/input.txt');
const data = fs.readFileSync(filename, 'utf-8').split('\n');

const twoKnotsRope: Rope = [];
for (let i = 0; i < 2; i++) {
  twoKnotsRope.push([0, 0]);
}

const tenKnotsRope: Rope = [];
for (let i = 0; i < 10; i++) {
  tenKnotsRope.push([0, 0]);
}

// feels like there should be a nice, math-y way of addressing all these conditionals cleanly,
// but i couldn't find one. knowing when to move a knot diagonally is quite tricky.
const updateKnotPosition = (knot: Knot, leadingKnot: Knot) => {
  if (leadingKnot[0] - knot[0] > 1) {
    knot[0] += 1;

    if (knot[1] < leadingKnot[1]) {
      knot[1] += 1;
    } else if (knot[1] > leadingKnot[1]) {
      knot[1] -= 1;
    }
  } else if (knot[0] - leadingKnot[0] > 1) {
    knot[0] -= 1;

    if (knot[1] < leadingKnot[1]) {
      knot[1] += 1;
    } else if (knot[1] > leadingKnot[1]) {
      knot[1] -= 1;
    }
  } else if (leadingKnot[1] - knot[1] > 1) {
    knot[1] += 1;
    
    if (knot[0] < leadingKnot[0]) {
      knot[0] += 1;
    } else if (knot[0] > leadingKnot[0]) {
      knot[0] -= 1;
    }
  } else if (knot[1] - leadingKnot[1] > 1) {
    knot[1] -= 1;
    
    if (knot[0] < leadingKnot[0]) {
      knot[0] += 1;
    } else if (knot[0] > leadingKnot[0]) {
      knot[0] -= 1;
    }
  }
};

const getNumVisitedCoordinatesForLastKnot = (rope: Rope): number => {
  const visitedCoordinates = new Set<string>();

  data.forEach(line => {
    if (line.length) {
      const splitLine = line.split(' ');
      const direction: Direction = splitLine[0] as Direction;
      const numSteps = parseInt(splitLine[1], 10);
  
      for (let i = 0; i < numSteps; i++) {
        if (direction === Direction.Up) {
          rope[0][1] += 1;
        } else if (direction === Direction.Down) {
          rope[0][1] -= 1;
        } else if (direction === Direction.Left) {
          rope[0][0] -= 1;
        } else {
          rope[0][0] += 1;
        }
  
        for (let j = 0; j < rope.length - 1; j++) {
          updateKnotPosition(rope[j+1], rope[j]);
        }
  
        visitedCoordinates.add(`${rope[rope.length - 1][0]},${rope[rope.length - 1][1]}`);
      }
    }
  });

  return visitedCoordinates.size;
};

// Part 1:
console.log(getNumVisitedCoordinatesForLastKnot(twoKnotsRope));

// Part 2:
console.log(getNumVisitedCoordinatesForLastKnot(tenKnotsRope));

