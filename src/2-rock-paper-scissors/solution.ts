import * as path from 'path';
import * as fs from 'fs';

enum ABCChoice {
  Rock = "A",
  Paper = "B",
  Scissors = "C",
}

enum XYZChoice {
  Rock = "X",
  Paper = "Y",
  Scissors = "Z",
}

enum NeededResult {
  Lose = "X",
  Draw = "Y",
  Win = "Z",
}

const filename = path.join(__dirname, '../../src/2-rock-paper-scissors/input.txt');
const data = fs.readFileSync(filename, 'utf-8').split('\n');

let totalScoreWithChoiceInterpretation = 0;
let totalScoreWithResultInterpretation = 0;

const calculateRoundScoreWithChoiceInterpretation = (opponentChoice: ABCChoice, myChoice: XYZChoice): number => {
  let roundScore = 0;

  if (myChoice === XYZChoice.Rock) {
    roundScore += 1;
  } else if (myChoice === XYZChoice.Paper) {
    roundScore += 2;
  } else {
    roundScore += 3;
  }

  if ((opponentChoice === ABCChoice.Rock && myChoice === XYZChoice.Paper) ||
      (opponentChoice === ABCChoice.Paper && myChoice === XYZChoice.Scissors) ||
      (opponentChoice === ABCChoice.Scissors && myChoice === XYZChoice.Rock)) {
    roundScore += 6;
  } else if ((opponentChoice === ABCChoice.Rock && myChoice === XYZChoice.Rock) ||
      (opponentChoice === ABCChoice.Paper && myChoice === XYZChoice.Paper) ||
      (opponentChoice === ABCChoice.Scissors && myChoice === XYZChoice.Scissors)) {
    roundScore += 3;
  }

  return roundScore;
};

const calculateRoundScoreWithResultInterpretation = (opponentChoice: ABCChoice, neededResult: NeededResult): number => {
  let roundScore = 0;
  let myChoice: ABCChoice;

  if (neededResult === NeededResult.Draw) {
    roundScore += 3;
    myChoice = opponentChoice;
  } else if (neededResult === NeededResult.Win) {
    roundScore += 6;
    if (opponentChoice === ABCChoice.Rock) {
      myChoice = ABCChoice.Paper;
    } else if (opponentChoice === ABCChoice.Paper) {
      myChoice = ABCChoice.Scissors;
    } else {
      myChoice = ABCChoice.Rock;
    }
  } else {
    if (opponentChoice === ABCChoice.Rock) {
      myChoice = ABCChoice.Scissors;
    } else if (opponentChoice === ABCChoice.Paper) {
      myChoice = ABCChoice.Rock;
    } else {
      myChoice = ABCChoice.Paper;
    }
  }

  if (myChoice === ABCChoice.Rock) {
    roundScore += 1;
  } else if (myChoice === ABCChoice.Paper) {
    roundScore += 2;
  } else {
    roundScore += 3;
  }

  return roundScore;
};

data.forEach(line => {
  if (line.length) {
    const splitLine = line.split(' ');
    const opponentChoice = splitLine[0] as ABCChoice;
    const myChoice = splitLine[1] as XYZChoice;
    const neededResult = splitLine[1] as NeededResult;

    totalScoreWithChoiceInterpretation += calculateRoundScoreWithChoiceInterpretation(opponentChoice, myChoice);
    totalScoreWithResultInterpretation += calculateRoundScoreWithResultInterpretation(opponentChoice, neededResult);
  }
});

// Part 1:
console.log(totalScoreWithChoiceInterpretation);

// Part 2:
console.log(totalScoreWithResultInterpretation);
