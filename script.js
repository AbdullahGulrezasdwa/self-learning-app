// Sample questions
let curriculum = {
  Math: [
    {question: "2+2?", answer: "4", status:"learning"},
    {question: "5*3?", answer: "15", status:"learning"}
  ],
  Science: [
    {question: "Water formula?", answer: "H2O", status:"learning"},
    {question: "Sun is a ___?", answer: "Star", status:"learning"}
  ]
};

let currentTopic = "Math";
let currentIndex = 0;
let currentMode = "flashcard";

// Load progress from localStorage
function loadProgress() {
  let data = localStorage.getItem("progress");
  if(data) curriculum = JSON.parse(data);
}
function saveProgress() {
  localStorage.setItem("progress", JSON.stringify(curriculum));
}

// Dashboard actions
function startFlashcards() {
  currentTopic = document.getElementById("topicSelect").value;
  currentIndex = 0;
  currentMode = "flashcard";
  document.getElementById("dashboard").style.display="none";
  document.getElementById("flashcardSection").style.display="block";
  showFlashcard();
}

function showFlashcard() {
  let q = curriculum[currentTopic][currentIndex];
  document.getElementById("question").innerText = q.question;
}

function flipFlashcard() {
  let q = curriculum[currentTopic][currentIndex];
  alert("Answer: " + q.answer);
}

function markCorrect() {
  curriculum[currentTopic][currentIndex].status = "mastered";
  nextFlashcard();
}

function markIncorrect() {
  curriculum[currentTopic][currentIndex].status = "weak";
  nextFlashcard();
}

function nextFlashcard() {
  currentIndex++;
  if(currentIndex >= curriculum[currentTopic].length){
    alert("End of flashcards!");
    backToDashboard();
  } else {
    showFlashcard();
  }
  saveProgress();
}

function backToDashboard() {
  document.getElementById("dashboard").style.display="block";
  document.getElementById("flashcardSection").style.display="none";
  document.getElementById("quizSection").style.display="none";
}

// Quiz Mode
let quizIndex = 0;
function startQuiz() {
  currentTopic = document.getElementById("topicSelect").value;
  quizIndex = 0;
  currentMode = "quiz";
  document.getElementById("dashboard").style.display="none";
  document.getElementById("quizSection").style.display="block";
  showQuiz();
}

function showQuiz() {
  let q = curriculum[currentTopic][quizIndex];
  document.getElementById("quizQuestion").innerText = q.question;
  document.getElementById("quizAnswer").value="";
  document.getElementById("quizFeedback").innerText="";
}

function submitQuizAnswer() {
  let userAns = document.getElementById("quizAnswer").value.trim();
  let q = curriculum[currentTopic][quizIndex];
  if(userAns.toLowerCase() === q.answer.toLowerCase()) {
    q.status="mastered";
    document.getElementById("quizFeedback").innerText="Correct!";
  } else {
    q.status="weak";
    document.getElementById("quizFeedback").innerText="Wrong! Correct: "+q.answer;
  }
  quizIndex++;
  saveProgress();
  if(quizIndex < curriculum[currentTopic].length){
    setTimeout(showQuiz, 1000);
  } else {
    setTimeout(() => {alert("Quiz finished!"); backToDashboard();}, 1000);
  }
}

// Review Weak
function reviewWeak() {
  currentTopic = document.getElementById("topicSelect").value;
  let weakQuestions = curriculum[currentTopic].filter(q => q.status==="weak");
  if(weakQuestions.length ===0){alert("No weak questions!"); return;}
  curriculum[currentTopic]=weakQuestions;
  startFlashcards();
}

// Initialize
loadProgress();
