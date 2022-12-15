import * as path from 'path';
import * as fs from 'fs';

const filename = path.join(__dirname, '../../src/15-beacon-exclusion-zone/input.txt');
const data = fs.readFileSync(filename, 'utf-8').split('\n');

const calculateManhattanDistance = (
  point1x: number,
  point1y: number,
  point2x: number,
  point2y: number,
): number => {
  return Math.abs(point1x - point2x) + Math.abs(point1y - point2y);
};

let gridMinX = Infinity;
let gridMinY = Infinity;
let gridMaxX = -Infinity;
let gridMaxY = -Infinity;

const sensors = [];
const sensorPositions = new Set<string>();
const beaconPositions = new Set<string>();
const impossibleBeaconPositions = new Set<number>();
const inputRegex = /Sensor at x=(-?[\d]+), y=(-?[\d]+): closest beacon is at x=(-?[\d]+), y=(-?[\d]+)/;

const parseInput = () => {
  data.forEach(line => {
    const regexResult = line.match(inputRegex);
  
    if (regexResult) {
      const sensorX = parseInt(regexResult[1], 10);
      const sensorY = parseInt(regexResult[2], 10);
      const beaconX = parseInt(regexResult[3], 10);
      const beaconY = parseInt(regexResult[4], 10);
  
      const distanceBetween = calculateManhattanDistance(sensorX, sensorY, beaconX, beaconY);
  
      sensors.push(`${sensorX},${sensorY},${distanceBetween}`);
      sensorPositions.add(`${beaconX},${beaconY}`);
      beaconPositions.add(`${beaconX},${beaconY}`);
  
      if (sensorX - distanceBetween < gridMinX) {
        gridMinX = sensorX - distanceBetween;
      }
      if (sensorY - distanceBetween < gridMinY) {
        gridMinY = sensorY - distanceBetween;
      }
      if (gridMaxX < sensorX + distanceBetween) {
        gridMaxX = sensorX + distanceBetween;
      }
      if (gridMaxY < sensorY + distanceBetween) {
        gridMaxY = sensorY + distanceBetween;
      }
    }
  });
};

const findImpossibleBeaconPositionForRow = (row: number): number => {
  parseInput();

  for (let i = gridMinX; i <= gridMaxX; i++) {
    for (const sensor of sensors) {
      const [sensorX, sensorY, distanceToBeacon] = sensor.split(',').map((str: string) => parseInt(str, 10));
      const distanceFromCurPoint = calculateManhattanDistance(sensorX, sensorY, i, row);
  
      if (sensorPositions.has(`${i},${row}`)) {
        // space is already taken up by a sensor
        continue;
      }
  
      if (beaconPositions.has(`${i},${row}`)) {
        // space is already taken up by a beacon
        continue;
      }
  
      if (distanceFromCurPoint <= distanceToBeacon) {
        impossibleBeaconPositions.add(i);
      }
    }
  }
  
  return impossibleBeaconPositions.size;
};

// Part 1:
console.log(findImpossibleBeaconPositionForRow(2000000));
