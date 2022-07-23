/* PACKAGES SECTION */
// this package lets us spice up the display a little bit
const asciiTextGenerator = require('ascii-text-generator');

// and readline-sync for console input
const readline = require("readline-sync");

const RPSSLGame = {
  human: createHuman(),
  computer: createComputer(),
  bigMessages: getBigMessages(),
  plainMessages: getPlainMessages(),
  gameType: null,
  difficulty: null,
  moveHistory: [1, 1, 1, 1, 1], // each move must be initialized to 1 so that there is a non-zero probability of the computer selecting it

  chooseGame() {
    let choice = readline.question(this.plainMessages.start);
    while (choice !== '1' && choice !== '2') {
      choice = readline.question(this.plainMessages.invalid);
    }
    this.gameType = choice;
  },

  chooseDifficulty() {
    console.clear();
    let choice = readline.question(this.plainMessages.difficulty);
    while (choice !== '1' && choice !== '2') {
      choice = readline.question(this.plainMessages.invalid);
    }
    this.difficulty = choice;
  },

  displayLarge(text) {
    let message = "\n" + asciiTextGenerator(text, "2") + "\n";
    console.log(message);
  },

  displayWinnerSmall(winner) {
    if (winner === 'player') {
      console.log('Player won.\n');
    }
    if (winner === 'computer') {
      console.log('Computer won.\n');
    }
    if (winner === 'tie') {
      console.log('Tie.\n');
    }
  },
  
  displayWinnerLarge(winner) {    
    if (winner === 'player') {
      this.displayLarge(this.bigMessages.victory);
    }
    if (winner === 'computer') {
      this.displayLarge(this.bigMessages.defeat);
    }
    if (winner === 'tie') {
      this.displayLarge(this.bigMessages.tie);
    }
  },

  // return winner of single match
  getWinnerSingle() {
    switch (true) {
      case (this.human.move === 'rock' && (this.computer.move === 'scissors' || this.computer.move === 'lizard')):
      case (this.human.move === 'paper' && (this.computer.move === 'rock' || this.computer.move === 'Spock')):
      case (this.human.move === 'scissors' && (this.computer.move === 'paper' || this.computer.move === 'lizard')):
      case (this.human.move === 'Spock' && (this.computer.move === 'rock' || this.computer.move === 'scissors')):
      case (this.human.move === 'lizard' && (this.computer.move === 'paper' || this.computer.move === 'Spock')):
        return 'player';
      case (this.human.move === this.computer.move):
        return 'tie';
      default:
        return 'computer';
    }
  },

  displayCurrentTally(winner) {
    if (winner === 'player') {
      this.human.wins += 1;
    } else if (winner == 'computer') {
      this.computer.wins += 1;
    }
    console.log(`Current tally is player: ${this.human.wins}, computer: ${this.computer.wins}.\n`);
  },

  getWinnerFive() {
    if (this.human.wins > this.computer.wins) {
      return 'player';
    } else {
      return 'computer';
    }
  },

  playOne() {
    // this ensures that the computer's first move is random if no move history yet exists
    if (this.difficulty === '1' || Math.max(...this.moveHistory) === 1) {
      this.computer.chooseBasic(); 
    } else {
      this.computer.chooseAdvanced(this);
    }

    this.human.choose(this); 
    let winner = this.getWinnerSingle();

    console.clear();
    console.log(`Computer chose ${this.computer.move}.`);
    console.log(`Player chose ${this.human.move}.`);

    if (this.gameType === '1') {
      this.displayWinnerLarge(winner); 
    } else {
      this.displayWinnerSmall(winner); // TO DO
      this.displayCurrentTally(winner); 
    }
  },

  playFive() {
    while (this.human.wins + this.computer.wins < 5) {
      this.playOne();
    }
    
    let winner = this.getWinnerFive();
    this.displayWinnerLarge(winner);
    this.human.wins = 0;
    this.computer.wins = 0;
  },

  playAgain() {
    console.log('Would you like to play again? (y/n)');
    let answer = readline.question();
    return answer.toLowerCase()[0] === 'y';
  },

  play() {
    console.clear();
    this.displayLarge(this.bigMessages.welcome);

    while (true) {
      this.chooseGame();
      console.clear();
      this.chooseDifficulty();
      console.clear();

      if (this.gameType === '1') {
        this.playOne();
      } else {
        this.playFive();
      }  

      if (!this.playAgain()) break;
      console.clear();
    }
    // console.clear();
    this.displayLarge(this.bigMessages.goodbye);
  },
};


RPSSLGame.play();


/* FACTORY FUNCTIONS TO MINIMIZE CLUTTER IN ENGINE OBJECT */

function getBigMessages() {
  return {
    welcome: "welcome to rpssl",
    victory: "awesome you won",
    defeat: "darn you lost",
    tie: "it was a tie",
    goodbye: "thanks for playing"
  };
}

function getPlainMessages() {
  return {
    start: "Welcome player! Choose one of the following options:\n1) Single game\n2) Best of five\n",
    difficulty: "Select difficulty level:\n1) Basic\n2) Advanced\n",
    choose: "Choose your weapon!\n1)rock\n2)paper\n3)scissors\n4)spock\n5)lizard\n",
    invalid: "Your choice is not logical. Please select one of the options listed above.\n"
  };
}

function createPlayer() {
  return {
    choices: ['rock', 'paper', 'scissors', 'Spock', 'lizard'],
    move: null,
    wins: 0,
  };
}

function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    chooseBasic() {
      let randomIndex = Math.floor(Math.random() * this.choices.length);
      this.move = this.choices[randomIndex];
    },

    chooseAdvanced(obj) {
      // get historical probability of each possible move by human player
      let history = obj.moveHistory;
      let sum = history.reduce((prev, curr) => prev + curr);
      let probHumanRock = history[0] / sum;
      let probHumanPaper = history[1] / sum;
      let probHumanScissors = history[2] / sum;
      let probHumanSpock = history[3] / sum;
      let probHumanLizard = history[4] / sum;

      // determine probabilities of win for each choice assuming continuation of historic pattern
      let winProbs = [
        probHumanScissors + probHumanLizard, // prob that choice of rock leads to win
        probHumanRock + probHumanSpock, // prob that choice of paper leads to win
        probHumanPaper + probHumanLizard, // prob that choice of scissors leads to win
        probHumanRock + probHumanScissors, // prob that choice of Spock leads to win
        probHumanPaper + probHumanSpock // prob that choice of lizard leads to win
      ]

      let index = winProbs.findIndex((prob, _, arr) => prob === Math.max(...arr));
      this.move = this.choices[index];
    }
  };

  return Object.assign(playerObject, computerObject);
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose(obj) {
      let choice = readline.question(obj.plainMessages.choose);
      let index = null; // we'll be incrementing one of the values of the RPSSLGame.moveHistory array

      while (!(Number(choice) >= 1 && Number(choice) <= 5) || choice.length > 1) {
        choice = readline.question(obj.plainMessages.invalid);
      }

      index = Number(choice) - 1;
      this.move = this.choices[index];
      obj.moveHistory[index] += 1;
    },
  };

  return Object.assign(playerObject, humanObject);
}