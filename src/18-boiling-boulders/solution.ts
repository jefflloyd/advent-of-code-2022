import * as path from 'path';
import * as fs from 'fs';

type Faces = {
  [key: string]: number,
};

const filename = path.join(__dirname, '../../src/18-boiling-boulders/input.txt');
const data = fs.readFileSync(filename, 'utf-8').split('\n');

const parseInput = (): Faces => {
  const faces: Faces = {};

  data.forEach(line => {
    if (line.length) {
      const [x, y, z] = line.split(',').map((num: string) => parseInt(num, 10));
      const initialX = x - 1;
      const initialY = y - 1;
      const initialZ = z - 1;
  
      [
        `${initialX}-${initialY}-${initialZ};${x}-${y}-${initialZ}`,
        `${initialX}-${initialY}-${initialZ};${initialX}-${y}-${z}`,
        `${initialX}-${initialY}-${initialZ};${x}-${initialY}-${z}`,
        `${x}-${initialY}-${initialZ};${x}-${y}-${z}`,
        `${initialX}-${y}-${initialZ};${x}-${y}-${z}`,
        `${initialX}-${initialY}-${z};${x}-${y}-${z}`,
      ].forEach(face => {
        if (!faces[face]) {
          faces[face] = 0;
        }
  
        faces[face] += 1;
      });
    }
  });

  return faces;
}

const getNumOverlappingFaces = (): number => {
  const faces = parseInput();
  let nonOverlappingFaces = 0;
  
  for (const key in faces) {
    if (faces[key] === 1) {
      nonOverlappingFaces++;
    }
  }

  return nonOverlappingFaces;
}

// Part 1:
console.log(getNumOverlappingFaces());
