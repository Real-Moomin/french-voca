const STORAGE_KEY = "french-voca-state";

const elements = {
  daySelect: document.querySelector("#day-select"),
  dayTitle: document.querySelector("#day-title"),
  cardGrid: document.querySelector("#card-grid"),
  quizList: document.querySelector("#quiz-list"),
  checkQuiz: document.querySelector("#check-quiz"),
  resetQuiz: document.querySelector("#reset-quiz"),
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

function buildDayNavigation() {
  elements.daySelect.innerHTML = "";

  state.manifest.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.day;
    option.textContent = `Day ${String(item.day).padStart(2, "0")} · ${item.title}`;
    elements.daySelect.append(option);
  });
}

function syncActiveDayUi() {
  elements.daySelect.value = String(state.currentDay);
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
      fragment.querySelector(".pos-badge").textContent = toPosLabel(item.partOfSpeech);
      fragment.querySelector(".word-index").textContent = `${index + 1}/${words.length}`;
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
    fragment.querySelector(".quiz-hint").textContent = `힌트: ${item.hint}`;
    fragment.querySelector(".quiz-sentence").textContent = item.sentence;
    const input = fragment.querySelector(".quiz-input");
    input.dataset.answer = item.answer;
    input.placeholder = "정답 입력";
    elements.quizList.append(fragment);
  }
}

function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[’']/g, "'")
    .trim()
    .toLowerCase();
}

function checkQuizAnswers() {
  for (const item of elements.quizList.querySelectorAll(".quiz-item")) {
    const input = item.querySelector(".quiz-input");
    const feedback = item.querySelector(".quiz-feedback");
    const expected = input.dataset.answer;
    const isCorrect = normalizeText(input.value) === normalizeText(expected);
    feedback.className = `quiz-feedback ${isCorrect ? "is-correct" : "is-wrong"}`;
    feedback.textContent = isCorrect ? "정답입니다." : `정답: ${expected}`;
  }
}

function resetQuizAnswers() {
  for (const item of elements.quizList.querySelectorAll(".quiz-item")) {
    item.querySelector(".quiz-input").value = "";
    const feedback = item.querySelector(".quiz-feedback");
    feedback.className = "quiz-feedback";
    feedback.textContent = "";
  }
}

async function loadDay() {
  syncActiveDayUi();
  state.currentData = await fetchJson(`./data/day${String(state.currentDay).padStart(2, "0")}.json`);
  elements.dayTitle.textContent = state.currentData.title || `Day ${String(state.currentData.day).padStart(2, "0")}`;
  renderWords();
  renderQuiz();
}

async function init() {
  if (window.location.protocol === "file:") {
    throw new Error("`index.html`을 직접 열면 브라우저가 JSON 로딩을 막을 수 있습니다. 터미널에서 `npm start`를 실행한 뒤 `http://127.0.0.1:5500`으로 접속해 주세요.");
  }

  loadSavedState();
  state.manifest = await fetchJson("./data/index.json");
  buildDayNavigation();
  await loadDay();

  elements.daySelect.addEventListener("change", async (event) => {
    state.currentDay = Number(event.target.value);
    saveState();
    await loadDay();
  });

  elements.checkQuiz.addEventListener("click", checkQuizAnswers);
  elements.resetQuiz.addEventListener("click", resetQuizAnswers);
}

init().catch((error) => {
  elements.dayTitle.textContent = "데이터를 불러오지 못했습니다.";
});
