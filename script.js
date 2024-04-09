const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const difficultyButtons = document.querySelectorAll(".diff_btn");
const difficultySelection = document.getElementById("difficulty-selection");
const quiz = document.getElementById("quiz");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
document.addEventListener('contextmenu', event => event.preventDefault());
function startQuiz(difficulty) {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    const url = `https://opentdb.com/api.php?amount=10&category=9&difficulty=${difficulty}&type=multiple`;
    fetchQuestions(url);
}

function fetchQuestions(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            questions = data.results.map(result => {
                return {
                    question: result.question,
                    correct_answer: result.correct_answer,
                    incorrect_answers: result.incorrect_answers
                };
            });
            showQuestion();
            difficultySelection.style.display = "none";
            quiz.style.display = "block";
        })
        .catch(error => console.error("Error fetching questions:", error));
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    // Combine correct and incorrect answers
    let answers = currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer);
    // Shuffle the answers
    answers = shuffleArray(answers);

    answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer === currentQuestion.correct_answer) {
            button.dataset.correct = true;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const isCorrect = selectedButton.dataset.correct === "true";
    if (isCorrect) {
        selectedButton.classList.add("correct");
        score++;
    } else {
        selectedButton.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Restart";
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        restartQuiz();
    }
});

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    questions = [];
    resetState();
    difficultySelection.style.display = "block";
    quiz.style.display = "none";
}

difficultyButtons.forEach(button => {
    button.addEventListener("click", () => {
        const difficulty = button.textContent.toLowerCase();
        startQuiz(difficulty);
    });
});
