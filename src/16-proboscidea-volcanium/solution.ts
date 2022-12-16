import * as path from 'path';
import * as fs from 'fs';

type ValveId = string;

type Valve = {
  id: ValveId,
  flowRate: number,
  connectedValves: Array<string>,
};

type ValvesState = {
  currentValve: Valve,
  closedValves: Array<ValveId>,
  openValves: Array<ValveId>,
  pressureReleased: number,
  minutesRemaining: number,
  previousValve: ValveId | null,
};

const filename = path.join(__dirname, '../../src/16-proboscidea-volcanium/input.txt');
const data = fs.readFileSync(filename, 'utf-8').split('\n');

const parseInput = (): Array<Valve> => {
  const valves: Array<Valve> = [];
  const inputRegex = /Valve ([\w]{2}) has flow rate=([\d]+); tunnels? leads? to valves? (([\w]{2},? ?)+)/;

  data.forEach(line => {
    const regexResult = line.match(inputRegex);
  
    if (regexResult) {
      const valveId = regexResult[1];
      const flowRate = parseInt(regexResult[2], 10);
      const connectedValves = regexResult[3].split(', ');
  
      valves.push({
        id: valveId,
        flowRate,
        connectedValves,
      });
    }
  });

  return valves;
};

const runSimulation = (valves: Array<Valve>): Array<number> => {
  const initialState: ValvesState = {
    currentValve: valves.find(valve => valve.id === 'AA'),
    closedValves: valves.map(valve => valve.id),
    openValves: [],
    pressureReleased: 0,
    minutesRemaining: 30,
    previousValve: null,
  };
  const queue: Array<ValvesState> = [initialState];
  const finishedPressures: Array<number> = [];

  // keeps track of max pressure relieved for a current valve / closed valves / minutes left triplet
  const memoized1 = {};
  // keeps track of max minutes left for a current valve / closed valves / pressure relieved triplet
  const memoized2 = {};

  while (queue.length) {
    const currentState = queue.shift();
    const {
      currentValve,
      closedValves,
      openValves,
      pressureReleased,
      minutesRemaining,
      previousValve,
    } = currentState;
  
    // if we are at the same valve state with less pressure relieved than our max
    // for the current time, then there's no point continuing with this state
    const key = `${currentValve.id};${closedValves.sort()};${minutesRemaining}`; 
    if (memoized1[key] > pressureReleased) {
      continue;
    } else {
      memoized1[key] = pressureReleased;
    }
  
    // similarly, if we are at the same valve state with fewer minutes left than our max
    // with the same amount of pressure relieved, then there's no point continuing with this state
    const key2 = `${currentValve.id};${closedValves.sort()};${pressureReleased}`; 
    if (memoized2[key2] > minutesRemaining) {
      continue;
    } else {
      memoized2[key2] = minutesRemaining;
    }
  
    // done if we're out of time or there aren't any more valves we could open
    if (minutesRemaining === 1 || closedValves.length === 0) {
      finishedPressures.push(pressureReleased);
      continue;
    }
  
    const indexOfCurrentValveInClosedArray = closedValves.findIndex(valveId => valveId === currentValve.id);
    if (
      // if this valve is already open, we can't open it
      indexOfCurrentValveInClosedArray > -1 &&
      // if this valve has a flow rate of 0, we can't open it
      currentValve.flowRate !== 0
    ) {
      // open this valve
      queue.push({
        currentValve,
        closedValves: [].concat(closedValves.slice(0, indexOfCurrentValveInClosedArray), closedValves.slice(indexOfCurrentValveInClosedArray + 1)),
        openValves: [].concat(...openValves, closedValves[indexOfCurrentValveInClosedArray]),
        pressureReleased: pressureReleased + currentValve.flowRate * (minutesRemaining - 1),
        minutesRemaining: minutesRemaining - 1,
        previousValve: null,
      });
    }
  
    currentValve.connectedValves.forEach(connectedValve => {
      // move to a connected valve
      if (!previousValve || previousValve !== connectedValve) { 
        queue.push({
          currentValve: valves.find(valve => valve.id === connectedValve),
          closedValves,
          openValves,
          pressureReleased,
          minutesRemaining: minutesRemaining - 1,
          previousValve: currentValve.id,
        });
      }
    });
  }

  return finishedPressures;
};

const getMaximumPressureRelieved = () => {
  const valves = parseInput();
  const finishedSimulations = runSimulation(valves);

  // Math.max() exceeds the callstack with as many array items as we have!
  return finishedSimulations.reduce((max, v) => max >= v ? max : v, -Infinity);
};

// Part 1:
console.log(getMaximumPressureRelieved());
