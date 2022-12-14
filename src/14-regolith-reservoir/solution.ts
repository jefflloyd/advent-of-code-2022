import * as path from 'path';
import * as fs from 'fs';

const filename = path.join(__dirname, '../../src/14-regolith-reservoir/input.txt');
const data = fs.readFileSync(filename, 'utf-8').split('\n');

let maxYCoordinate = 0;
const rockCoordinates = new Set<string>;

data.forEach(line => {
  const splitLine = line.split(' -> ');

  for (let i = 0; i < splitLine.length - 1; i++) {
    const firstCoordinate = splitLine[i];
    const [firstCoordinateX, firstCoordinateY] = firstCoordinate.split(',').map(num => parseInt(num, 10));
    const secondCoordinate = splitLine[i + 1];
    const [secondCoordinateX, secondCoordinateY] = secondCoordinate.split(',').map(num => parseInt(num, 10));

    if (firstCoordinateX === secondCoordinateX) {
      const from = Math.min(firstCoordinateY, secondCoordinateY);
      const to = Math.max(firstCoordinateY, secondCoordinateY);

      for (let j = from; j <= to; j++) {
        rockCoordinates.add(`${firstCoordinateX},${j}`);
      }
    } else if (firstCoordinateY === secondCoordinateY) {
      const from = Math.min(firstCoordinateX, secondCoordinateX);
      const to = Math.max(firstCoordinateX, secondCoordinateX);

      for (let j = from; j <= to; j++) {
        rockCoordinates.add(`${j},${firstCoordinateY}`);
      }
    }

    if (Math.max(firstCoordinateY, secondCoordinateY) > maxYCoordinate) {
      maxYCoordinate = Math.max(firstCoordinateY, secondCoordinateY);
    }
  }
});

let restedSandUnitsWithAbyssSimulation = 0;
let restedSandUnitsWithRealSimulation = 0;

const dropSand = (collisionCoordinates: Set<string>, usingAbyssSimulation: boolean): boolean => {
  let coordinateX = 500;
  let coordinateY = 0;

  while (true) {
    if (usingAbyssSimulation && coordinateY > maxYCoordinate) {
      // if a sand grain is beyond the largest Y coordinate we have,
      // then it can never be blocked, and will fall into the abyss.
      // that's how we know there are no more grains that can come to rest.
      return false;
    } else if (!usingAbyssSimulation && collisionCoordinates.has('500,0')) {
      // stopping condition for the "real" simulation is when we can't drop any more
      // sand out of the (500,0) spawn point
      return false;
    }

    // the floor is 2 tiles beyond the max Y value, so one further than maxYCoordinate
    // is the farthest a grain of sand can go before we should consider it to rest
    const collidedWithFloor = !usingAbyssSimulation && coordinateY === maxYCoordinate + 1;

    // try space directly below
    if (collisionCoordinates.has(`${coordinateX},${coordinateY + 1}`) || collidedWithFloor) {
      // space directly below isn't free - try diagonally left
      if (collisionCoordinates.has(`${coordinateX - 1},${coordinateY + 1}`) || collidedWithFloor) {
         // space diagonally left isn't free - try diagonally right
         if (collisionCoordinates.has(`${coordinateX + 1},${coordinateY + 1}`) || collidedWithFloor) {
          // space diagonally right isn't free - comes to rest

          if (usingAbyssSimulation) {
            restedSandUnitsWithAbyssSimulation++;
          } else {
            restedSandUnitsWithRealSimulation++;
          }
          
          collisionCoordinates.add(`${coordinateX},${coordinateY}`);
          return true;
        } else {
          coordinateX += 1;
        }
      } else {
        coordinateX -= 1;
      }
    }

    coordinateY += 1;
  }
};

const runAbyssSimulation = () => {
  const collisionCoordinates = new Set(rockCoordinates);

  while (true) {
    if (!dropSand(collisionCoordinates, true)) {
      break;
    }
  }
};

const runRealSimulation = () => {
  const collisionCoordinates = new Set(rockCoordinates);

  while (true) {
    if (!dropSand(collisionCoordinates, false)) {
      break;
    }
  }
};

runAbyssSimulation();
runRealSimulation();

// Part 1:
console.log(restedSandUnitsWithAbyssSimulation);

// Part 2:
console.log(restedSandUnitsWithRealSimulation);
