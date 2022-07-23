let probHumanRock = 0.3;
let probHumanPaper = 0.2;
let probHumanScissors = 0.166;
let probHumanSpock = 0.166;
let probHumanLizard = 0.166;
let probCompWin = 0;

for (let probCompRock = 0; probCompRock <= 100; probCompRock += 1) {
  for (let probCompPaper = 0; probCompPaper <= (100 - probCompRock); probCompPaper += 1) {
    for (let probCompScissors = 0; probCompScissors <= (100 - probCompRock - probCompPaper); probCompScissors += 1) {
      for (let probCompSpock = 0; probCompSpock <= (100 - probCompRock - probCompPaper - probCompScissors); probCompSpock += 1){
        let probCompLizard = 1 - probCompRock / 100 - probCompPaper / 100 - probCompScissors / 100 - probCompSpock / 100;
        console.log(probCompLizard);
        // let result = probHumanRock * (probCompPaper + probCompSpock) + probHumanPaper * (probCompScissors + probCompLizard) +
        //   probHumanScissors * (probCompRock + probCompSpock) + probHumanSpock * (probCompPaper + probCompLizard) +
        //   probHumanLizard * (probCompRock + probCompScissors);
        // if (result > probCompWin) {
        //   probCompWin = result;
        // }
      }
    }
  }
}

console.log(probCompWin);