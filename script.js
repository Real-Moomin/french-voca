const WORDS_PER_PAGE = 10;
const STORAGE_KEY = "french-voca-state";
const THEME_KEY = "french-voca-theme";

const elements = {
  daySelect: document.querySelector("#day-select"),
  dayList: document.querySelector("#day-list"),
  searchInput: document.querySelector("#search-input"),
  posFilter: document.querySelector("#pos-filter"),
  themeToggle: document.querySelector("#theme-toggle"),
  dayTheme: document.querySelector("#day-theme"),
  dayTitle: document.querySelector("#day-title"),
  daySummary: document.querySelector("#day-summary"),
  pageStatus: document.querySelector("#page-status"),
  prevPage: document.querySelector("#prev-page"),
  nextPage: document.querySelector("#next-page"),
  cardGrid: document.querySelector("#card-grid"),
  quizList: document.querySelector("#quiz-list"),
  checkQuiz: document.querySelector("#check-quiz"),
  resetQuiz: document.querySelector("#reset-quiz"),
  wordCardTemplate: document.querySelector("#word-card-template"),
  quizItemTemplate: document.querySelector("#quiz-item-template"),
  wordsView: document.querySelector("#words-view"),
  quizView: document.querySelector("#quiz-view"),
  tabButtons: document.querySelectorAll(".tab-button"),
};

const state = {
  manifest: [],
  currentDay: 1,
  currentPage: 1,
  activeView: "words",
  currentData: null,
};

function loadSavedState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    state.currentDay = Number(parsed.currentDay) || 1;
    state.currentPage = Number(parsed.currentPage) || 1;
    state.activeView = parsed.activeView === "quiz" ? "quiz" : "words";
  } catch {
    state.currentDay = 1;
    state.currentPage = 1;
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      currentDay: state.currentDay,
      currentPage: state.currentPage,
      activeView: state.activeView,
    }),
  );
}

function applyTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    document.body.dataset.theme = savedTheme;
    return;
  }
  document.body.dataset.theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function toggleTheme() {
  const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
  document.body.dataset.theme = nextTheme;
  localStorage.setItem(THEME_KEY, nextTheme);
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
  elements.dayList.innerHTML = "";

  state.manifest.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.day;
    option.textContent = `Day ${String(item.day).padStart(2, "0")} · ${item.title}`;
    elements.daySelect.append(option);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "day-link";
    button.dataset.day = item.day;
    button.textContent = `Day ${String(item.day).padStart(2, "0")}`;
    button.addEventListener("click", async () => {
      state.currentDay = item.day;
      state.currentPage = 1;
      saveState();
      await loadDay();
    });
    elements.dayList.append(button);
  });
}

function syncActiveDayUi() {
  elements.daySelect.value = String(state.currentDay);
  for (const button of elements.dayList.querySelectorAll(".day-link")) {
    button.classList.toggle("is-active", Number(button.dataset.day) === state.currentDay);
  }
}

function getFilteredWords() {
  if (!state.currentData) {
    return [];
  }
  const search = elements.searchInput.value.trim().toLowerCase();
  const pos = elements.posFilter.value;

  return state.currentData.words.filter((item) => {
    const matchesSearch =
      !search ||
      item.word.toLowerCase().includes(search) ||
      item.meaning.toLowerCase().includes(search) ||
      item.example.toLowerCase().includes(search);
    const matchesPos = pos === "all" || item.partOfSpeech === pos;
    return matchesSearch && matchesPos;
  });
}

function renderWords() {
  const words = getFilteredWords();
  const totalPages = Math.max(1, Math.ceil(words.length / WORDS_PER_PAGE));
  state.currentPage = Math.max(1, Math.min(state.currentPage, totalPages));

  elements.cardGrid.innerHTML = "";
  const startIndex = (state.currentPage - 1) * WORDS_PER_PAGE;
  const pageItems = words.slice(startIndex, startIndex + WORDS_PER_PAGE);

  if (!pageItems.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "조건에 맞는 단어가 없습니다. 검색어나 품사 필터를 바꿔보세요.";
    elements.cardGrid.append(empty);
  } else {
    pageItems.forEach((item, index) => {
      const fragment = elements.wordCardTemplate.content.cloneNode(true);
      fragment.querySelector(".pos-badge").textContent = toPosLabel(item.partOfSpeech);
      fragment.querySelector(".word-index").textContent = `${startIndex + index + 1}/${words.length}`;
      fragment.querySelector(".word-text").textContent = item.word;
      fragment.querySelector(".word-meaning").textContent = item.meaning;
      fragment.querySelector(".word-example").textContent = item.example;
      elements.cardGrid.append(fragment);
    });
  }

  elements.pageStatus.textContent = `${state.currentPage} / ${totalPages}`;
  elements.prevPage.disabled = state.currentPage <= 1;
  elements.nextPage.disabled = state.currentPage >= totalPages;
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

function updateView() {
  const isWords = state.activeView === "words";
  elements.wordsView.classList.toggle("is-hidden", !isWords);
  elements.quizView.classList.toggle("is-hidden", isWords);
  for (const button of elements.tabButtons) {
    button.classList.toggle("is-active", button.dataset.view === state.activeView);
  }
  saveState();
}

async function loadDay() {
  syncActiveDayUi();
  state.currentData = await fetchJson(`./data/day${String(state.currentDay).padStart(2, "0")}.json`);
  elements.dayTheme.textContent = state.currentData.theme;
  elements.dayTitle.textContent = `Day ${String(state.currentData.day).padStart(2, "0")} · ${state.currentData.title}`;
  elements.daySummary.textContent = state.currentData.description;
  renderWords();
  renderQuiz();
  updateView();
}

async function init() {
  if (window.location.protocol === "file:") {
    throw new Error("`index.html`을 직접 열면 브라우저가 JSON 로딩을 막을 수 있습니다. 터미널에서 `npm start`를 실행한 뒤 `http://127.0.0.1:5500`으로 접속해 주세요.");
  }

  loadSavedState();
  applyTheme();
  state.manifest = await fetchJson("./data/index.json");
  buildDayNavigation();
  await loadDay();

  elements.daySelect.addEventListener("change", async (event) => {
    state.currentDay = Number(event.target.value);
    state.currentPage = 1;
    saveState();
    await loadDay();
  });

  elements.searchInput.addEventListener("input", () => {
    state.currentPage = 1;
    renderWords();
  });

  elements.posFilter.addEventListener("change", () => {
    state.currentPage = 1;
    renderWords();
  });

  elements.prevPage.addEventListener("click", () => {
    state.currentPage -= 1;
    renderWords();
  });

  elements.nextPage.addEventListener("click", () => {
    state.currentPage += 1;
    renderWords();
  });

  elements.checkQuiz.addEventListener("click", checkQuizAnswers);
  elements.resetQuiz.addEventListener("click", resetQuizAnswers);
  elements.themeToggle.addEventListener("click", toggleTheme);

  for (const button of elements.tabButtons) {
    button.addEventListener("click", () => {
      state.activeView = button.dataset.view;
      updateView();
    });
  }
}

init().catch((error) => {
  elements.dayTitle.textContent = "데이터를 불러오지 못했습니다.";
  elements.daySummary.textContent = error.message;
});
