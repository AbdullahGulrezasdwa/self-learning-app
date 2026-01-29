// ===== Load Curriculum =====
let curriculum = {};
let currentTopic = "";
let currentIndex = 0;
let currentMode = "flashcard"; // flashcard, quiz, review

// Load from JSON or localStorage
async function loadCurriculum() {
  const response = await fetch('curriculum.json');
  curriculum = await response.json();

  // Load progress from localStorage
  const saved = localStorage.getItem('progress');
  if(saved) curriculum = JSON.parse(saved);

  populateTopics();
  updateProgressDashboard();
}

function saveProgress() {
  localStorage.setItem('progress', JSON.stringify(curriculum));
}

// Populate dropdown
function populateTopics() {
  const select = document.getElementById('topicSelect');
  select.innerHTML = '';
  for(let topic in curriculum){
    let opt = document.createElement('option');
    opt.value = topic;
    opt.textContent = topic;
    select.appendChild(opt);
  }
}

// ===== Sections =====
function showSection(section) {
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('flashcardSection').classList.add('hidden');
  document.getElementById('quizSection').classList.add('hidden');

  if(section==="dashboard") document.getElementById('dashboard').classList.remove('hidden');
  if(section==="flashcard") document.getElementById('flashcardSection').classList.remove('hidden');
  if(section==="quiz") document.getElementById('quizSection').classList.remove('hidden');
}

// ===== Flashcards =====
function startFlashcards() {
  currentTopic = document.getElementById('topicSelect').value;
  currentIndex = 0;
  currentMode = "flashcard";
  showSection("flashcard");
  showFlashcard();
}

function showFlashcard() {
  let q = curriculum[currentTopic][currentIndex];
  document.getElementById('question').innerText = q.question;
}

function flipFlashcard() {
  let q = curriculum[currentTopic][currentIndex];
  alert("Answer: " + q.answer);
}

function markCorrect() {
  let q = curriculum[currentTopic][currentIndex];
  q.status = "mastered";
  nextFlashcard();
}

function markIncorrect() {
  let q = curriculum[currentTopic][currentIndex];
  q.status = "weak";
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

// ===== Quiz =====
let quizIndex = 0;
function startQuiz() {
  currentTopic = document.getElementById('topicSelect').value;
  quizIndex = 0;
  currentMode = "quiz";
  showSection("quiz");
  showQuiz();
}

function showQuiz() {
  let q = curriculum[currentTopic][quizIndex];
  document.getElementById('quizQuestion').innerText = q.question;
  document.getElementById('quizAnswer').value = '';
  document.getElementById('quizFeedback').innerText = '';
}

function submitQuizAnswer() {
  let userAns = document.getElementById('quizAnswer').value.trim();
  let q = curriculum[currentTopic][quizIndex];

  if(userAns.toLowerCase() === q.answer.toLowerCase()){
    q.status = "mastered";
    document.getElementById('quizFeedback').innerText = "Correct!";
  } else {
    q.status = "weak";
    document.getElementById('quizFeedback').innerText = "Wrong! Correct: " + q.answer;
  }
  quizIndex++;
  saveProgress();

  if(quizIndex < curriculum[currentTopic].length){
    setTimeout(showQuiz, 1000);
  } else {
    setTimeout(()=>{
      alert("Quiz finished!");
      backToDashboard();
      updateProgressDashboard();
    },1000);
  }
}

// ===== Review Weak =====
function reviewWeak() {
  currentTopic = document.getElementById('topicSelect').value;
  let weakQs = curriculum[currentTopic].filter(q => q.status==="weak");
  if(weakQs.length===0){
    alert("No weak questions!");
    return;
  }
  curriculum[currentTopic] = weakQs;
  currentIndex = 0;
  currentMode = "review";
  showSection("flashcard");
  showFlashcard();
}

// ===== Back to Dashboard =====
function backToDashboard() {
  showSection("dashboard");
  updateProgressDashboard();
}

// ===== Progress Dashboard =====
function updateProgressDashboard() {
  let container = document.getElementById('progressDashboard');
  container.innerHTML = '';
  for(let topic in curriculum){
    let mastered = curriculum[topic].filter(q => q.status==="mastered").length;
    let total = curriculum[topic].length;
    let percent = Math.round((mastered/total)*100);
    let grade = percent>=80?"A":percent>=60?"B":percent>=40?"C":"F";

    let div = document.createElement('div');
    div.innerHTML = `<strong>${topic}</strong> - Mastered: ${percent}% - Grade: ${grade}`;
    container.appendChild(div);
  }
}

// ===== Init =====
loadCurriculum();
