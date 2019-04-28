import constants from './constants.js';

export class Shield {
    constructor(position, enemyBound) {
        this.position = position;
        this.enemyBound = enemyBound;

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
    }

    checkAnswer(answer) {
        return this.answers.includes(answer);
    }
}

function sctQuestion() {
    let possibles = [0, 30, 45, 60, 90];
    let degreeNum = possibles[Math.floor(Math.random() * possibles.length)];

    let value = Math.floor(Math.random() * (degreeNum != 90 ? 3 : 2));
    let sinCosTan = ['sin', 'cos', 'tan'][value];
    let answer = Math[sinCosTan](degreeNum * Math.PI / 180);
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
    let index = Math.floor(Math.random() * 3);
    let answers = triple.splice(index, 1);
    let descriptor;
    switch (index) {
        case 0:
            descriptor = "smallest";
            break;
        case 1:
            descriptor = "middle-lengthed";
            break;
        case 2:
            descriptor = "longest";
            break;
    }
    let question = `A right-angled triangle has lengths ${triple.join(' and ')}. What is the length of the ${descriptor} side?`;
    return {
        question,
        answers
    };
}
