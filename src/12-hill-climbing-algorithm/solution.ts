import * as path from 'path';
import * as fs from 'fs';

type Coordinate = {
  x: number,
  y: number,
};

type ClimbingMode = {
  ascending: boolean,
  startingCell: 'S' | 'E',
  endingCell: 'E' | 'a',
};

type PathToExplore = {
  coordinate: Coordinate,
  pathLength: number,
};

const filename = path.join(__dirname, '../../src/12-hill-climbing-algorithm/input.txt');
const data = fs.readFileSync(filename, 'utf-8').split('\n');
const grid = data.map(line => line.split(''));

const findStartingCoordinate = (mode: ClimbingMode): Coordinate => {
  let coordinate: Coordinate;

  grid.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell === mode.startingCell) {
        coordinate = {
          x: columnIndex,
          y: rowIndex,
        };
      }
    })
  });

  return coordinate;
};

const canTraverseToCell = (from: Coordinate, to: Coordinate, mode: ClimbingMode): boolean => {
  if (
    from.y < 0 || from.y >= grid.length || to.y < 0 || to.y >= grid.length ||
    from.x < 0 || from.x >= grid[0].length || to.x < 0 || to.x >= grid[0].length
  ) {
    return false;
  }

  const fromCellValue = grid[from.y][from.x];
  const toCellValue = grid[to.y][to.x];
  const fromCharCode = fromCellValue.charCodeAt(0);
  const toCharCode = toCellValue.charCodeAt(0);

  if (mode.ascending) {
    if (fromCellValue === mode.startingCell) {
      return ['a', 'b'].includes(toCellValue);
    } else if (fromCellValue === mode.endingCell) {
      return ['y', 'z'].includes(toCellValue);
    } else {
      return toCharCode - fromCharCode < 2;
    }
  } else {
    if (fromCellValue === mode.startingCell) {
      return ['y', 'z'].includes(toCellValue);
    } else if (fromCellValue === mode.endingCell) {
      return toCellValue === 'b';
    } else {
      return fromCharCode - toCharCode < 2;
    }
  }
};

const exploreCoordinate = (
  coordinate: Coordinate,
  pathLength: number,
  mode: ClimbingMode,
  visitedCells: Array<string>,
  priorityQueue: Array<PathToExplore>,
) => {
  const x = coordinate.x;
  const y = coordinate.y;
  const cell = grid[y][x];

  if (cell === mode.endingCell) {
    return pathLength;
  } else {
    if (canTraverseToCell(coordinate, { x: x - 1, y }, mode) && !visitedCells.includes(`(${x - 1},${y})`)) {
      visitedCells.push(`(${x - 1},${y})`);
      priorityQueue.push({
        coordinate: { x: x - 1, y },
        pathLength: pathLength + 1,
      });
    }
    if (canTraverseToCell(coordinate, { x: x + 1, y }, mode) && !visitedCells.includes(`(${x + 1},${y})`)) {
      visitedCells.push(`(${x + 1},${y})`);
      priorityQueue.push({
        coordinate: { x: x + 1, y },
        pathLength: pathLength + 1,
      });
    }
    if (canTraverseToCell(coordinate, { x, y: y - 1 }, mode) && !visitedCells.includes(`(${x},${y - 1})`)) {
      visitedCells.push(`(${x},${y - 1})`);
      priorityQueue.push({
        coordinate: { x, y: y - 1 },
        pathLength: pathLength + 1,
      });
    }
    if (canTraverseToCell(coordinate, { x, y: y + 1 }, mode) && !visitedCells.includes(`(${x},${y + 1})`)) {
      visitedCells.push(`(${x},${y + 1})`);
      priorityQueue.push({
        coordinate: { x, y: y + 1 },
        pathLength: pathLength + 1,
      });
    }
  }

  return -1;
};

const findShortestPathLength = (mode: ClimbingMode): number => {
  const startingCoordinate = findStartingCoordinate(mode);
  const priorityQueue = [];
  const visitedCells = [];
  let finishedPathLength: number;

  priorityQueue.push({
    coordinate: startingCoordinate,
    pathLength: 0,
  });
  visitedCells.push(`(${startingCoordinate.x},${startingCoordinate.y})`);

  while (priorityQueue.length) {
    const newAttempt = priorityQueue.shift();
    finishedPathLength = exploreCoordinate(
      newAttempt.coordinate,
      newAttempt.pathLength,
      mode,
      visitedCells,
      priorityQueue,
    );
  
    if (finishedPathLength > -1) {
      break;
    }
  }

  return finishedPathLength;
};

const ascendingMode: ClimbingMode = {
  ascending: true,
  startingCell: 'S',
  endingCell: 'E',
};

// the problem seems to imply that the way to finish this problem is to explore all start points,
// that is, all cells with 'a', and see which is the shortest to the top. but this way is much easier:
// instead, do the exact same "climb", except descending from the finish point to the first 'a' you see.
// this is a BFS just like the ascending mode, meaning the first path we find is guaranteed shortest.
const descendingMode: ClimbingMode = {
  ascending: false,
  startingCell: 'E',
  endingCell: 'a',
};

// Part 1:
console.log(findShortestPathLength(ascendingMode));

// Part 2:
console.log(findShortestPathLength(descendingMode));
