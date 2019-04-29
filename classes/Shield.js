import constants from './constants.js';

export class Shield {
    constructor(position, enemyBound) {
        this.position = position;
        this.enemyBound = enemyBound;


        // Pick a random type of question
        let numOfTypes = 2;
        let val = Math.floor(Math.random() * numOfTypes);
        let obj;
        switch (val) {
            case 0:
                // sin, cos and tan
                obj = sctQuestion();
                break;
            case 1:
                // Pythagoras
                obj = pythagQuestion();
                break;
        }
        this.question = obj.question;
        this.answers = obj.answers;
    }


    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, constants.tileWidth * 5 / 8, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = "rgba(104, 151, 187, 0.6)";
        ctx.fill();

        // A blue transparent circle at its position
    }

    checkAnswer(answer) {
        return this.answers.includes(answer);
        // if the array contains the answer given, it will 
        // return true (correct), otherwise false (incorrect)
    }
}

function sctQuestion() { // Sin, cos or tan question
    let possibles = [0, 30, 45, 60, 90];
    // The common known degree values 
    // of the sin cos and tan functions
    let degreeNum = possibles[Math.floor(Math.random() * possibles.length)];
    // Pick a random one

    let value = Math.floor(Math.random() * (degreeNum != 90 ? 3 : 2));
    // Pick a random value, 0, 1 or 2, but not 2 if the degree is 90
    // As 2 corresponds to tan in the array below, and tan 90 is undefined.
    let sinCosTan = ['sin', 'cos', 'tan'][value];
    // Get the string value of sin cos or tan


    let answer = Math[sinCosTan](degreeNum * Math.PI / 180);
    // Find the answer, by calling the corresponding function and converting degrees to radians

    answer = Math.round(answer * 100000) / 100000;
    // Round to ensure errors in calculation are irrelevant
    answer = answer.toString();
    // Convert answers to strings so answers supplied can be found in the array
    let question = `What is the value of ${sinCosTan}(${degreeNum})?`;
    return {
        question,
        answers: [answer]
    };
}

function pythagQuestion() {
    let possibles = [
        ["3", "4", "5"],
        ["5", "12", "13"],
        ["8", "15", "17"]
    ]; // Pythagorean triples

    let triple = possibles[Math.floor(Math.random() * possibles.length)];
    // Choose a random triple

    let index = Math.floor(Math.random() * 3);
    // choose a random index

    let answers = triple.splice(index, 1);
    // Remove the value at that index.
    // splice returns an array of values it deleted
    // so answers can be set to it

    let descriptor;
    switch (index) {
        case 0:
            descriptor = "smallest";
            // If it is the first value, it's the smallest
            break;
        case 1:
            descriptor = "middle-lengthed";
            // second = middle
            break;
        case 2:
            descriptor = "longest";
            // third = largest
            break;
    }
    let question = `A right-angled triangle has lengths ${triple.join(' and ')}. What is the length of the ${descriptor} side?`;
    return {
        question,
        answers
    };
}
