const wordLists = {
  easy: ["apple", "ball", "cat", "dog", "egg", "fish", "hat", "ice", "jam", "kite", "lion", "man", "nose"],
  medium: ["basket", "guitar", "planet", "cookie", "purple", "dragon", "forest", "rabbit", "school"],
  hard: ["elephant", "microscope", "university", "aeroplane", "philosophy", "revolution", "technology"]
};

let selectedWord = "";
let scrambledWord = "";
let timerInterval;
let timeLeft = 60;
let score = 0;

const timerSpan = document.getElementById("timer").querySelector("strong");
const scoreSpan = document.getElementById("score").querySelector("strong");

const correctSound = new Audio('sounds/correct.mp3');
const incorrectSound = new Audio('sounds/incorrect.mp3');

function shuffle(word) {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters.join('');
}

function startGame() {
  score = 0;
  scoreSpan.textContent = score;
  startNewRound();
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  const difficulty = document.getElementById("difficulty").value;
  timeLeft = difficulty === "easy" ? 90 : difficulty === "medium" ? 60 : 45;
  timerSpan.textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      disableInputs(true);

      const message = document.getElementById("resultMessage");
      message.innerHTML = `⏱ Time's up!<br>❗ The correct word was: <strong>${selectedWord}</strong>`;
      message.style.color = "#d9534f"; // Bootstrap danger red
    }
  }, 1000);
}



function startNewRound() {
  const difficulty = document.getElementById("difficulty").value;
  const words = wordLists[difficulty];
  selectedWord = words[Math.floor(Math.random() * words.length)];
  scrambledWord = shuffle(selectedWord);

  while (scrambledWord === selectedWord) {
    scrambledWord = shuffle(selectedWord);
  }

  const scrambleElement = document.getElementById("scrambledWord");
  scrambleElement.textContent = scrambledWord;
  scrambleElement.classList.add("animate");
  setTimeout(() => scrambleElement.classList.remove("animate"), 500);

  document.getElementById("userInput").value = '';
  document.getElementById("resultMessage").textContent = '';
  disableInputs(false);
}

function checkWord() {
  const guess = document.getElementById("userInput").value.trim().toLowerCase();
  const resultMsg = document.getElementById("resultMessage");

  if (!guess) return;

  if (guess === selectedWord) {
    resultMsg.textContent = "✅ Correct!";
    resultMsg.style.color = "green";
    correctSound.play();
    increaseScore();
    setTimeout(startNewRound, 1000);
  } else {
    resultMsg.textContent = "❌ Try again!";
    resultMsg.style.color = "red";
    incorrectSound.play();
  }
}

function increaseScore() {
  const difficulty = document.getElementById("difficulty").value;
  const increment = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15;
  score += increment;
  scoreSpan.textContent = score;
}

function submitGuess() {
  if (timeLeft > 0) checkWord();
}

function resetGame() {
  clearInterval(timerInterval);
  score = 0;
  startGame();
}

function disableInputs(disable) {
  document.getElementById("userInput").disabled = disable;
  document.querySelector(".game-container button").disabled = disable;
}

document.getElementById("difficulty").addEventListener("change", resetGame);

// Start game on load
startGame();
