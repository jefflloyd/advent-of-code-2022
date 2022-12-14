import * as path from 'path';
import * as fs from 'fs';

type PacketFragment = Array<number | PacketFragment>;

enum Result {
  True,
  False,
  Undetermined,
}

const filename = path.join(__dirname, '../../src/13-distress-signal/input.txt');
const data = fs.readFileSync(filename, 'utf-8').split('\n');

const findClosingBracketPosition = (string: string): number => {
  let openBrackets = 1;

  for (let i = 1; i < string.length; i++) {
    if (string[i] === '[') {
      openBrackets++;
    } else if (string[i] === ']') {
      openBrackets--;
    }

    if (openBrackets === 0) {
      return i;
    }
  }
};

// update: i looked at some others' solutions after finishing both parts, and realized
// that i could use `JSON.parse` instead of writing all this crazy parsing logic. whoops!
// leaving it the way it is because it works fine, but silly mistake on my part.
const parsePacket = (string: string): PacketFragment => {
  const packet: PacketFragment = [];

  for (let i = 0; i < string.length; i++) {
    const currentCharacter = string[i];

    if (currentCharacter === ',') {
      continue;
    } else if (currentCharacter === '[') {
      const closingBracketPosition = i + findClosingBracketPosition(string.slice(i));
      const subarray = parsePacket(string.slice(i + 1, closingBracketPosition));
      packet.push(subarray);
      i = closingBracketPosition;
    } else {
      const nextCommaPosition = string.indexOf(',', i);
      // the last number in an array won't have a comma after it
      const number = nextCommaPosition === -1
        ? parseInt(string.slice(i))
        : parseInt(string.slice(i, nextCommaPosition), 10);

      packet.push(number);
      
      if (nextCommaPosition !== -1) {
        i = nextCommaPosition;
      }
    }
  }

  return packet;
};

const arePacketsInCorrectOrder = (packetOne: PacketFragment, packetTwo: PacketFragment): Result => {
  for (let i = 0; i < packetOne.length; i++) {
    let packetOneItem = packetOne[i];
    let packetTwoItem = packetTwo[i];

    // if packet two is undefined, then the result has been indeterminate until now, but
    // packet one has more items than packet two, so they aren't in the right order.
    if (!packetTwoItem) {
      return Result.False;
    }

    if (Array.isArray(packetOneItem) && !Array.isArray(packetTwoItem)) {
      packetTwoItem = [packetTwoItem];
    } else if (Array.isArray(packetTwoItem) && !Array.isArray(packetOneItem)) {
      packetOneItem = [packetOneItem]
    }

    if (Array.isArray(packetOneItem) && Array.isArray(packetTwoItem)) {
      const result = arePacketsInCorrectOrder(packetOneItem, packetTwoItem);
      
      if (result !== Result.Undetermined) {
        return result;
      }
    } else {
      if (packetOneItem === packetTwoItem) {
        continue;
      } else if (packetOneItem < packetTwoItem) {
        return Result.True;
      } else {
        return Result.False;
      }
    }
  }

  // if we evaluated the whole two packets without an explicit winner, then see if packetOne
  // ran out of items first. if it did, then they are in the right order.
  if (packetOne.length < packetTwo.length) {
    return Result.True;
  }

  return Result.Undetermined;
};

let sumOfIndicesOfCorrectlyOrderedPairs = 0;
const allPackets: Array<PacketFragment> = [[[2]], [[6]]];

for (let i = 0; i < data.length; i += 3) {
  const firstPacket = parsePacket(data[i].slice(1, data[i].length - 1));
  const secondPacket = parsePacket(data[i + 1].slice(1, data[i + 1].length - 1));

  allPackets.push(...[firstPacket, secondPacket]);

  if (arePacketsInCorrectOrder(firstPacket, secondPacket) === Result.True) {
    sumOfIndicesOfCorrectlyOrderedPairs += (i / 3) + 1;
  }
}

allPackets.sort((packetOne: PacketFragment, packetTwo: PacketFragment): number => {
  if (arePacketsInCorrectOrder(packetOne, packetTwo) === Result.True) {
    return -1;
  } else {
    return 1;
  }
});

const decoderKey2Index = allPackets.findIndex(packet => JSON.stringify(packet) === '[[2]]') + 1;
const decoderKey6Index = allPackets.findIndex(packet => JSON.stringify(packet) === '[[6]]') + 1;

// Part 1:
console.log(sumOfIndicesOfCorrectlyOrderedPairs);

// Part 2:
console.log(decoderKey2Index * decoderKey6Index);
