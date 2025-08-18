const quizData = [
  {
    question: "What is the capital of France?",
    answers: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2,
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
  },
  {
    question: "What is the largest mammal in the world?",
    answers: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correct: 1,
  },
  {
    question: "In which year did the Titanic sink?",
    answers: ["1910", "1912", "1914", "1916"],
    correct: 1,
  },
  {
    question: "What is the smallest country in the world?",
    answers: ["Monaco", "Vatican City", "Liechtenstein", "San Marino"],
    correct: 1,
  },
  {
    question: "Who painted the Mona Lisa?",
    answers: [
      "Vincent van Gogh",
      "Pablo Picasso",
      "Leonardo da Vinci",
      "Michelangelo",
    ],
    correct: 2,
  },
  {
    question: "What is the hardest natural substance on Earth?",
    answers: ["Gold", "Iron", "Diamond", "Platinum"],
    correct: 2,
  },
  {
    question: "Which ocean is the largest?",
    answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correct: 3,
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: ["Go", "Gd", "Au", "Ag"],
    correct: 2,
  },
  {
    question: "How many continents are there?",
    answers: ["5", "6", "7", "8"],
    correct: 2,
  },
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let userAnswers = [];

function initializeQuiz() {
  currentQuestion = 0;
  score = 0;
  selectedAnswer = null;
  userAnswers = [];
  document.getElementById("results").classList.remove("show");
  document.getElementById("questionContainer").style.display = "block";
  document.querySelector(".progress-container").style.display = "block";
  document.querySelector(".score-display").style.display = "block";
  document.querySelector(".controls").style.display = "flex";
  loadQuestion();
  updateUI();
}

function loadQuestion() {
  const question = quizData[currentQuestion];
  const questionElement = document.getElementById("question");
  const answersElement = document.getElementById("answers");

  questionElement.textContent = question.question;
  questionElement.classList.add("fade-in");

  answersElement.innerHTML = "";

  question.answers.forEach((answer, index) => {
    const answerElement = document.createElement("div");
    answerElement.className = "answer";
    answerElement.textContent = answer;
    answerElement.onclick = () => selectAnswer(index);
    answersElement.appendChild(answerElement);
  });

  selectedAnswer = null;
  updateUI();
}

function selectAnswer(index) {
  const answers = document.querySelectorAll(".answer");

  // Remove previous selection
  answers.forEach((answer) => answer.classList.remove("selected"));

  // Add selection to clicked answer
  answers[index].classList.add("selected");
  selectedAnswer = index;

  // Enable next button
  document.getElementById("nextBtn").disabled = false;
}

function nextQuestion() {
  if (selectedAnswer === null) return;

  const question = quizData[currentQuestion];
  const answers = document.querySelectorAll(".answer");

  // Store user's answer
  userAnswers[currentQuestion] = selectedAnswer;

  // Show correct/incorrect answers
  answers.forEach((answer, index) => {
    answer.classList.add("disabled");
    if (index === question.correct) {
      answer.classList.add("correct");
    } else if (
      index === selectedAnswer &&
      selectedAnswer !== question.correct
    ) {
      answer.classList.add("incorrect");
    }
  });

  // Update score
  if (selectedAnswer === question.correct) {
    score++;
  }

  // Wait a moment to show the results, then proceed
  setTimeout(() => {
    currentQuestion++;

    if (currentQuestion < quizData.length) {
      loadQuestion();
    } else {
      showResults();
    }

    updateUI();
  }, 1500);

  // Disable next button temporarily
  document.getElementById("nextBtn").disabled = true;
}

function previousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    selectedAnswer = userAnswers[currentQuestion] || null;
    loadQuestion();

    // Restore previous selection if it exists
    if (selectedAnswer !== null) {
      const answers = document.querySelectorAll(".answer");
      answers[selectedAnswer].classList.add("selected");
      document.getElementById("nextBtn").disabled = false;
    }

    updateUI();
  }
}

function updateUI() {
  const progressFill = document.getElementById("progressFill");
  const questionNumber = document.getElementById("questionNumber");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  // Update progress bar
  const progress = (currentQuestion / quizData.length) * 100;
  progressFill.style.width = progress + "%";

  // Update question number
  questionNumber.textContent = `Question ${currentQuestion + 1} of ${
    quizData.length
  }`;

  // Update score display
  scoreDisplay.textContent = `Score: ${score}/${quizData.length}`;

  // Update button states
  prevBtn.disabled = currentQuestion === 0;
  nextBtn.textContent =
    currentQuestion === quizData.length - 1 ? "Finish Quiz" : "Next Question";
}

function showResults() {
  document.getElementById("questionContainer").style.display = "none";
  document.querySelector(".progress-container").style.display = "none";
  document.querySelector(".score-display").style.display = "none";
  document.querySelector(".controls").style.display = "none";
  document.getElementById("results").classList.add("show");

  const finalScore = document.getElementById("finalScore");
  const scoreMessage = document.getElementById("scoreMessage");
  const correctAnswers = document.getElementById("correctAnswers");
  const incorrectAnswers = document.getElementById("incorrectAnswers");
  const accuracyRate = document.getElementById("accuracyRate");

  const percentage = Math.round((score / quizData.length) * 100);

  finalScore.textContent = `${score}/${quizData.length}`;
  correctAnswers.textContent = score;
  incorrectAnswers.textContent = quizData.length - score;
  accuracyRate.textContent = percentage + "%";

  // Set message based on score
  if (percentage >= 90) {
    scoreMessage.textContent = "Excellent! You're a quiz master! 🏆";
  } else if (percentage >= 70) {
    scoreMessage.textContent = "Great job! Well done! 👏";
  } else if (percentage >= 50) {
    scoreMessage.textContent = "Good effort! Keep learning! 📚";
  } else {
    scoreMessage.textContent = "Don't give up! Practice makes perfect! 💪";
  }
}

function restartQuiz() {
  initializeQuiz();
}

// Initialize the quiz when the page loads
document.addEventListener("DOMContentLoaded", initializeQuiz);
