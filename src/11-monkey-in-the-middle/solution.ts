import * as path from 'path';
import * as fs from 'fs';

enum Operation {
  Add = "+",
  Multiply = "*",
}

type Monkey = {
  id: number;
  startingItems: Array<number>;
  operation: Operation;
  operand: number | "old";
  testOperand: number;
  trueCaseMonkeyDestination: number;
  falseCaseMonkeyDestination: number;
  inspectedItemCount: number;
};

const filename = path.join(__dirname, '../../src/11-monkey-in-the-middle/input.txt');
const data = fs.readFileSync(filename, 'utf-8').split('\n');

const monkeysFor20Rounds: Array<Monkey> = [];
const monkeysFor10000Rounds: Array<Monkey> = [];

// lots of assumptions being made with regard to data input.
// not handling every case here intentionally - e.g., "operation"
// is always in the form "new = old [+ or *] [number or old]",
// so don't worry about something like "5 * old = new" showing up.
for (let i = 0; i < data.length; i += 7) {
  const startingItems = data[i + 1].split(':')[1].split(',').map(number => parseInt(number.trim()));
  const rightSideExpression = data[i + 2].split('=')[1].trim();
  const operation = rightSideExpression.includes(Operation.Multiply) ? Operation.Multiply : Operation.Add;
  const operandAsString = operation === Operation.Multiply
    ? rightSideExpression.split(Operation.Multiply)[1].trim()
    : rightSideExpression.split(Operation.Add)[1].trim();
  const operand = operandAsString === 'old' ? 'old' : parseInt(operandAsString, 10);
  const testOperand = parseInt(data[i + 3].split('divisible by')[1].trim());
  const trueCaseMonkeyDestination = parseInt(data[i + 4].split('monkey')[1].trim(), 10);
  const falseCaseMonkeyDestination = parseInt(data[i + 5].split('monkey')[1].trim(), 10);

  const newMonkey: Monkey = {
    id: i / 7,
    startingItems,
    operation,
    operand,
    testOperand,
    trueCaseMonkeyDestination,
    falseCaseMonkeyDestination,
    inspectedItemCount: 0,
  };

  monkeysFor20Rounds.push(newMonkey);
  // tricky! we need to make sure we're getting a totally new instance of the array,
  // or else running the first round will interfere with the second.
  monkeysFor10000Rounds.push(Object.assign({}, newMonkey, {
    startingItems: startingItems.slice(),
  }));
}

const runMonkeyRound = (monkeys: Array<Monkey>, useSimpleWorryLevelReduction: boolean): void => {
  const smallestCommonFactor = monkeys
    .map(monkey => monkey.testOperand)
    .reduce((prev, curr) => prev * curr, 1);

  monkeys.forEach(monkey => {
    while (monkey.startingItems.length) {
      monkey.inspectedItemCount++;

      let itemWorryLevel = monkey.startingItems.shift();

      const operand = monkey.operand === 'old'
        ? itemWorryLevel
        : monkey.operand;

      itemWorryLevel = monkey.operation === Operation.Multiply
        ? itemWorryLevel * operand
        : itemWorryLevel + operand;

      if (useSimpleWorryLevelReduction) {
        itemWorryLevel = Math.floor(itemWorryLevel / 3);
      // without the flat division by 3, the numbers get too large too quickly for the number
      // of rounds we're running. since we're always checking which monkey to throw to based
      // on a division operation, we can modulo the worry level by the smallest common factor
      // for ALL monkeys. this effectively scales it down each iteration without changing the
      // outcome of the division, since we're scaling it in a way that's compatible with all
      // divisors the monkeys might use.
      } else {
        itemWorryLevel = itemWorryLevel % smallestCommonFactor;
      }

      if (itemWorryLevel % monkey.testOperand === 0) {
        monkeys[monkey.trueCaseMonkeyDestination].startingItems.push(itemWorryLevel);
      } else {
        monkeys[monkey.falseCaseMonkeyDestination].startingItems.push(itemWorryLevel);
      }
    }
  });
};

for (let i = 0; i < 20; i++) {
  runMonkeyRound(monkeysFor20Rounds, true);
}

for (let i = 0; i < 10000; i++) {
  runMonkeyRound(monkeysFor10000Rounds, false);
}

const sortFn = (a: number, b: number) => a > b ? -1 : 1;
const sorted20RoundCounts = monkeysFor20Rounds.map(monkey => monkey.inspectedItemCount).sort(sortFn);
const sorted10000RoundCounts = monkeysFor10000Rounds.map(monkey => monkey.inspectedItemCount).sort(sortFn);

// Part 1:
console.log(sorted20RoundCounts[0] * sorted20RoundCounts[1]);

// Part 2:
console.log(sorted10000RoundCounts[0] * sorted10000RoundCounts[1]);
