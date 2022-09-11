var countdownP = document.querySelector('header').children[1];
var cDown = document.querySelector('#countdownTag');
var codingQuiz = document.querySelector('#intro-page-title');
var startBtn = document.querySelector('#startBtn');
var submitHS = document.querySelector('#submitHighscoreBtn');
var viewHS = document.querySelector('#highscoresBtn');
var clearHS = document.querySelector('#clearHighscore')
var backHS = document.querySelector('#backBtn')
var answerList = document.querySelector('ul');


var questionsObj = {
    questions: [
        `JavaScript is an ____ language?`, 
        `Which of the following keywords is used to define a variable in Javascript?`, 
        `Upon encountering empty statements, what does the Javascript Interpreter do?`,
        `Which function is used to serialize an object into a JSON string in Javascript?`,
        `Arrays in JavaScript are defined by which of the following statements?`
    ],
    answers: [
        ['correct:Object-Oriented', `Object-Based`, `Procedural`, `None of the above`],
        [`var`, `let`, 'correct:var & let', `None of the above`],
        [`Throws an error`, 'correct:Ignores the statement', `Gives a warning`, `None of the above`],
        ['correct:stringify()', `parse()`, `convert()`, `None of the above`],
        ['correct:It is an ordered list of values', `It is an ordered list of objects`, `It is an ordered list of string`, `It is an ordered list of functions`]
    ]
}

var globalTimerPreset = 75;

var indexQuestions = 0;
var timeRemain = globalTimerPreset;
var score = 0;
var endGame = true;

function initGame() {
    timeRemain = globalTimerPreset;
    cDown.textContent = globalTimerPreset

    document.querySelector(`#submit-page`).style.display = `none`;

    codingQuiz.textContent = `Coding Quiz Challenge`;

    codingQuiz.style.display = `block`
    document.querySelector(`#intro-page-subtitle`).style.display = `block`;

    viewHS.style.display = `block`;
    
    startBtn.style.display = `block`;
    
    return;
}

function startGame() {
    gameEnded = false;
    questionIndexNumber = 0;

    viewHS.style.display = `none`;
    startBtn.style.display = `none`;
    document.querySelector(`#intro-page-subtitle`).style.display = `none`;
    countdownP.style.display = `block`;
    viewQuestion(questionIndexNumber);
    startTime();

}

function startTime() {
    var timeInterval = setInterval(function(){
        if(gameEnded === true){
            clearInterval(timeInterval);
            return;
        }
        if(timeRemain < 1) {
            clearInterval(timeInterval);
            gameHasEnded();
        }
        
        cDown.textContent = timeRemain;
        timeRemain--;
    }, 1000);

    return;
}

function viewQuestion(currentQuestionIndex) {
    codingQuiz.textContent = questionsObj.questions[currentQuestionIndex];
    createAnswerElements(currentQuestionIndex);
    return;
}

function createAnswerElements (currentQuestionIndex) {
    answerList.innerHTML = '';

    for(answerIndex = 0; answerIndex < questionsObj.answers[currentQuestionIndex].length; answerIndex++){
        var currentAnswerListItem = document.createElement('li');
        var tempStr = questionsObj.answers[currentQuestionIndex][answerIndex];

        if(questionsObj.answers[currentQuestionIndex][answerIndex].includes('correct:')){
            tempStr = questionsObj.answers[currentQuestionIndex][answerIndex].substring(8, questionsObj.answers[currentQuestionIndex][answerIndex].length);
            currentAnswerListItem.id = 'correct';
        }
        currentAnswerListItem.textContent = tempStr;
        answerList.appendChild(currentAnswerListItem)
    }

    return;

}

function nextQuestion() {
    questionIndexNumber++;
    if (questionIndexNumber >= questionsObj.questions.length) {
        gameHasEnded();    
    } else {
        viewQuestion(questionIndexNumber);
    }
    return;
}

function gameHasEnded() {
    gameEnded = true;
    score = timeRemain;

    countdownP.style.display = 'none';
    codingQuiz.style.display = 'none';
    answerList.innerHTML = '';

    document.querySelector('#scoreSpan').textContent = score;
    document.querySelector('#submit-page').style.display = 'flex';
    
    return;
}

function trueAnswer(event) {
    if(event.target != answerList) {

        if (!(event.target.id.includes('correct'))){
            timeRemain -= 10;
        }
        nextQuestion();
    }

    return;
}

function scoreAndName() {
    var scoreInputBox = document.querySelector('input');
    var tempArrayOfObjects = [];

    if (scoreInputBox.value != '' || scoreInputBox.value != null) {
        var storageArray = {
            initials: scoreInputBox.value,
            scores: score,
        }
        if(window.localStorage.getItem('highscores') == null) {
            tempArrayOfObjects.push(storageArray);
            window.localStorage.setItem('highscores', JSON.stringify(tempArrayOfObjects));

        }else {
            tempArrayOfObjects = JSON.parse(window.localStorage.getItem('highscores'));

            for(i = 0; i <= tempArrayOfObjects.length; i++){
                if(i == tempArrayOfObjects.length) {
                    tempArrayOfObjects.push(storageArray)
                    break;
                } else if (tempArrayOfObjects[i].scores < score) {
                    tempArrayOfObjects.splice[i, 0, storageArray];
                    break;
                }
            }
            window.localStorage.setItem('highscores', JSON.stringify (tempArrayOfObjects))
        }
        document.querySelector('input').value = '';
        score = 0

        displayHighscores();

    }
    return;
}

function displayHighscores(){

    codingQuiz.style.display = "none";
    startBtn.style.display = 'none';
    document.querySelector('header').children[0].style.display = 'none';
    document.querySelector('#intro-page-title').style.display = 'none';
    document.querySelector('#submit-page').style.display = 'none';

    document.querySelector('#highscore-page').style.display = 'block';

    tempOl = document.querySelector('ol');
    tempOl.innerHTML = ''

    tempArrayOfObjects = JSON.parse(window.localStorage.getItem('highscores')); 
    if (tempArrayOfObjects != null) {
        for ( i = 0; i < tempArrayOfObjects; i++) {
            var newLi = document.createElement('li')
            newLi.textContent = tempArrayOfObjects[i].names + ' - ' + tempArrayOfObjects[i].scores;
            tempOl.appendChild(newLi);
        }

    } else {
        var newLi = document.createElement('p');
        newLi.textContent = 'No Hihscores';
        tempOl.appendChild(newLi);
    
    }

    return;
}

function begin() {
    startBtn.addEventListener('click' , startGame);
    answerList.addEventListener('click' , trueAnswer);
    viewHS.addEventListener('click' , displayHighscores);
    submitHS.addEventListener('click' , scoreAndName);
    clearHS.addEventListener('click' , clearHighscores);
    backHS,addEventListener('click' , setUpGame);

    setUpGame();

    return;

}

 begin();
