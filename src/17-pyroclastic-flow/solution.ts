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
  [key: number]: Set<number>
}

const CHAMBER_MIN_X = 0;
const CHAMBER_MAX_X = 6;

const filename = path.join(__dirname, '../../src/17-pyroclastic-flow/input.txt');
const jetPattern = fs.readFileSync(filename, 'utf-8').split('\n')[0];
const chamber: Chamber = {
  0: new Set<number>([0, 1, 2, 3, 4, 5, 6])
};
const rocks: Rocks = [
  [{ x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }], // horizontal line
  [{ x: 3, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 3, y: 2 }], // plus
  [{ x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 2 }], // backwards L
  [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }], // vertical line
  [{ x: 2, y: 0 }, { x: 3, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 1 }], // square
];

const rockWillCollideVertically = (rock: Rock): boolean => {
  for (let i = 0; i < rock.length; i++) {
    const { x, y } = rock[i];
    const chamberRowBelow = chamber[y - 1];

    if (chamberRowBelow && chamberRowBelow.has(x)) {
      return true;
    }
  }

  return false;
};

const rockWillCollideHorizontally = (rock: Rock, offset: number): boolean => {
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

const pushRockWithGas = (rock: Rock, direction: Direction) => {
  if (direction === Direction.Left && !rockWillCollideHorizontally(rock, -1)) {
    return rock.map(coord => { return { x: coord.x - 1, y: coord.y } });
  } else if (direction === Direction.Right && !rockWillCollideHorizontally(rock, 1)) {
    return rock.map(coord => { return { x: coord.x + 1, y: coord.y } });
  }

  return rock;
};

const letRockFall = (rock: Rock) => {
  return rock.map(coord => { return { x: coord.x, y: coord.y - 1 } });
};

const getRockTowerHeight = (numRocksToDrop: number): number => {
  let maxHeight = 0;
  let jetPatternIndex = 0;

  for (let i = 0; i < numRocksToDrop; i++) {
    let rock = rocks[i % rocks.length].map(coord => { return { x: coord.x, y: coord.y + 4 + maxHeight } });

    while (true) {
      rock = pushRockWithGas(rock, jetPattern[jetPatternIndex % jetPattern.length] as Direction);
      jetPatternIndex++;

      if (rockWillCollideVertically(rock)) {
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