import * as path from 'path';
import * as fs from 'fs';

type Coordinate = {
  x: number,
  y: number,
};

const STARTING_CELL = "S";
const ENDING_CELL = "E";

const filename = path.join(__dirname, '../../src/12-hill-climbing-algorithm/input.txt');
const data = fs.readFileSync(filename, 'utf-8').split('\n');
const grid = data.map(line => line.split(''));

const findStartingCoordinate = (): Coordinate => {
  let coordinate: Coordinate;

  grid.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell === STARTING_CELL) {
        coordinate = {
          x: columnIndex,
          y: rowIndex,
        };
      }
    })
  });

  return coordinate;
};

const canTraverseToCell = (from: Coordinate, to: Coordinate): boolean => {
  if (
    from.y < 0 || from.y >= grid.length || to.y < 0 || to.y >= grid.length ||
    from.x < 0 || from.x >= grid[0].length || to.x < 0 || to.x >= grid[0].length
  ) {
    return false;
  }

  const fromCellValue = grid[from.y][from.x];
  const toCellValue = grid[to.y][to.x];

  if (fromCellValue === STARTING_CELL) {
    return toCellValue === 'a' || toCellValue === 'b';
  } else if (toCellValue === ENDING_CELL) {
    return fromCellValue === 'y' || fromCellValue === 'z';
  } else if (toCellValue === STARTING_CELL) {
    return false;
  } else {
    const fromCharCode = fromCellValue.charCodeAt(0);
    const toCharCode = toCellValue.charCodeAt(0);

    return toCharCode - fromCharCode < 2;
  }
};

const startingCoordinate = findStartingCoordinate();
const visitedCells = [];
const priorityQueue = [];

priorityQueue.push({
  coordinate: startingCoordinate,
  pathLength: 0,
});

const recurse = (coordinate: Coordinate, pathLength: number) => {
  const x = coordinate.x;
  const y = coordinate.y;
  const cell = grid[y][x];

  if (cell === ENDING_CELL) {
    return pathLength;
  } else {
    if (canTraverseToCell(coordinate, { x: x - 1, y }) && !visitedCells.includes(`(${x - 1},${y})`)) {
      visitedCells.push(`(${x - 1},${y})`);
      priorityQueue.push({
        coordinate: { x: x - 1, y },
        pathLength: pathLength + 1,
      });
    }
    if (canTraverseToCell(coordinate, { x: x + 1, y }) && !visitedCells.includes(`(${x + 1},${y})`)) {
      visitedCells.push(`(${x + 1},${y})`);
      priorityQueue.push({
        coordinate: { x: x + 1, y },
        pathLength: pathLength + 1,
      });
    }
    if (canTraverseToCell(coordinate, { x, y: y - 1 }) && !visitedCells.includes(`(${x},${y - 1})`)) {
      visitedCells.push(`(${x},${y - 1})`);
      priorityQueue.push({
        coordinate: { x, y: y - 1 },
        pathLength: pathLength + 1,
      });
    }
    if (canTraverseToCell(coordinate, { x, y: y + 1 }) && !visitedCells.includes(`(${x},${y + 1})`)) {
      visitedCells.push(`(${x},${y + 1})`);
      priorityQueue.push({
        coordinate: { x, y: y + 1 },
        pathLength: pathLength + 1,
      });
    }
  }

  return -1;
};

let result: number;

while (priorityQueue.length) {
  const newAttempt = priorityQueue.shift();
  result = recurse(newAttempt.coordinate, newAttempt.pathLength);

  if (result > -1) {
    break;
  }
}

// Part 1:
console.log(result);
