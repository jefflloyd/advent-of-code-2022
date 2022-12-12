import * as path from 'path';
import * as fs from 'fs';

type TwoDNumericArray = Array<Array<number>>;

const filename = path.join(__dirname, '../../src/08-treetop-tree-house/input.txt');
const data = fs.readFileSync(filename, 'utf-8').split('\n');
const grid: TwoDNumericArray = [];
const scenicScores: TwoDNumericArray = [];

data.forEach(line => {
  const row = line.split('').map(char => parseInt(char, 10));
  if (row.length) {
    grid.push(row);
  }
});

const canSeeToEdge = (tree: number, otherTrees: Array<number>): boolean => {
  return tree > Math.max(...otherTrees);
};

const numTreesUntilBlocked = (tree: number, otherTrees: Array<number>): number => {
  const indexOfTallerTree = otherTrees.findIndex(otherTree => otherTree >= tree);

  if (indexOfTallerTree === -1) {
    return otherTrees.length;
  }

  // we need to include the tree that is taller than us
  return indexOfTallerTree + 1;
};

let numVisibleTrees = 0;

grid.forEach((row, rowIndex) => {
  scenicScores.push([]);

  row.forEach((tree, columnIndex) => {
    if (rowIndex === 0 || rowIndex === grid.length - 1 || columnIndex === 0 || columnIndex === row.length - 1) {
      numVisibleTrees++;
      scenicScores[rowIndex].push(0);
    } else {
      // the .reverse() is really only used for part 2; doesn't affect part 1
      const treesToTheNorth = grid.map(row => row[columnIndex]).slice(0, rowIndex).reverse();
      const treesToTheWest = row.slice(0, columnIndex).reverse();
      const treesToTheEast = row.slice(columnIndex + 1);
      const treesToTheSouth = grid.map(row => row[columnIndex]).slice(rowIndex + 1);

      const canSeeNorthEdge = canSeeToEdge(tree, treesToTheNorth);
      const canSeeWestEdge = canSeeToEdge(tree, treesToTheWest);
      const canSeeEastEdge = canSeeToEdge(tree, treesToTheEast);
      const canSeeSouthEdge = canSeeToEdge(tree, treesToTheSouth);

      if (
        canSeeNorthEdge || canSeeWestEdge || canSeeEastEdge || canSeeSouthEdge
      ) {
        numVisibleTrees++;
      }

      const numTreesUntilBlockedToTheNorth = numTreesUntilBlocked(tree, treesToTheNorth);
      const numTreesUntilBlockedToTheWest = numTreesUntilBlocked(tree, treesToTheWest);
      const numTreesUntilBlockedToTheEast = numTreesUntilBlocked(tree, treesToTheEast);
      const numTreesUntilBlockedToTheSouth = numTreesUntilBlocked(tree, treesToTheSouth);

      scenicScores[rowIndex].push(
        numTreesUntilBlockedToTheNorth * numTreesUntilBlockedToTheWest * numTreesUntilBlockedToTheEast * numTreesUntilBlockedToTheSouth
      );
    }
  });
});

// Part 1:
console.log(numVisibleTrees);

// Part 2:
console.log(Math.max(...scenicScores.flat()));
