// Enhanced Quiz Data with categories, difficulty, and hints
const quizData = [
  {
    question: "What is the capital of France?",
    answers: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2,
    category: "Geography",
    difficulty: "easy",
    hint: "Known as the 'City of Light'"
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
    category: "Science",
    difficulty: "easy",
    hint: "Named after the Roman god of war"
  },
  {
    question: "What is the largest mammal in the world?",
    answers: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correct: 1,
    category: "Nature",
    difficulty: "easy",
    hint: "It lives in the ocean"
  },
  {
    question: "In which year did the Titanic sink?",
    answers: ["1910", "1912", "1914", "1916"],
    correct: 1,
    category: "History",
    difficulty: "medium",
    hint: "Early 20th century, before World War I"
  },
  {
    question: "What is the smallest country in the world?",
    answers: ["Monaco", "Vatican City", "Liechtenstein", "San Marino"],
    correct: 1,
    category: "Geography",
    difficulty: "medium",
    hint: "Located within Rome, Italy"
  },
  {
    question: "Who painted the Mona Lisa?",
    answers: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correct: 2,
    category: "Art",
    difficulty: "easy",
    hint: "Renaissance artist and inventor"
  },
  {
    question: "What is the hardest natural substance on Earth?",
    answers: ["Gold", "Iron", "Diamond", "Platinum"],
    correct: 2,
    category: "Science",
    difficulty: "easy",
    hint: "Often used in engagement rings"
  },
  {
    question: "Which ocean is the largest?",
    answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correct: 3,
    category: "Geography",
    difficulty: "easy",
    hint: "Covers more than 30% of Earth's surface"
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: ["Go", "Gd", "Au", "Ag"],
    correct: 2,
    category: "Science",
    difficulty: "medium",
    hint: "From the Latin word 'Aurum'"
  },
  {
    question: "How many continents are there?",
    answers: ["5", "6", "7", "8"],
    correct: 2,
    category: "Geography",
    difficulty: "easy",
    hint: "Asia, Africa, North America, South America, Antarctica, Europe, Australia"
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    answers: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correct: 1,
    category: "Literature",
    difficulty: "easy",
    hint: "Famous English playwright"
  },
  {
    question: "What is the speed of light?",
    answers: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
    correct: 0,
    category: "Science",
    difficulty: "hard",
    hint: "Approximately 3 x 10^8 meters per second"
  },
  {
    question: "In which year did World War II end?",
    answers: ["1943", "1944", "1945", "1946"],
    correct: 2,
    category: "History",
    difficulty: "medium",
    hint: "The year the atomic bombs were dropped"
  },
  {
    question: "What is the largest desert in the world?",
    answers: ["Sahara", "Arabian", "Gobi", "Antarctic"],
    correct: 3,
    category: "Geography",
    difficulty: "hard",
    hint: "It's actually a cold desert"
  },
  {
    question: "How many bones are in the human body?",
    answers: ["186", "206", "226", "246"],
    correct: 1,
    category: "Science",
    difficulty: "medium",
    hint: "More than 200, less than 210"
  }
];

// Quiz State
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let userAnswers = [];
let difficulty = "easy";
let timerEnabled = true;
let soundEnabled = true;
let hintEnabled = false;
let timeRemaining = 30;
let timerInterval = null;
let streak = 0;
let maxStreak = 0;
let startTime = null;
let hintUsed = false;
let filteredQuizData = [];

// Sound Effects (using Web Audio API for simple beeps)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (!soundEnabled) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch(type) {
    case 'correct':
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.3;
      break;
    case 'incorrect':
      oscillator.frequency.value = 200;
      gainNode.gain.value = 0.3;
      break;
    case 'click':
      oscillator.frequency.value = 400;
      gainNode.gain.value = 0.1;
      break;
  }
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

// Initialize
document.addEventListener("DOMContentLoaded", function() {
  setupEventListeners();
  showStartScreen();
});

function setupEventListeners() {
  // Difficulty buttons
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      difficulty = this.dataset.difficulty;
      playSound('click');
    });
  });

  // Settings toggles
  document.getElementById('timerToggle').addEventListener('change', function() {
    timerEnabled = this.checked;
  });

  document.getElementById('soundToggle').addEventListener('change', function() {
    soundEnabled = this.checked;
  });

  document.getElementById('hintToggle').addEventListener('change', function() {
    hintEnabled = this.checked;
  });
}

function showStartScreen() {
  document.getElementById('startScreen').style.display = 'block';
  document.getElementById('quizScreen').style.display = 'none';
  document.getElementById('results').classList.remove('show');
}

function startQuiz() {
  playSound('click');
  
  // Filter questions by difficulty
  filteredQuizData = quizData.filter(q => q.difficulty === difficulty);
  
  // If not enough questions for selected difficulty, add some from other levels
  if (filteredQuizData.length < 10) {
    const otherQuestions = quizData.filter(q => q.difficulty !== difficulty);
    filteredQuizData = [...filteredQuizData, ...otherQuestions].slice(0, 10);
  }
  
  // Shuffle questions
  filteredQuizData = shuffleArray(filteredQuizData).slice(0, 10);
  
  // Reset state
  currentQuestion = 0;
  score = 0;
  selectedAnswer = null;
  userAnswers = [];
  streak = 0;
  maxStreak = 0;
  startTime = Date.now();
  
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('quizScreen').style.display = 'block';
  document.getElementById('results').classList.remove('show');
  
  // Show/hide timer
  if (!timerEnabled) {
    document.getElementById('timerDisplay').style.display = 'none';
  }
  
  // Show/hide hint button
  if (hintEnabled) {
    document.getElementById('hintBtn').style.display = 'inline-block';
  }
  
  loadQuestion();
  updateUI();
}

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function loadQuestion() {
  const question = filteredQuizData[currentQuestion];
  const questionElement = document.getElementById("question");
  const answersElement = document.getElementById("answers");
  const categoryBadge = document.getElementById("categoryBadge");
  const hintBox = document.getElementById("hintBox");
  
  // Reset timer
  if (timerEnabled) {
    clearInterval(timerInterval);
    timeRemaining = 30;
    startTimer();
  }
  
  // Hide hint
  hintBox.style.display = 'none';
  hintUsed = false;
  
  categoryBadge.textContent = question.category;
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

function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    
    if (timeRemaining <= 10) {
      document.getElementById('timerDisplay').classList.add('warning');
    }
    
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      // Auto-submit with no answer
      if (selectedAnswer === null) {
        nextQuestion();
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerElement = document.getElementById('timeRemaining');
  timerElement.textContent = timeRemaining;
  
  if (timeRemaining > 10) {
    document.getElementById('timerDisplay').classList.remove('warning');
  }
}

function selectAnswer(index) {
  if (selectedAnswer !== null) return; // Prevent changing answer
  
  playSound('click');
  const answers = document.querySelectorAll(".answer");
  
  answers.forEach((answer) => answer.classList.remove("selected"));
  answers[index].classList.add("selected");
  selectedAnswer = index;
  
  document.getElementById("nextBtn").disabled = false;
}

function showHint() {
  if (hintUsed) return;
  
  playSound('click');
  const question = filteredQuizData[currentQuestion];
  const hintBox = document.getElementById("hintBox");
  const hintText = document.getElementById("hintText");
  
  hintText.textContent = question.hint;
  hintBox.style.display = 'block';
  hintUsed = true;
  
  document.getElementById('hintBtn').disabled = true;
}

function nextQuestion() {
  const question = filteredQuizData[currentQuestion];
  const answers = document.querySelectorAll(".answer");
  
  // Clear timer
  if (timerEnabled) {
    clearInterval(timerInterval);
  }
  
  // Store user's answer (null if time ran out)
  userAnswers[currentQuestion] = {
    selected: selectedAnswer,
    correct: question.correct,
    question: question.question,
    answers: question.answers,
    timeLeft: timeRemaining
  };
  
  // Show correct/incorrect answers
  answers.forEach((answer, index) => {
    answer.classList.add("disabled");
    if (index === question.correct) {
      answer.classList.add("correct");
    } else if (index === selectedAnswer && selectedAnswer !== question.correct) {
      answer.classList.add("incorrect");
    }
  });
  
  // Update score and streak
  if (selectedAnswer === question.correct) {
    score++;
    streak++;
    maxStreak = Math.max(maxStreak, streak);
    playSound('correct');
    updateStreakDisplay();
  } else {
    streak = 0;
    if (selectedAnswer !== null) {
      playSound('incorrect');
    }
    updateStreakDisplay();
  }
  
  // Wait before proceeding
  setTimeout(() => {
    currentQuestion++;
    
    if (currentQuestion < filteredQuizData.length) {
      loadQuestion();
    } else {
      showResults();
    }
    
    updateUI();
  }, 1500);
  
  document.getElementById("nextBtn").disabled = true;
}

function previousQuestion() {
  if (currentQuestion > 0) {
    playSound('click');
    currentQuestion--;
    selectedAnswer = userAnswers[currentQuestion]?.selected || null;
    loadQuestion();
    
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
  const scoreDisplay = document.getElementById("scoreText");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  
  const progress = (currentQuestion / filteredQuizData.length) * 100;
  progressFill.style.width = progress + "%";
  
  questionNumber.textContent = `Question ${currentQuestion + 1} of ${filteredQuizData.length}`;
  scoreDisplay.textContent = `${score}/${filteredQuizData.length}`;
  
  prevBtn.disabled = currentQuestion === 0;
  nextBtn.textContent = currentQuestion === filteredQuizData.length - 1 ? "Finish Quiz" : "Next →";
  
  // Reset hint button
  if (hintEnabled) {
    document.getElementById('hintBtn').disabled = false;
  }
}

function updateStreakDisplay() {
  const streakDisplay = document.getElementById('streakDisplay');
  const streakCount = document.getElementById('streakCount');
  
  if (streak > 1) {
    streakDisplay.style.display = 'inline-block';
    streakCount.textContent = streak;
  } else {
    streakDisplay.style.display = 'none';
  }
}

function showResults() {
  clearInterval(timerInterval);
  
  document.getElementById('quizScreen').style.display = 'none';
  document.getElementById('results').classList.add('show');
  
  const totalTime = Math.floor((Date.now() - startTime) / 1000);
  const percentage = Math.round((score / filteredQuizData.length) * 100);
  
  // Trophy animation
  const trophy = document.getElementById('trophyAnimation');
  if (percentage >= 90) {
    trophy.textContent = '🏆';
  } else if (percentage >= 70) {
    trophy.textContent = '🥈';
  } else if (percentage >= 50) {
    trophy.textContent = '🥉';
  } else {
    trophy.textContent = '📚';
  }
  
  document.getElementById('finalScore').textContent = `${score}/${filteredQuizData.length}`;
  document.getElementById('correctAnswers').textContent = score;
  document.getElementById('incorrectAnswers').textContent = filteredQuizData.length - score;
  document.getElementById('accuracyRate').textContent = percentage + '%';
  document.getElementById('totalTime').textContent = formatTime(totalTime);
  
  // Score message
  const scoreMessage = document.getElementById('scoreMessage');
  if (percentage >= 90) {
    scoreMessage.textContent = "🎉 Excellent! You're a quiz master!";
  } else if (percentage >= 70) {
    scoreMessage.textContent = "👏 Great job! Well done!";
  } else if (percentage >= 50) {
    scoreMessage.textContent = "📚 Good effort! Keep learning!";
  } else {
    scoreMessage.textContent = "💪 Don't give up! Practice makes perfect!";
  }
  
  // Generate review
  generateReview();
}

function generateReview() {
  const reviewList = document.getElementById('reviewList');
  reviewList.innerHTML = '';
  
  userAnswers.forEach((answer, index) => {
    const reviewItem = document.createElement('div');
    reviewItem.className = `review-item ${answer.selected === answer.correct ? 'correct' : 'incorrect'}`;
    
    const isCorrect = answer.selected === answer.correct;
    const statusIcon = isCorrect ? '✅' : '❌';
    
    reviewItem.innerHTML = `
      <div class="review-question">
        ${statusIcon} Question ${index + 1}: ${answer.question}
      </div>
      <div class="review-answer user">
        Your answer: ${answer.selected !== null ? answer.answers[answer.selected] : 'No answer (time ran out)'}
      </div>
      ${!isCorrect ? `<div class="review-answer correct-ans">Correct answer: ${answer.answers[answer.correct]}</div>` : ''}
    `;
    
    reviewList.appendChild(reviewItem);
  });
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function restartQuiz() {
  playSound('click');
  startQuiz();
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
  if (document.getElementById('quizScreen').style.display === 'block') {
    if (e.key >= '1' && e.key <= '4') {
      const index = parseInt(e.key) - 1;
      const answers = document.querySelectorAll('.answer');
      if (answers[index] && !answers[index].classList.contains('disabled')) {
        selectAnswer(index);
      }
    } else if (e.key === 'Enter' && !document.getElementById('nextBtn').disabled) {
      nextQuestion();
    }
  }
});
