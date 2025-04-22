let player1Name = "";
let player2Name = "";

let questions = [];
let currentQuestionIndex = 0;

let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1;
let selectedOption = "";


let categorySelectionSection = document.getElementById("category-selection-section");
let questionDisplaySection = document.getElementById("question-display-section");
let categoryDropdown = document.getElementById("category-dropdown");
let continueGameAndEndGameSection = document.getElementById("continue-game-and-end-game-section");

const difficultyRating = {
    easy: 10,
    medium: 15,
    hard: 20
};

let startGameButton = document.getElementById("start-game");
startGameButton.addEventListener("click", function () {

    player1Name = document.getElementById("input-player1-name").value;
    player2Name = document.getElementById("input-player2-name").value;

    let playerSection = document.getElementById("player-section");
    playerSection.style.display = "none";

    categorySelectionSection.style.display = "block";

    let player1NameDisplay = document.getElementById("player1-name-display");
    player1NameDisplay.textContent = `First Player is: ${player1Name}`;
    let player2NameDisplay = document.getElementById("player2-name-display");
    player2NameDisplay.textContent = `Second Player is: ${player2Name}`;

});

let selectCategoryButton = document.getElementById("select-category-button");
selectCategoryButton.addEventListener("click", function () {

    let selectedCategory = categoryDropdown.value;
    categoryDropdown.remove(categoryDropdown.selectedIndex);

    categorySelectionSection.style.display = "none";
    questionDisplaySection.style.display = "block";
    fetchQuestions(selectedCategory);
});

function fetchQuestions(category) {
    const easy1Url = `https://the-trivia-api.com/v2/questions?categories=${category}&difficulties=easy&limit=1`;
    const easy2Url = `https://the-trivia-api.com/v2/questions?categories=${category}&difficulties=easy&limit=1`;
    const medium1Url = `https://the-trivia-api.com/v2/questions?categories=${category}&difficulties=medium&limit=1`;
    const medium2Url = `https://the-trivia-api.com/v2/questions?categories=${category}&difficulties=medium&limit=1`;
    const hard1Url = `https://the-trivia-api.com/v2/questions?categories=${category}&difficulties=hard&limit=1`;
    const hard2Url = `https://the-trivia-api.com/v2/questions?categories=${category}&difficulties=hard&limit=1`;

    let easy1, easy2, medium1, medium2, hard1, hard2;

    fetch(easy1Url)
        .then(response => response.json())
        .then(data => {
            easy1 = data;
            return fetch(easy2Url);
        })

        .then(response => response.json())
        .then(data => {
            easy2 = data;
            return fetch(medium1Url);
        })

        .then(response => response.json())
        .then(data => {
            medium1 = data;
            return fetch(medium2Url);
        })
        .then(response => response.json())
        .then(data => {
            medium2 = data;
            return fetch(hard1Url);
        })
        .then(response => response.json())
        .then(data => {
            hard1 = data;
            return fetch(hard2Url);
        })
        .then(response => response.json())
        .then(data => {
            hard2 = data;
            questions = [...easy1, ...easy2, ...medium1, ...medium2, ...hard1, ...hard2];
            currentQuestionIndex = 0;
            displayQuestion();
        })
    console.log("what happen here")
}


function displayQuestion() {
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.style.display = "block";
    const questionNumberDisplay = document.getElementById("question-number-display");
    questionNumberDisplay.innerHTML = `${currentQuestionIndex + 1} of 6.`;

    const questionText = document.getElementById("question-text");
    questionText.innerHTML = questions[currentQuestionIndex].question.text;

    displayOptions();
}


function displayOptions() {
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;
    const incorrectAnswers = questions[currentQuestionIndex].incorrectAnswers;
    const options = [...incorrectAnswers, correctAnswer];

    options.sort(() => Math.random() - 0.5);


    const optionInputs = document.querySelectorAll(".option-input");
    const optionLabels = document.querySelectorAll(".option-label");

    let i = 0;

    while (i < optionInputs.length) {
        optionInputs[i].checked = false;
        optionInputs[i].value = options[i];
        optionLabels[i].innerHTML = options[i];

        optionInputs[i].addEventListener("click", function (e) {
            selectedOption = e.target.value;
        });

        i++;
    }
    selectedOption = "";
}

function checkAnswer(selectedOption) {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correctAnswer;
    const difficulty = currentQuestion.difficulty;

    if (selectedOption === correctAnswer) {
        if (currentPlayer === 1) {
            player1Score += difficultyRating[difficulty];
            currentPlayer = 2
        } else {
            player2Score += difficultyRating[difficulty];
            currentPlayer = 1
        }
    } else {
        if (currentPlayer === 1) {
            currentPlayer = 2;
        } else {
            currentPlayer = 1;
        }
    }

    const scorePlayer1 = document.getElementById("score-player1");
    scorePlayer1.innerHTML = `${player1Name} Score is: ${player1Score}`;

    const scorePlayer2 = document.getElementById("score-player2");
    scorePlayer2.innerHTML = `${player2Name} Score is: ${player2Score}`;

    const playerTurnDisplay = document.getElementById("player-turn");
    playerTurnDisplay.innerHTML = `It's Player ${currentPlayer}'s turn`;
}



let nextQuestionButton = document.getElementById("next-question-button");
nextQuestionButton.addEventListener("click", function () {

    if (selectedOption) {
        checkAnswer(selectedOption);
        currentQuestionIndex++;
    }

    if (currentQuestionIndex >= 6) {
        setTimeout(() => {
            questionDisplaySection.style.display = "none";
            continueGameAndEndGameSection.style.display = "block";
        }, 900);
    } else {
        displayQuestion();
    }

});

continueGameButton = document.getElementById("continue-game-button");
continueGameButton.addEventListener("click", function () {

    if (categoryDropdown.options.length === 0) {
        alert("Sorry, there is no more category left!");
        return;
    }

    continueGameAndEndGameSection.style.display = "none";
    categorySelectionSection.style.display = "block";
});

let endGameButton = document.getElementById("end-game-button");
endGameButton.addEventListener("click", function () {
    continueGameAndEndGameSection.style.display = "none";
    winnerSection = document.getElementById("winner-section");
    winnerSection.style.display = "block";
    displayWinner();
});

function displayWinner() {
    let winnerDisplay = document.getElementById("winner-section");
    if (player1Score > player2Score) {
        winnerDisplay.innerHTML = `Winner is ${player1Name} with: ${player1Score} Score`;
    } else if (player2Score > player1Score) {
        winnerDisplay.innerHTML = `Winner is ${player2Name} with: ${player2Score} Score`;
    } else {
        winnerDisplay.innerHTML = "It's Tie ";
    }
}

