import * as path from 'path';
import * as fs from 'fs';

enum Direction {
  Left = "<",
  Right = ">",
}

type Coordinate = {
  x: number,
  y: number,
};
type Rock = Array<Coordinate>;
type Rocks = Array<Rock>;
type Chamber = {
  [key: number]: Set<number>,
};

const CHAMBER_MIN_X = 0;
const CHAMBER_MAX_X = 6;

const filename = path.join(__dirname, '../../src/17-pyroclastic-flow/input.txt');
const jetPattern = fs.readFileSync(filename, 'utf-8').split('\n')[0];
const rocks: Rocks = [
  [{ x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }], // horizontal line
  [{ x: 3, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 3, y: 2 }], // plus
  [{ x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }], // backwards L
  [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }], // vertical line
  [{ x: 2, y: 0 }, { x: 3, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 1 }], // square
];

const rockWillCollideVertically = (rock: Rock, chamber: Chamber): boolean => {
  for (let i = 0; i < rock.length; i++) {
    const { x, y } = rock[i];
    const chamberRowBelow = chamber[y - 1];

    if (chamberRowBelow && chamberRowBelow.has(x)) {
      return true;
    }
  }

  return false;
};

const rockWillCollideHorizontally = (rock: Rock, offset: number, chamber: Chamber): boolean => {
  for (let i = 0; i < rock.length; i++) {
    const { x, y } = rock[i];
    const chamberRow = chamber[y];

    if (
      x + offset < CHAMBER_MIN_X ||
      x + offset > CHAMBER_MAX_X ||
      (chamberRow && chamberRow.has(x + offset))
    ) {
      return true;
    }
  }

  return false;
}

const pushRockWithGas = (rock: Rock, direction: Direction, chamber: Chamber) => {
  if (direction === Direction.Left && !rockWillCollideHorizontally(rock, -1, chamber)) {
    return rock.map(coord => { return { x: coord.x - 1, y: coord.y } });
  } else if (direction === Direction.Right && !rockWillCollideHorizontally(rock, 1, chamber)) {
    return rock.map(coord => { return { x: coord.x + 1, y: coord.y } });
  }

  return rock;
};

const letRockFall = (rock: Rock) => {
  return rock.map(coord => { return { x: coord.x, y: coord.y - 1 } });
};

const getStringRepresentation = (maxHeight: number, lookback: number, chamber: Chamber): string => {
  let string = '';

  for (let i = 0; i < lookback; i++) {
    for (let j = 0; j < 7; j++) {
      const chamberRow = chamber[maxHeight - i];

      if (chamberRow && chamberRow.has(j)) {
        string += '#';
      } else {
        string += '.';
      }
    }
  }

  return string;
};

const getRockTowerHeight = (numRocksToDrop: number): number => {
  const chamber: Chamber = {
    0: new Set<number>([0, 1, 2, 3, 4, 5, 6])
  };
  const cache = {};
  // i found that a lookback of 10 rows to consider two grids to be "the same" works for my input,
  // but it's possible this number would need to be much larger.
  const lookback = 10;

  let maxHeight = 0;
  let jetPatternOffset = 0;
  let checkCache = true;

  for (let i = 0; i < numRocksToDrop; i++) {
    const rockIndex = i % rocks.length;
    const cacheKey = `${rockIndex};${jetPatternOffset};${getStringRepresentation(maxHeight, lookback, chamber)}`;

    // running through the entire simulation takes too long for a trillion rocks. we solve this problem by
    // recognizing that there can be cycles that form within the simulation - i.e., we're going to drop a
    // rock of shape "A", while we're at an offset in the jet pattern "B", while the uppermost part of the grid
    // has a form of "C". if our state is the same, then we can skip through almost all rocks, adding the value of
    // maxHeight already computed and stored in the cache to our final height each time we speed through one cycle.
    if (checkCache && cache[cacheKey]) {
      const [heightAtCachedPosition, rocksDroppedAtCachedPosition] = cache[cacheKey].split(';');
      const heightDifferential = maxHeight - heightAtCachedPosition;
      const numRocksDifferential = i - rocksDroppedAtCachedPosition;
      const numTimesToFastForward = Math.floor((numRocksToDrop - i) / numRocksDifferential);
      const newI = i + numRocksDifferential * numTimesToFastForward;
      const newMaxHeight = maxHeight + heightDifferential * numTimesToFastForward;

      // we'll almost certainly need to finish the simulation partway through a cycle, so make sure that
      // the upper most rows of the chamber are populated properly so we can do collision detection
      for (let foo = 0; foo < lookback; foo++) {
        chamber[newMaxHeight - foo] = chamber[maxHeight - foo];
      }

      maxHeight = newMaxHeight;
      i = newI;
      checkCache = false;
    } else {
      cache[cacheKey] = `${maxHeight};${i}`;
    }

    let rock = rocks[rockIndex].map(coord => { return { x: coord.x, y: coord.y + 4 + maxHeight } });

    while (true) {
      jetPatternOffset = jetPatternOffset % jetPattern.length;
      rock = pushRockWithGas(rock, jetPattern[jetPatternOffset] as Direction, chamber);
      jetPatternOffset++;

      if (rockWillCollideVertically(rock, chamber)) {
        break;
      }

      rock = letRockFall(rock);
    }

    rock.forEach(coord => {
      const { x, y } = coord;

      if (!chamber[y]) {
        chamber[y] = new Set<number>();
      }

      chamber[y].add(x);

      const maxRockYCoord = Math.max(...rock.map(coord => coord.y));
      if (maxHeight < maxRockYCoord) {
        maxHeight = maxRockYCoord;
      }
    });
  }

  return maxHeight;
};

// Part 1:
console.log(getRockTowerHeight(2022));

// Part 2:
console.log(getRockTowerHeight(1e12));
