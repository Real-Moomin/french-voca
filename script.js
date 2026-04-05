const STORAGE_KEY = "french-voca-state";

const elements = {
  dayTitle: document.querySelector("#day-title"),
  dayPrev: document.querySelector("#day-prev"),
  dayNext: document.querySelector("#day-next"),
  cardGrid: document.querySelector("#card-grid"),
  quizList: document.querySelector("#quiz-list"),
  checkQuiz: document.querySelector("#check-quiz"),
  wordCardTemplate: document.querySelector("#word-card-template"),
  quizItemTemplate: document.querySelector("#quiz-item-template"),
};

const state = {
  manifest: [],
  currentDay: 1,
  currentData: null,
};

function loadSavedState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    state.currentDay = Number(parsed.currentDay) || 1;
  } catch {
    state.currentDay = 1;
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      currentDay: state.currentDay,
    }),
  );
}

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
}

function toPosLabel(partOfSpeech) {
  return {
    noun: "명사",
    verb: "동사",
    adjective: "형용사",
    adverb: "부사·표현",
  }[partOfSpeech] || partOfSpeech;
}

function syncActiveDayUi() {
  const currentIndex = state.manifest.findIndex((item) => item.day === state.currentDay);
  elements.dayPrev.disabled = currentIndex <= 0;
  elements.dayNext.disabled = currentIndex < 0 || currentIndex >= state.manifest.length - 1;
}

function renderWords() {
  const words = state.currentData?.words || [];
  elements.cardGrid.innerHTML = "";

  if (!words.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "표시할 단어가 없습니다.";
    elements.cardGrid.append(empty);
  } else {
    words.forEach((item, index) => {
      const fragment = elements.wordCardTemplate.content.cloneNode(true);
      const badge = fragment.querySelector(".pos-badge");
      badge.textContent = toPosLabel(item.partOfSpeech);
      badge.dataset.pos = item.partOfSpeech;
      fragment.querySelector(".word-index").textContent = `${index + 1}`;
      fragment.querySelector(".word-text").textContent = item.word;
      fragment.querySelector(".word-meaning").textContent = item.meaning;
      fragment.querySelector(".word-example").textContent = item.example;
      fragment.querySelector(".word-example-ko").textContent = item.exampleKo || "";
      elements.cardGrid.append(fragment);
    });
  }
  saveState();
}

function renderQuiz() {
  elements.quizList.innerHTML = "";
  for (const [index, item] of (state.currentData?.quiz || []).entries()) {
    const fragment = elements.quizItemTemplate.content.cloneNode(true);
    fragment.querySelector(".quiz-number").textContent = `문제 ${index + 1}`;
    fragment.querySelector(".quiz-sentence").textContent = item.sentence;
    const feedback = fragment.querySelector(".quiz-feedback");
    feedback.dataset.answer = item.answer;
    elements.quizList.append(fragment);
  }
}

function checkQuizAnswers() {
  for (const item of elements.quizList.querySelectorAll(".quiz-item")) {
    const feedback = item.querySelector(".quiz-feedback");
    const expected = feedback.dataset.answer;
    feedback.className = "quiz-feedback is-correct";
    feedback.textContent = `정답: ${expected}`;
  }
}

async function loadDay() {
  syncActiveDayUi();
  state.currentData = await fetchJson(`./data/day${String(state.currentDay).padStart(2, "0")}.json`);
  elements.dayTitle.textContent = state.currentData.title || `Day ${String(state.currentData.day).padStart(2, "0")}`;
  syncActiveDayUi();
  renderWords();
  renderQuiz();
}

function moveDay(offset) {
  const currentIndex = state.manifest.findIndex((item) => item.day === state.currentDay);
  const nextItem = state.manifest[currentIndex + offset];
  if (!nextItem) {
    return;
  }
  state.currentDay = nextItem.day;
  saveState();
  loadDay();
}

async function promptForDay() {
  const input = window.prompt("이동할 day 번호를 입력하세요.", String(state.currentDay));
  if (input === null) {
    return;
  }
  const nextDay = Number(input);
  if (!Number.isInteger(nextDay)) {
    return;
  }
  const matched = state.manifest.find((item) => item.day === nextDay);
  if (!matched) {
    return;
  }
  state.currentDay = matched.day;
  saveState();
  await loadDay();
}

async function init() {
  if (window.location.protocol === "file:") {
    throw new Error("`index.html`을 직접 열면 브라우저가 JSON 로딩을 막을 수 있습니다. 터미널에서 `npm start`를 실행한 뒤 `http://127.0.0.1:5500`으로 접속해 주세요.");
  }

  loadSavedState();
  state.manifest = await fetchJson("./data/index.json");
  await loadDay();

  elements.dayPrev.addEventListener("click", () => moveDay(-1));
  elements.dayNext.addEventListener("click", () => moveDay(1));
  elements.dayTitle.addEventListener("click", promptForDay);
  elements.checkQuiz.addEventListener("click", checkQuizAnswers);
}

init().catch((error) => {
  elements.dayTitle.textContent = "데이터를 불러오지 못했습니다.";
});
