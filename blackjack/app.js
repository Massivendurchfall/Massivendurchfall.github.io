const storageKey = "blackjack-count-lab-state-v1";

const statTemplate = () => ({ attempts: 0, correct: 0, bestStreak: 0, currentStreak: 0 });

const initialState = {
  xp: 0,
  completedLessons: [],
  stats: {
    cardValues: statTemplate(),
    runningCount: statTemplate(),
    trueCount: statTemplate(),
    deckEstimation: statTemplate(),
    shoeSimulator: statTemplate(),
    knowledgeQuiz: statTemplate()
  },
  daily: {
    date: "",
    attempts: 0,
    correct: 0
  },
  recent: []
};

const lessons = [
  {
    id: 1,
    title: "Das Hi-Lo-Prinzip",
    tag: "GRUNDLAGE",
    summary: "Verstehe die drei Kartengruppen und warum ein positiver Count hohe Karten signalisiert.",
    lead: "Hi-Lo ist ein balanciertes Zählsystem: Über ein vollständiges Deck addieren sich alle Werte zu null.",
    points: [
      "2 bis 6 zählen jeweils +1.",
      "7 bis 9 sind neutral und zählen 0.",
      "10, Bube, Dame, König und Ass zählen jeweils −1.",
      "Ein positiver Count zeigt relativ mehr hohe Karten im Reststapel."
    ],
    drill: "card-values"
  },
  {
    id: 2,
    title: "Kartenwerte automatisieren",
    tag: "REFLEX",
    summary: "Ordne jede Karte ohne Nachdenken in +1, 0 oder −1 ein.",
    lead: "Der Wert muss schneller erkannt werden als Rang und Farbe. Ziel ist eine direkte Reaktion ohne inneres Aufsagen.",
    points: [
      "Trainiere zuerst langsam mit 100 % Genauigkeit.",
      "Nutze die Grenze 6 | 7 und 9 | 10 als visuelle Anker.",
      "Wechsle erst bei stabilen 90 % in ein höheres Tempo."
    ],
    drill: "card-values"
  },
  {
    id: 3,
    title: "Running Count führen",
    tag: "KERNFÄHIGKEIT",
    summary: "Addiere die Kartenwerte fortlaufend und behalte die Summe auch unter Tempo.",
    lead: "Der Running Count startet nach jedem Mischen bei null. Jede sichtbare Karte verändert diese laufende Summe.",
    points: [
      "Zähle alle offenen Karten, nicht nur deine Hand.",
      "Nutze Aufhebungen: +1 und −1 ergeben sofort null.",
      "Prüfe ein komplettes Deck: Der Schlusscount muss null sein."
    ],
    drill: "running-count"
  },
  {
    id: 4,
    title: "Decks sicher schätzen",
    tag: "VISUELL",
    summary: "Lerne, die verbleibende Kartenmenge in halben und viertel Decks zu lesen.",
    lead: "Ohne brauchbare Restdeckschätzung ist der True Count ungenau. Beginne mit ganzen und halben Decks.",
    points: [
      "Ein Deck enthält 52 Karten.",
      "Vergleiche den Ablagestapel mit bekannten Deckhöhen.",
      "Bei weniger Restkarten wird jeder Schätzfehler wichtiger."
    ],
    drill: "deck-estimation"
  },
  {
    id: 5,
    title: "True Count berechnen",
    tag: "UMRECHNUNG",
    summary: "Teile den Running Count durch die geschätzten verbleibenden Decks.",
    lead: "Der True Count macht Counts aus unterschiedlich großen Schuhen vergleichbar.",
    points: [
      "Formel: Running Count ÷ Restdecks.",
      "Beispiel: +8 ÷ 2 Decks = True Count +4.",
      "Nutze beim Training immer eine feste Rundungskonvention."
    ],
    drill: "true-count"
  },
  {
    id: 6,
    title: "Tempo und Ablenkung",
    tag: "PRAXIS",
    summary: "Halte den Count bei schnellen Kartenfolgen, Unterbrechungen und ganzen Runden.",
    lead: "Am Tisch erscheinen mehrere Karten schnell nacheinander. Übe deshalb in Paaren und kompletten Runden.",
    points: [
      "Fasse Karten zu Netto-Gruppen zusammen.",
      "Merke dir bei Unterbrechungen nur die aktuelle Zahl.",
      "Verdecke im Simulator die Anzeige und prüfe später."
    ],
    drill: "shoe-simulator"
  },
  {
    id: 7,
    title: "Grundstrategie und Indizes",
    tag: "FORTGESCHRITTEN",
    summary: "Verstehe, wie Count-Schwellen einzelne Entscheidungen verändern können.",
    lead: "Counting ersetzt keine Grundstrategie. Indizes markieren festgelegte True-Count-Schwellen für Abweichungen.",
    points: [
      "Lerne zuerst eine passende Grundstrategietabelle für die konkreten Regeln.",
      "Indizes hängen von System, Deckzahl und Regeln ab.",
      "Trainiere wenige wichtige Abweichungen statt vieler unsicherer."
    ],
    drill: "knowledge-quiz"
  },
  {
    id: 8,
    title: "Komplette Schuhsimulation",
    tag: "MEISTERSCHAFT",
    summary: "Verbinde Running Count, Restdeckschätzung und True Count über einen ganzen Schuh.",
    lead: "Das Abschlussziel ist ein stabiler Count bis zur Cut Card, ohne die laufende Anzeige zu benötigen.",
    points: [
      "Starte bei 65 % Penetration und arbeite dich zu 80 % vor.",
      "Prüfe deinen Count nach mehreren Runden, nicht nach jeder Karte.",
      "Protokolliere Fehler und wiederhole genau diese Situation."
    ],
    drill: "shoe-simulator"
  }
];

const quizBank = [
  {
    topic: "KARTENWERTE",
    question: "Welchen Hi-Lo-Wert hat eine 8?",
    options: ["+1", "0", "−1", "+2"],
    answer: 1,
    explanation: "Die neutralen Karten 7, 8 und 9 haben im Hi-Lo-System den Wert 0."
  },
  {
    topic: "RUNNING COUNT",
    question: "Der Count steht bei +3. Es fallen eine 5 und ein König. Wo steht er danach?",
    options: ["+1", "+2", "+3", "+4"],
    answer: 2,
    explanation: "Die 5 zählt +1, der König −1. Beide heben sich auf, der Count bleibt +3."
  },
  {
    topic: "TRUE COUNT",
    question: "Running Count +8, noch 2 Decks im Schuh: Wie hoch ist der True Count?",
    options: ["+2", "+4", "+6", "+16"],
    answer: 1,
    explanation: "+8 geteilt durch 2 verbleibende Decks ergibt +4."
  },
  {
    topic: "GRUNDLAGEN",
    question: "Warum wird der Running Count in einen True Count umgerechnet?",
    options: ["Um die Kartenfarben einzubeziehen", "Um verschiedene Restmengen vergleichbar zu machen", "Um das Mischen vorherzusagen", "Um die Grundstrategie zu ersetzen"],
    answer: 1,
    explanation: "Der gleiche Running Count hat bei einem Restdeck eine andere Bedeutung als bei fünf Restdecks."
  },
  {
    topic: "INTERPRETATION",
    question: "Was signalisiert ein deutlich positiver True Count?",
    options: ["Relativ mehr hohe Karten verbleiben", "Relativ mehr kleine Karten verbleiben", "Es folgt sicher ein Ass", "Der Schuh ist vollständig"],
    answer: 0,
    explanation: "Viele kleine Karten wurden bereits gesehen. Im Rest befinden sich relativ mehr Zehner und Asse."
  },
  {
    topic: "SYSTEM",
    question: "Warum heißt Hi-Lo ein balanciertes Zählsystem?",
    options: ["Alle Karten zählen gleich", "Ein vollständiges Deck summiert sich zu null", "Es nutzt nur gerade Zahlen", "Der True Count bleibt immer null"],
    answer: 1,
    explanation: "Fünf kleine Ränge mit je vier Karten ergeben +20, fünf hohe Ränge ergeben −20."
  },
  {
    topic: "DECKSCHÄTZUNG",
    question: "Wann wirkt sich ein Fehler bei der Restdeckschätzung besonders stark aus?",
    options: ["Bei sehr vielen Restdecks", "Kurz nach dem Mischen", "Bei wenigen Restkarten", "Nur bei negativem Count"],
    answer: 2,
    explanation: "Je kleiner der Divisor, desto stärker verändert eine kleine Schätzabweichung den True Count."
  },
  {
    topic: "STRATEGIE",
    question: "Welche Aussage ist richtig?",
    options: ["Counting ersetzt die Grundstrategie", "Counting garantiert Gewinn", "Counting ergänzt korrektes Basisspiel", "Counting beseitigt Varianz"],
    answer: 2,
    explanation: "Eine sichere Grundstrategie ist die Basis. Counting verändert nur ausgewählte Entscheidungen und Einschätzungen."
  },
  {
    topic: "PENETRATION",
    question: "Was bedeutet 75 % Penetration?",
    options: ["75 % der Karten sind hohe Karten", "Etwa 75 % des Schuhs werden vor dem Mischen gespielt", "Der Count ist zu 75 % genau", "75 Karten bleiben übrig"],
    answer: 1,
    explanation: "Penetration beschreibt, wie weit in den Schuh hinein gespielt wird, bevor neu gemischt wird."
  },
  {
    topic: "TRAINING",
    question: "Wann solltest du das Tempo erhöhen?",
    options: ["Nach jedem Fehler", "Sobald du die Werte gelesen hast", "Erst bei stabil hoher Genauigkeit", "Nur bei einem positiven Count"],
    answer: 2,
    explanation: "Automatisiere zuerst korrekte Reaktionen. Geschwindigkeit wird anschließend schrittweise ergänzt."
  },
  {
    topic: "RUNNING COUNT",
    question: "Welchen Schlusscount muss ein vollständig gezähltes einzelnes Hi-Lo-Deck haben?",
    options: ["−4", "0", "+4", "Das ist zufällig"],
    answer: 1,
    explanation: "Hi-Lo ist balanciert. Alle 52 Karten summieren sich deshalb zu null."
  },
  {
    topic: "PRAXIS",
    question: "Was ist beim Zählen mehrerer offener Karten meist am effizientesten?",
    options: ["Jede Farbe separat zählen", "Erst alle Ränge aufsagen", "+1/−1-Paare sofort aufheben", "Neutrale Karten doppelt zählen"],
    answer: 2,
    explanation: "Sich aufhebende Paare reduzieren die mentale Last und beschleunigen das Zählen."
  }
];

const modeLabels = {
  cardValues: "Kartenwerte",
  runningCount: "Running Count",
  trueCount: "True Count",
  deckEstimation: "Deckschätzung",
  shoeSimulator: "Schuh-Simulator",
  knowledgeQuiz: "Wissenstest"
};

const drillByMode = {
  cardValues: "card-values",
  runningCount: "running-count",
  trueCount: "true-count",
  deckEstimation: "deck-estimation",
  shoeSimulator: "shoe-simulator",
  knowledgeQuiz: "knowledge-quiz"
};

const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const suits = ["♠", "♥", "♦", "♣"];
const redSuits = new Set(["♥", "♦"]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved) return clone(initialState);
    const merged = clone(initialState);
    merged.xp = Number(saved.xp) || 0;
    merged.completedLessons = Array.isArray(saved.completedLessons) ? saved.completedLessons : [];
    merged.daily = { ...merged.daily, ...(saved.daily || {}) };
    merged.recent = Array.isArray(saved.recent) ? saved.recent.slice(0, 30) : [];
    Object.keys(merged.stats).forEach((key) => {
      merged.stats[key] = { ...merged.stats[key], ...((saved.stats || {})[key] || {}) };
    });
    return merged;
  } catch {
    return clone(initialState);
  }
}

let state = loadState();

function getDateKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function ensureDailyState() {
  const date = getDateKey();
  if (state.daily.date !== date) {
    state.daily = { date, attempts: 0, correct: 0 };
    saveState();
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function formatSigned(value) {
  if (value > 0) return `+${value}`;
  if (value < 0) return `−${Math.abs(value)}`;
  return "0";
}

function accuracy(stat) {
  return stat.attempts ? Math.round((stat.correct / stat.attempts) * 100) : 0;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function shuffle(array) {
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

function createShoe(deckCount) {
  const cards = [];
  for (let deck = 0; deck < deckCount; deck += 1) {
    ranks.forEach((rank) => {
      suits.forEach((suit) => cards.push({ rank, suit }));
    });
  }
  return shuffle(cards);
}

function hiLoValue(rank) {
  if (["2", "3", "4", "5", "6"].includes(rank)) return 1;
  if (["7", "8", "9"].includes(rank)) return 0;
  return -1;
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function recordResult(mode, correct, detail, options = {}) {
  const stat = state.stats[mode];
  stat.attempts += 1;
  if (correct) {
    stat.correct += 1;
    stat.currentStreak += 1;
    stat.bestStreak = Math.max(stat.bestStreak, stat.currentStreak);
  } else {
    stat.currentStreak = 0;
  }
  const earnedXp = correct ? options.correctXp || 8 : options.wrongXp || 1;
  state.xp += earnedXp;
  if (options.log !== false) {
    state.recent.unshift({
      mode,
      correct,
      detail,
      xp: earnedXp,
      timestamp: Date.now()
    });
    state.recent = state.recent.slice(0, 30);
  }
  saveState();
  updateAllStats();
}

function getTotals() {
  return Object.values(state.stats).reduce((totals, stat) => {
    totals.attempts += stat.attempts;
    totals.correct += stat.correct;
    totals.bestStreak = Math.max(totals.bestStreak, stat.bestStreak);
    return totals;
  }, { attempts: 0, correct: 0, bestStreak: 0 });
}

function levelName(level) {
  if (level >= 10) return "Count-Profi";
  if (level >= 7) return "Schuh-Meister";
  if (level >= 4) return "True-Count-Spezialist";
  if (level >= 2) return "Aufsteiger";
  return "Neuling";
}

function relativeTime(timestamp) {
  const seconds = Math.max(1, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return "gerade eben";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  return `vor ${days} Tg.`;
}

function updateRecent() {
  const container = document.getElementById("recentActivity");
  if (!state.recent.length) {
    container.innerHTML = '<div class="empty-activity">Noch keine Einheit. Starte mit den Kartenwerten.</div>';
    return;
  }
  container.innerHTML = state.recent.slice(0, 3).map((item) => `
    <div class="recent-item">
      <span>${item.correct ? "✓" : "×"}</span>
      <div><b>${escapeHtml(modeLabels[item.mode])}</b><small>${escapeHtml(item.detail)}</small></div>
      <time>${relativeTime(item.timestamp)}</time>
    </div>
  `).join("");
}

function updateHistory() {
  const container = document.getElementById("historyTable");
  const head = '<div class="history-row head"><span>MODUS</span><span>ERGEBNIS</span><span>XP</span><span>ZEIT</span></div>';
  if (!state.recent.length) {
    container.innerHTML = `${head}<div class="empty-activity">Deine letzten Einheiten erscheinen hier.</div>`;
    return;
  }
  const rows = state.recent.slice(0, 10).map((item) => `
    <div class="history-row">
      <b>${escapeHtml(modeLabels[item.mode])}</b>
      <span>${item.correct ? "Richtig" : "Noch üben"}</span>
      <span>+${item.xp} XP</span>
      <span>${relativeTime(item.timestamp)}</span>
    </div>
  `).join("");
  container.innerHTML = head + rows;
}

function updateSkillBars() {
  const container = document.getElementById("skillBars");
  container.innerHTML = Object.entries(state.stats).map(([mode, stat]) => {
    const percent = accuracy(stat);
    return `
      <div class="skill-bar">
        <div class="skill-bar-header"><span>${modeLabels[mode]}</span><b>${percent}%</b></div>
        <div class="skill-bar-track"><i style="width:${percent}%"></i></div>
      </div>
    `;
  }).join("");
}

function updateRecommendation() {
  const entries = Object.entries(state.stats).filter(([mode]) => mode !== "knowledgeQuiz");
  let target = entries.find(([, stat]) => stat.attempts === 0);
  if (!target) target = entries.sort((a, b) => accuracy(a[1]) - accuracy(b[1]))[0];
  const [mode, stat] = target;
  const title = stat.attempts ? `${modeLabels[mode]} gezielt verbessern` : `Starte mit ${modeLabels[mode]}`;
  const copy = stat.attempts
    ? `Deine aktuelle Genauigkeit liegt hier bei ${accuracy(stat)} %. Trainiere diesen Modus, bis du stabil mindestens 90 % erreichst.`
    : "In diesem Modus fehlen noch Übungsdaten. Eine kurze Einheit vervollständigt dein Fähigkeitsprofil.";
  document.getElementById("recommendationTitle").textContent = title;
  document.getElementById("recommendationCopy").textContent = copy;
  const button = document.getElementById("recommendationButton");
  button.dataset.targetDrill = drillByMode[mode];
}

function updateDaily() {
  ensureDailyState();
  const progress = Math.min(100, Math.round((state.daily.attempts / 20) * 100));
  const dailyAccuracy = state.daily.attempts ? Math.round((state.daily.correct / state.daily.attempts) * 100) : 0;
  setText("[data-daily-percent]", `${progress}%`);
  setText("[data-daily-attempts]", state.daily.attempts);
  setText("[data-daily-accuracy]", `${dailyAccuracy}%`);
  document.getElementById("dailyRing").style.background = `conic-gradient(var(--lime) ${progress * 3.6}deg, rgba(255, 255, 255, 0.08) 0deg)`;
  const today = new Intl.DateTimeFormat("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" }).format(new Date());
  document.getElementById("todayLabel").textContent = today.toUpperCase();
}

function updateLessonProgress() {
  const completed = state.completedLessons.length;
  const percent = Math.round((completed / lessons.length) * 100);
  setText("[data-lesson-percent]", `${percent}%`);
  setText("[data-lessons-complete]", completed);
  const nextLesson = lessons.find((lesson) => !state.completedLessons.includes(lesson.id)) || lessons[lessons.length - 1];
  document.querySelector("[data-next-lesson-title]").textContent = `${nextLesson.id}. ${nextLesson.title}`;
  document.querySelector("[data-next-lesson-copy]").textContent = nextLesson.summary;
  document.getElementById("continueLearning").dataset.lessonId = nextLesson.id;
}

function updateAllStats() {
  ensureDailyState();
  const totals = getTotals();
  const overall = totals.attempts ? Math.round((totals.correct / totals.attempts) * 100) : 0;
  const level = Math.floor(state.xp / 250) + 1;
  const currentXp = state.xp % 250;
  setText("[data-level]", level);
  setText("[data-xp-current]", currentXp);
  setText("[data-level-name]", levelName(level));
  setText("[data-total-xp]", state.xp);
  setText("[data-total-attempts]", totals.attempts);
  setText("[data-total-correct]", totals.correct);
  setText("[data-overall-accuracy]", `${overall}%`);
  setText("[data-best-streak]", totals.bestStreak);
  setText("[data-running-best]", state.stats.runningCount.bestStreak);
  setText("[data-running-attempts]", state.stats.runningCount.attempts);
  setText("[data-true-best]", state.stats.trueCount.bestStreak);
  setText("[data-true-accuracy]", `${accuracy(state.stats.trueCount)}%`);
  setText("[data-deck-best]", state.stats.deckEstimation.bestStreak);
  setText("[data-deck-accuracy]", `${accuracy(state.stats.deckEstimation)}%`);
  document.querySelectorAll("[data-level-progress]").forEach((element) => {
    element.style.width = `${(currentXp / 250) * 100}%`;
  });
  updateDaily();
  updateLessonProgress();
  updateRecent();
  updateHistory();
  updateSkillBars();
  updateRecommendation();
}

function renderLessons() {
  const container = document.getElementById("lessonTimeline");
  container.innerHTML = lessons.map((lesson) => {
    const completed = state.completedLessons.includes(lesson.id);
    return `
      <article class="lesson-card ${completed ? "completed" : ""}" data-lesson-card="${lesson.id}">
        <div class="lesson-number">${completed ? "✓" : String(lesson.id).padStart(2, "0")}</div>
        <div>
          <div class="lesson-title-row"><h2>${lesson.title}</h2><span class="lesson-tag">${lesson.tag}</span></div>
          <p class="lesson-summary">${lesson.summary}</p>
        </div>
        <button class="lesson-toggle" data-lesson-toggle="${lesson.id}" aria-label="Modul öffnen" aria-expanded="false">＋</button>
        <div class="lesson-details">
          <h3>Das lernst du</h3>
          <p>${lesson.lead}</p>
          <ul>${lesson.points.map((point) => `<li>${point}</li>`).join("")}</ul>
          <div class="lesson-actions">
            <button class="button secondary" data-lesson-drill="${lesson.drill}">Übung öffnen</button>
            <button class="button primary" data-complete-lesson="${lesson.id}">${completed ? "Als offen markieren" : "Modul abschließen"}</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function openLesson(id) {
  location.hash = "learn";
  setTimeout(() => {
    const card = document.querySelector(`[data-lesson-card="${id}"]`);
    if (!card) return;
    document.querySelectorAll(".lesson-card.expanded").forEach((element) => element.classList.remove("expanded"));
    card.classList.add("expanded");
    const toggle = card.querySelector(".lesson-toggle");
    toggle.textContent = "−";
    toggle.setAttribute("aria-expanded", "true");
    card.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 50);
}

function setRoute(route) {
  const allowed = ["dashboard", "learn", "practice", "reference", "stats"];
  const target = allowed.includes(route) ? route : "dashboard";
  document.querySelectorAll("[data-screen]").forEach((screen) => screen.classList.toggle("active", screen.dataset.screen === target));
  document.querySelectorAll("[data-route]").forEach((link) => link.classList.toggle("active", link.dataset.route === target));
  document.querySelector(".sidebar").classList.remove("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openDrill(drill) {
  location.hash = "practice";
  document.querySelectorAll("[data-drill]").forEach((button) => button.classList.toggle("active", button.dataset.drill === drill));
  document.querySelectorAll("[data-drill-view]").forEach((view) => view.classList.toggle("active", view.dataset.drillView === drill));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCard(element, card, centerText = card.rank) {
  element.classList.toggle("red", redSuits.has(card.suit));
  const corners = element.querySelectorAll(".card-corner");
  corners.forEach((corner) => {
    corner.querySelector("b").textContent = card.rank;
    corner.querySelector("i").textContent = card.suit;
  });
  element.querySelector(":scope > strong").textContent = centerText;
}

let valueCard = null;
let valueCardLocked = false;
let valueCardShownAt = 0;
let valueSession = { attempts: 0, correct: 0 };

function nextValueCard() {
  valueCard = {
    rank: ranks[Math.floor(Math.random() * ranks.length)],
    suit: suits[Math.floor(Math.random() * suits.length)]
  };
  renderCard(document.getElementById("valueCard"), valueCard, valueCard.suit);
  valueCardLocked = false;
  valueCardShownAt = performance.now();
  const feedback = document.getElementById("cardFeedback");
  feedback.className = "feedback-line";
  feedback.textContent = "Wähle den passenden Wert.";
  document.querySelectorAll("[data-card-answer]").forEach((button) => button.classList.remove("correct", "wrong"));
}

function answerValueCard(answer) {
  if (valueCardLocked || !valueCard) return;
  valueCardLocked = true;
  const expected = hiLoValue(valueCard.rank);
  const correct = answer === expected;
  const elapsed = (performance.now() - valueCardShownAt) / 1000;
  valueSession.attempts += 1;
  if (correct) valueSession.correct += 1;
  const selected = document.querySelector(`[data-card-answer="${answer}"]`);
  const expectedButton = document.querySelector(`[data-card-answer="${expected}"]`);
  selected.classList.add(correct ? "correct" : "wrong");
  expectedButton.classList.add("correct");
  const feedback = document.getElementById("cardFeedback");
  feedback.className = `feedback-line ${correct ? "success" : "error"}`;
  feedback.textContent = correct ? `${formatSigned(expected)} · richtig in ${elapsed.toFixed(1)} s` : `${valueCard.rank}${valueCard.suit} zählt ${formatSigned(expected)}.`;
  document.getElementById("cardStreak").textContent = correct ? state.stats.cardValues.currentStreak + 1 : 0;
  document.getElementById("cardAccuracy").textContent = `${Math.round((valueSession.correct / valueSession.attempts) * 100)}%`;
  document.getElementById("cardTime").textContent = `${elapsed.toFixed(1)}s`;
  ensureDailyState();
  state.daily.attempts += 1;
  if (correct) state.daily.correct += 1;
  recordResult("cardValues", correct, `${valueCard.rank}${valueCard.suit} = ${formatSigned(expected)}`, { log: valueSession.attempts % 5 === 0 });
  setTimeout(nextValueCard, 650);
}

let sprintActive = false;
let sprintShoe = [];
let sprintExpected = 0;
let sprintIndex = 0;

function finishSprint() {
  sprintActive = false;
  const card = document.getElementById("sprintCard");
  card.querySelector(":scope > strong").textContent = "?";
  document.getElementById("sprintStatus").textContent = "Folge beendet. Gib deinen finalen Running Count ein.";
  document.getElementById("countAnswerForm").classList.remove("hidden");
  document.getElementById("countAnswer").value = "";
  document.getElementById("countAnswer").focus();
  document.getElementById("startSprint").classList.add("hidden");
}

function showNextSprintCard() {
  if (!sprintActive) return;
  if (sprintIndex >= sprintShoe.length) {
    finishSprint();
    return;
  }
  const card = sprintShoe[sprintIndex];
  sprintIndex += 1;
  sprintExpected += hiLoValue(card.rank);
  renderCard(document.getElementById("sprintCard"), card, card.suit);
  document.getElementById("sprintPosition").textContent = sprintIndex;
  const speed = Number(document.getElementById("sprintSpeed").value);
  setTimeout(showNextSprintCard, speed);
}

function startSprint() {
  if (sprintActive) return;
  const length = Number(document.getElementById("sprintLength").value);
  sprintShoe = createShoe(1).slice(0, length);
  sprintExpected = 0;
  sprintIndex = 0;
  sprintActive = true;
  document.getElementById("sprintTotal").textContent = length;
  document.getElementById("sprintPosition").textContent = 0;
  document.getElementById("sprintStatus").textContent = "Konzentrieren. Die Folge startet jetzt.";
  document.getElementById("countAnswerForm").classList.add("hidden");
  document.getElementById("startSprint").disabled = true;
  setTimeout(showNextSprintCard, 450);
}

function submitSprint(event) {
  event.preventDefault();
  const answer = Number(document.getElementById("countAnswer").value);
  if (!Number.isFinite(answer)) return;
  const correct = answer === sprintExpected;
  const status = document.getElementById("sprintStatus");
  status.textContent = correct
    ? `Richtig: ${formatSigned(sprintExpected)}. Sauber gezählt.`
    : `Dein Count: ${formatSigned(answer)} · korrekt: ${formatSigned(sprintExpected)}.`;
  status.style.color = correct ? "var(--lime)" : "#ef8c8c";
  recordResult("runningCount", correct, `${sprintShoe.length} Karten · Ziel ${formatSigned(sprintExpected)}`, { correctXp: 18, wrongXp: 3 });
  document.getElementById("countAnswerForm").classList.add("hidden");
  const button = document.getElementById("startSprint");
  button.classList.remove("hidden");
  button.disabled = false;
  button.textContent = "Neuen Sprint starten";
}

let trueQuestion = null;
let trueLocked = false;

function generateTrueQuestion() {
  const deckOptions = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6];
  let running = 0;
  while (running === 0) running = Math.floor(Math.random() * 37) - 18;
  const decks = deckOptions[Math.floor(Math.random() * deckOptions.length)];
  const answer = Math.trunc(running / decks);
  const optionSet = new Set([answer]);
  const offsets = shuffle([-3, -2, -1, 1, 2, 3, 4, -4]);
  offsets.forEach((offset) => {
    if (optionSet.size < 4) optionSet.add(answer + offset);
  });
  trueQuestion = { running, decks, answer, options: shuffle([...optionSet]) };
  trueLocked = false;
  document.getElementById("trueRunning").textContent = formatSigned(running);
  document.getElementById("trueDecks").textContent = decks.toLocaleString("de-DE");
  const meter = document.getElementById("trueDeckMeter");
  meter.innerHTML = Array.from({ length: Math.floor(decks) }, () => "<span></span>").join("") + (decks % 1 ? '<span class="half"></span>' : "");
  document.getElementById("trueOptions").innerHTML = trueQuestion.options.map((option) => `<button data-true-answer="${option}"><b>${formatSigned(option)}</b></button>`).join("");
  const feedback = document.getElementById("trueFeedback");
  feedback.className = "feedback-line";
  feedback.textContent = "Wähle das Ergebnis.";
}

function answerTrueCount(button) {
  if (trueLocked) return;
  trueLocked = true;
  const answer = Number(button.dataset.trueAnswer);
  const correct = answer === trueQuestion.answer;
  button.classList.add(correct ? "correct" : "wrong");
  document.querySelector(`[data-true-answer="${trueQuestion.answer}"]`).classList.add("correct");
  const feedback = document.getElementById("trueFeedback");
  feedback.className = `feedback-line ${correct ? "success" : "error"}`;
  feedback.textContent = correct
    ? `${formatSigned(trueQuestion.running)} ÷ ${trueQuestion.decks} = ${formatSigned(trueQuestion.answer)}`
    : `Zur Null gerundet: ${formatSigned(trueQuestion.answer)}.`;
  recordResult("trueCount", correct, `${formatSigned(trueQuestion.running)} ÷ ${trueQuestion.decks} = ${formatSigned(trueQuestion.answer)}`);
  setTimeout(generateTrueQuestion, 950);
}

let deckEstimateActual = 3;
let deckEstimateLocked = false;

function formatDeckCount(value) {
  return `${value.toLocaleString("de-DE")} ${value === 1 ? "Deck" : "Decks"}`;
}

function generateDeckEstimate() {
  deckEstimateActual = (Math.floor(Math.random() * 23) + 2) / 4;
  deckEstimateLocked = false;
  document.getElementById("shoeCards").style.width = `${(deckEstimateActual / 6) * 100}%`;
  const range = document.getElementById("deckGuess");
  range.disabled = false;
  range.value = 3;
  document.getElementById("deckGuessOutput").textContent = "3 Decks";
  document.getElementById("checkDeckGuess").classList.remove("hidden");
  document.getElementById("nextDeckEstimate").classList.add("hidden");
  const feedback = document.getElementById("deckFeedback");
  feedback.className = "feedback-line";
  feedback.textContent = "Nutze Vierteldecks als Einheit.";
}

function checkDeckEstimate() {
  if (deckEstimateLocked) return;
  deckEstimateLocked = true;
  const guess = Number(document.getElementById("deckGuess").value);
  const difference = Math.abs(guess - deckEstimateActual);
  const correct = difference <= 0.25;
  const feedback = document.getElementById("deckFeedback");
  feedback.className = `feedback-line ${correct ? "success" : "error"}`;
  feedback.textContent = correct
    ? `Treffer: ${formatDeckCount(deckEstimateActual)} verbleiben.`
    : `Geschätzt: ${formatDeckCount(guess)} · tatsächlich: ${formatDeckCount(deckEstimateActual)}.`;
  document.getElementById("deckGuess").disabled = true;
  document.getElementById("checkDeckGuess").classList.add("hidden");
  document.getElementById("nextDeckEstimate").classList.remove("hidden");
  recordResult("deckEstimation", correct, `${formatDeckCount(guess)} / ${formatDeckCount(deckEstimateActual)}`);
}

let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

function startQuiz() {
  quizQuestions = shuffle(quizBank).slice(0, 10);
  quizIndex = 0;
  quizScore = 0;
  quizAnswered = false;
  document.getElementById("quizScore").textContent = 0;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  if (quizIndex >= quizQuestions.length) {
    document.getElementById("quizTopic").textContent = "ERGEBNIS";
    document.getElementById("quizQuestion").textContent = `${quizScore} von ${quizQuestions.length} richtig`;
    document.getElementById("quizOptions").innerHTML = "";
    const explanation = document.getElementById("quizExplanation");
    explanation.classList.remove("hidden");
    explanation.textContent = quizScore >= 9 ? "Sehr sicher. Übertrage das Wissen jetzt in den Schuh-Simulator." : quizScore >= 7 ? "Gute Basis. Wiederhole die unsicheren Themen im Lernpfad." : "Arbeite die ersten fünf Module durch und starte den Test erneut.";
    const button = document.getElementById("nextQuizQuestion");
    button.classList.remove("hidden");
    button.textContent = "Test neu starten";
    button.dataset.restart = "true";
    return;
  }
  const question = quizQuestions[quizIndex];
  quizAnswered = false;
  document.getElementById("quizNumber").textContent = quizIndex + 1;
  document.getElementById("quizTopic").textContent = question.topic;
  document.getElementById("quizQuestion").textContent = question.question;
  document.getElementById("quizOptions").innerHTML = question.options.map((option, index) => `
    <button data-quiz-answer="${index}"><span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${option}</span></button>
  `).join("");
  document.getElementById("quizExplanation").classList.add("hidden");
  const nextButton = document.getElementById("nextQuizQuestion");
  nextButton.classList.add("hidden");
  nextButton.textContent = "Nächste Frage";
  nextButton.dataset.restart = "false";
}

function answerQuiz(button) {
  if (quizAnswered) return;
  quizAnswered = true;
  const question = quizQuestions[quizIndex];
  const answer = Number(button.dataset.quizAnswer);
  const correct = answer === question.answer;
  if (correct) quizScore += 1;
  document.getElementById("quizScore").textContent = quizScore;
  button.classList.add(correct ? "correct" : "wrong");
  document.querySelector(`[data-quiz-answer="${question.answer}"]`).classList.add("correct");
  document.querySelectorAll("[data-quiz-answer]").forEach((option) => { option.disabled = true; });
  const explanation = document.getElementById("quizExplanation");
  explanation.textContent = question.explanation;
  explanation.classList.remove("hidden");
  document.getElementById("nextQuizQuestion").classList.remove("hidden");
  recordResult("knowledgeQuiz", correct, question.topic, { correctXp: 10 });
}

let simulatorShoe = [];
let simulatorPosition = 0;
let simulatorRunning = 0;
let simulatorDiscards = [];
let simulatorCutPosition = 234;
let simulatorBusy = false;

function simulatorDecksLeft() {
  return Math.max(0.25, (simulatorShoe.length - simulatorPosition) / 52);
}

function simulatorTrueCount() {
  return Math.trunc(simulatorRunning / simulatorDecksLeft());
}

function updateSimulator() {
  const remainingRatio = simulatorShoe.length ? (simulatorShoe.length - simulatorPosition) / simulatorShoe.length : 1;
  document.getElementById("simShoeFill").style.width = `${Math.max(0, remainingRatio * 100 - 4)}%`;
  document.getElementById("simCardsDealt").textContent = simulatorPosition;
  document.getElementById("simDecksLeft").textContent = simulatorDecksLeft().toFixed(1);
  const hidden = document.getElementById("hideSimCount").checked;
  document.getElementById("simRunningCount").textContent = hidden ? "••" : formatSigned(simulatorRunning);
  document.getElementById("simTrueCount").textContent = hidden ? "••" : formatSigned(simulatorTrueCount());
  document.getElementById("discardTray").innerHTML = simulatorDiscards.slice(-14).map((card) => `<span class="discard-card ${redSuits.has(card.suit) ? "red" : ""}">${card.rank}${card.suit}</span>`).join("");
  const reachedCut = simulatorPosition >= simulatorCutPosition;
  document.getElementById("dealOne").disabled = reachedCut || simulatorBusy;
  document.getElementById("dealRound").disabled = reachedCut || simulatorBusy;
  if (reachedCut) document.getElementById("simStatus").textContent = "Cut Card erreicht · neu mischen";
}

function shuffleSimulator() {
  simulatorShoe = createShoe(6);
  simulatorPosition = 0;
  simulatorRunning = 0;
  simulatorDiscards = [];
  simulatorBusy = false;
  const penetration = Number(document.getElementById("simPenetration").value);
  simulatorCutPosition = Math.floor(simulatorShoe.length * penetration);
  document.getElementById("simCutCard").style.left = `${penetration * 100}%`;
  const card = document.getElementById("simCurrentCard");
  card.classList.remove("red");
  card.querySelector(":scope > strong").textContent = "READY";
  card.querySelectorAll(".card-corner b").forEach((element) => { element.textContent = "?"; });
  document.getElementById("simCountDelta").textContent = "Noch keine Karte";
  document.getElementById("simStatus").textContent = "Neu gemischt · Count startet bei 0";
  document.getElementById("simCountGuess").value = "";
  updateSimulator();
}

function dealSimulatorCard() {
  if (simulatorPosition >= simulatorCutPosition || simulatorPosition >= simulatorShoe.length) return false;
  const card = simulatorShoe[simulatorPosition];
  simulatorPosition += 1;
  const delta = hiLoValue(card.rank);
  simulatorRunning += delta;
  simulatorDiscards.push(card);
  renderCard(document.getElementById("simCurrentCard"), card, card.suit);
  const hidden = document.getElementById("hideSimCount").checked;
  document.getElementById("simCountDelta").textContent = hidden ? "Count verdeckt" : `${card.rank} zählt ${formatSigned(delta)}`;
  document.getElementById("simStatus").textContent = `${card.rank}${card.suit} gegeben`;
  updateSimulator();
  return true;
}

function dealSimulatorRound() {
  if (simulatorBusy || simulatorPosition >= simulatorCutPosition) return;
  simulatorBusy = true;
  updateSimulator();
  let dealt = 0;
  const step = () => {
    if (dealt >= 6 || !dealSimulatorCard()) {
      simulatorBusy = false;
      updateSimulator();
      document.getElementById("simStatus").textContent = dealt ? `Runde mit ${dealt} Karten gegeben` : "Cut Card erreicht";
      return;
    }
    dealt += 1;
    setTimeout(step, 240);
  };
  step();
}

function checkSimulatorCount(event) {
  event.preventDefault();
  const input = document.getElementById("simCountGuess");
  if (input.value.trim() === "") return;
  const guess = Number(input.value);
  const correct = guess === simulatorRunning;
  document.getElementById("simStatus").textContent = correct
    ? `Count stimmt: ${formatSigned(simulatorRunning)}`
    : `Dein Count ${formatSigned(guess)} · korrekt ${formatSigned(simulatorRunning)}`;
  recordResult("shoeSimulator", correct, `${simulatorPosition} Karten · ${formatSigned(guess)} / ${formatSigned(simulatorRunning)}`, { correctXp: 15, wrongXp: 2 });
  input.select();
}

function initializeEvents() {
  window.addEventListener("hashchange", () => setRoute(location.hash.slice(1)));
  document.getElementById("menuToggle").addEventListener("click", () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("open");
    document.getElementById("menuToggle").setAttribute("aria-expanded", sidebar.classList.contains("open") ? "true" : "false");
  });
  document.querySelectorAll("[data-open-drill]").forEach((button) => {
    button.addEventListener("click", () => openDrill(button.dataset.openDrill));
  });
  document.querySelectorAll("[data-drill]").forEach((button) => {
    button.addEventListener("click", () => openDrill(button.dataset.drill));
  });
  document.getElementById("recommendationButton").addEventListener("click", (event) => openDrill(event.currentTarget.dataset.targetDrill));
  document.getElementById("continueLearning").addEventListener("click", (event) => openLesson(Number(event.currentTarget.dataset.lessonId)));
  document.getElementById("lessonTimeline").addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-lesson-toggle]");
    if (toggle) {
      const card = toggle.closest(".lesson-card");
      const expanded = card.classList.toggle("expanded");
      toggle.textContent = expanded ? "−" : "＋";
      toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
      return;
    }
    const drillButton = event.target.closest("[data-lesson-drill]");
    if (drillButton) {
      openDrill(drillButton.dataset.lessonDrill);
      return;
    }
    const completeButton = event.target.closest("[data-complete-lesson]");
    if (completeButton) {
      const id = Number(completeButton.dataset.completeLesson);
      const completed = state.completedLessons.includes(id);
      if (completed) {
        state.completedLessons = state.completedLessons.filter((lessonId) => lessonId !== id);
        state.xp = Math.max(0, state.xp - 30);
      } else {
        state.completedLessons.push(id);
        state.xp += 30;
        showToast("Modul abgeschlossen · +30 XP");
      }
      saveState();
      renderLessons();
      updateAllStats();
    }
  });
  document.querySelectorAll("[data-card-answer]").forEach((button) => {
    button.addEventListener("click", () => answerValueCard(Number(button.dataset.cardAnswer)));
  });
  document.addEventListener("keydown", (event) => {
    const practiceActive = document.querySelector('[data-screen="practice"]').classList.contains("active");
    const valuesActive = document.querySelector('[data-drill-view="card-values"]').classList.contains("active");
    if (!practiceActive || !valuesActive || ["INPUT", "SELECT"].includes(document.activeElement.tagName)) return;
    if (event.key === "1" || event.key === "+") answerValueCard(1);
    if (event.key === "0") answerValueCard(0);
    if (event.key === "-" || event.key === "−") answerValueCard(-1);
  });
  document.getElementById("startSprint").addEventListener("click", startSprint);
  document.getElementById("countAnswerForm").addEventListener("submit", submitSprint);
  document.getElementById("sprintLength").addEventListener("change", (event) => {
    document.getElementById("sprintTotal").textContent = event.target.value;
  });
  document.getElementById("trueOptions").addEventListener("click", (event) => {
    const button = event.target.closest("[data-true-answer]");
    if (button) answerTrueCount(button);
  });
  document.getElementById("deckGuess").addEventListener("input", (event) => {
    document.getElementById("deckGuessOutput").textContent = formatDeckCount(Number(event.target.value));
  });
  document.getElementById("checkDeckGuess").addEventListener("click", checkDeckEstimate);
  document.getElementById("nextDeckEstimate").addEventListener("click", generateDeckEstimate);
  document.getElementById("quizOptions").addEventListener("click", (event) => {
    const button = event.target.closest("[data-quiz-answer]");
    if (button) answerQuiz(button);
  });
  document.getElementById("nextQuizQuestion").addEventListener("click", (event) => {
    if (event.currentTarget.dataset.restart === "true") {
      startQuiz();
    } else {
      quizIndex += 1;
      renderQuizQuestion();
    }
  });
  document.getElementById("shuffleShoe").addEventListener("click", shuffleSimulator);
  document.getElementById("simPenetration").addEventListener("change", shuffleSimulator);
  document.getElementById("hideSimCount").addEventListener("change", updateSimulator);
  document.getElementById("dealOne").addEventListener("click", dealSimulatorCard);
  document.getElementById("dealRound").addEventListener("click", dealSimulatorRound);
  document.getElementById("simCheckForm").addEventListener("submit", checkSimulatorCount);
  document.getElementById("printReference").addEventListener("click", () => window.print());
  const resetDialog = document.getElementById("resetDialog");
  document.getElementById("resetProgress").addEventListener("click", () => resetDialog.showModal());
  document.getElementById("cancelReset").addEventListener("click", () => resetDialog.close());
  document.getElementById("confirmReset").addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    state = clone(initialState);
    ensureDailyState();
    renderLessons();
    updateAllStats();
    resetDialog.close();
    showToast("Fortschritt wurde zurückgesetzt.");
  });
}

function initialize() {
  ensureDailyState();
  renderLessons();
  initializeEvents();
  nextValueCard();
  generateTrueQuestion();
  generateDeckEstimate();
  startQuiz();
  shuffleSimulator();
  updateAllStats();
  setRoute(location.hash.slice(1) || "dashboard");
}

initialize();
