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
  blackjack: {
    bankroll: 1000,
    handsPlayed: 0,
    wins: 0,
    losses: 0,
    pushes: 0,
    profit: 0,
    bestBankroll: 1000,
    decisions: 0,
    correctDecisions: 0,
    history: []
  },
  gameRules: {
    decks: 6,
    dealerHitsSoft17: false,
    payout: 1.5,
    penetration: 0.75,
    surrender: true
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
  knowledgeQuiz: "Wissenstest",
  blackjack: "Blackjack-Tisch"
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
    merged.blackjack = { ...merged.blackjack, ...(saved.blackjack || {}) };
    merged.gameRules = { ...merged.gameRules, ...(saved.gameRules || {}) };
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
  const allowed = ["dashboard", "play", "learn", "practice", "reference", "stats"];
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

const gameActionLabels = {
  hit: "Hit",
  stand: "Stand",
  double: "Double",
  split: "Split",
  surrender: "Surrender",
  insurance: "Insurance",
  "no-insurance": "Keine Insurance"
};

let gameShoe = [];
let gameShoePosition = 0;
let gameRunningCount = 0;
let gameBet = 25;
let gameRound = {
  phase: "betting",
  dealer: [],
  hands: [],
  activeHand: 0,
  roundStartBankroll: 1000,
  insuranceBet: 0,
  lastCoach: ""
};

function gameRules() {
  return state.gameRules;
}

function gameCutPosition() {
  return Math.floor(gameShoe.length * gameRules().penetration);
}

function gameDecksLeft() {
  return Math.max(0.25, (gameShoe.length - gameShoePosition) / 52);
}

function gameTrueCount() {
  return Math.trunc(gameRunningCount / gameDecksLeft());
}

function formatChips(value) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value);
}

function cardPointValue(rank) {
  if (rank === "A") return 11;
  if (["J", "Q", "K"].includes(rank)) return 10;
  return Number(rank);
}

function handValue(cards) {
  let total = cards.reduce((sum, card) => sum + cardPointValue(card.rank), 0);
  let aces = cards.filter((card) => card.rank === "A").length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return { total, soft: aces > 0 };
}

function isNatural(hand) {
  return hand.cards.length === 2 && handValue(hand.cards).total === 21 && !hand.fromSplit;
}

function sameSplitValue(cards) {
  return cards.length === 2 && cardPointValue(cards[0].rank) === cardPointValue(cards[1].rank);
}

function prepareGameShoe() {
  gameShoe = createShoe(gameRules().decks);
  gameShoePosition = 0;
  gameRunningCount = 0;
}

function drawGameCard(exposed = true) {
  if (!gameShoe.length || gameShoePosition >= gameShoe.length) prepareGameShoe();
  const source = gameShoe[gameShoePosition];
  gameShoePosition += 1;
  const card = { ...source, counted: exposed };
  if (exposed) gameRunningCount += hiLoValue(card.rank);
  return card;
}

function revealGameCard(card) {
  if (!card.counted) {
    card.counted = true;
    gameRunningCount += hiLoValue(card.rank);
  }
}

function gameCardMarkup(card, hidden, index) {
  if (hidden) return `<div class="game-card face-down" style="--card-rotation:${index % 2 ? 1.5 : -1.5}deg"></div>`;
  return `<div class="game-card ${redSuits.has(card.suit) ? "red" : ""}" style="--card-rotation:${index % 2 ? 1.5 : -1.5}deg"><span>${card.rank}<i>${card.suit}</i></span><b>${card.suit}</b></div>`;
}

function currentGameHand() {
  return gameRound.hands[gameRound.activeHand] || null;
}

function canGameDouble(hand = currentGameHand()) {
  return Boolean(hand && hand.state === "playing" && hand.cards.length === 2 && state.blackjack.bankroll >= hand.bet && !hand.splitAces);
}

function canGameSplit(hand = currentGameHand()) {
  return Boolean(hand && hand.state === "playing" && hand.cards.length === 2 && sameSplitValue(hand.cards) && gameRound.hands.length < 4 && state.blackjack.bankroll >= hand.bet && !hand.splitAces);
}

function canGameSurrender(hand = currentGameHand()) {
  return Boolean(hand && gameRules().surrender && hand.state === "playing" && hand.cards.length === 2 && !hand.fromSplit);
}

function dealerUpValue() {
  return gameRound.dealer.length ? cardPointValue(gameRound.dealer[0].rank) : 0;
}

function strategyForHand(hand = currentGameHand()) {
  if (!hand || !gameRound.dealer.length) return { action: "stand", reason: "Keine aktive Hand." };
  const dealer = dealerUpValue();
  const value = handValue(hand.cards);
  const total = value.total;
  const trueCount = gameTrueCount();
  const pairValue = sameSplitValue(hand.cards) ? cardPointValue(hand.cards[0].rank) : null;
  if (gameRound.phase === "insurance") {
    if (trueCount >= 3) return { action: "insurance", reason: `Hi-Lo-Index: Insurance ab TC +3. Aktuell ${formatSigned(trueCount)}.` };
    return { action: "no-insurance", reason: `Insurance wird erst ab TC +3 interessant. Aktuell ${formatSigned(trueCount)}.` };
  }
  if (canGameSurrender(hand)) {
    if (total === 17 && dealer === 11 && gameRules().dealerHitsSoft17) return { action: "surrender", reason: "H17-Regel: Hard 17 gegen Ass aufgeben." };
    if (pairValue === 8 && dealer === 11 && gameRules().dealerHitsSoft17) return { action: "surrender", reason: "H17-Regel: 8,8 gegen Ass aufgeben." };
    if (total === 16 && pairValue !== 8 && [9, 10, 11].includes(dealer)) return { action: "surrender", reason: "Hard 16 gegen starke Dealerkarte aufgeben." };
    if (total === 15 && dealer === 10) return { action: "surrender", reason: "Hard 15 gegen 10 aufgeben." };
  }
  if (!value.soft && pairValue === null) {
    if (total === 16 && dealer === 10 && trueCount >= 0) return { action: "stand", reason: `Hi-Lo-Abweichung: 16 gegen 10 ab TC 0 stehen. Aktuell ${formatSigned(trueCount)}.` };
    if (total === 15 && dealer === 10 && trueCount >= 4) return { action: "stand", reason: `Hi-Lo-Abweichung: 15 gegen 10 ab TC +4 stehen. Aktuell ${formatSigned(trueCount)}.` };
    if (total === 12 && dealer === 3 && trueCount >= 2) return { action: "stand", reason: `Hi-Lo-Abweichung: 12 gegen 3 ab TC +2 stehen. Aktuell ${formatSigned(trueCount)}.` };
    if (total === 12 && dealer === 2 && trueCount >= 3) return { action: "stand", reason: `Hi-Lo-Abweichung: 12 gegen 2 ab TC +3 stehen. Aktuell ${formatSigned(trueCount)}.` };
    if (total === 10 && dealer === 10 && trueCount >= 4 && canGameDouble(hand)) return { action: "double", reason: `Hi-Lo-Abweichung: 10 gegen 10 ab TC +4 verdoppeln. Aktuell ${formatSigned(trueCount)}.` };
  }
  if (pairValue !== null && canGameSplit(hand)) {
    if (pairValue === 11) return { action: "split", reason: "Asse werden immer geteilt." };
    if (pairValue === 10) return { action: "stand", reason: "Zehnerpaare bleiben als starke 20 zusammen." };
    if (pairValue === 9) return { action: [2, 3, 4, 5, 6, 8, 9].includes(dealer) ? "split" : "stand", reason: "9,9 wird gegen 2–6, 8 und 9 geteilt." };
    if (pairValue === 8) return { action: "split", reason: "Achter werden geteilt." };
    if (pairValue === 7) return { action: dealer <= 7 ? "split" : "hit", reason: "7,7 wird gegen 2–7 geteilt." };
    if (pairValue === 6) return { action: dealer <= 6 ? "split" : "hit", reason: "6,6 wird mit DAS gegen 2–6 geteilt." };
    if (pairValue === 4) return { action: [5, 6].includes(dealer) ? "split" : "hit", reason: "4,4 wird mit DAS nur gegen 5 oder 6 geteilt." };
    if ([2, 3].includes(pairValue)) return { action: dealer <= 7 ? "split" : "hit", reason: "2,2 und 3,3 werden mit DAS gegen 2–7 geteilt." };
  }
  if (value.soft) {
    if (total >= 20) return { action: "stand", reason: `Soft ${total} ist eine starke Hand.` };
    if (total === 19) {
      if (dealer === 6 && gameRules().dealerHitsSoft17 && canGameDouble(hand)) return { action: "double", reason: "Soft 19 gegen 6 im H17-Spiel verdoppeln." };
      return { action: "stand", reason: "Soft 19 wird normalerweise gehalten." };
    }
    if (total === 18) {
      const doubleRange = gameRules().dealerHitsSoft17 ? [2, 3, 4, 5, 6] : [3, 4, 5, 6];
      if (doubleRange.includes(dealer) && canGameDouble(hand)) return { action: "double", reason: `Soft 18 gegen ${dealer} verdoppeln.` };
      if ([2, 7, 8].includes(dealer)) return { action: "stand", reason: `Soft 18 gegen ${dealer} halten.` };
      return { action: "hit", reason: "Soft 18 gegen 9, 10 oder Ass ziehen." };
    }
    if (total === 17 && [3, 4, 5, 6].includes(dealer) && canGameDouble(hand)) return { action: "double", reason: "Soft 17 gegen 3–6 verdoppeln." };
    if ([15, 16].includes(total) && [4, 5, 6].includes(dealer) && canGameDouble(hand)) return { action: "double", reason: `Soft ${total} gegen 4–6 verdoppeln.` };
    if ([13, 14].includes(total) && [5, 6].includes(dealer) && canGameDouble(hand)) return { action: "double", reason: `Soft ${total} gegen 5–6 verdoppeln.` };
    return { action: "hit", reason: `Soft ${total} braucht eine weitere Karte.` };
  }
  if (total >= 17) return { action: "stand", reason: `Hard ${total} wird gehalten.` };
  if (total >= 13) return { action: dealer <= 6 ? "stand" : "hit", reason: `Hard ${total}: gegen 2–6 stehen, sonst ziehen.` };
  if (total === 12) return { action: [4, 5, 6].includes(dealer) ? "stand" : "hit", reason: "Hard 12 steht nur gegen 4–6." };
  if (total === 11 && canGameDouble(hand)) return { action: "double", reason: "Hard 11 wird verdoppelt." };
  if (total === 10 && dealer <= 9 && canGameDouble(hand)) return { action: "double", reason: "Hard 10 wird gegen 2–9 verdoppelt." };
  if (total === 9 && [3, 4, 5, 6].includes(dealer) && canGameDouble(hand)) return { action: "double", reason: "Hard 9 wird gegen 3–6 verdoppelt." };
  return { action: "hit", reason: `Hard ${total} braucht eine weitere Karte.` };
}

function renderGameHand(hand, index) {
  const value = handValue(hand.cards);
  const active = gameRound.phase === "player" && gameRound.activeHand === index;
  const resultClass = hand.outcome === "win" ? "result-win" : hand.outcome === "loss" ? "result-loss" : "";
  const label = gameRound.hands.length > 1 ? `HAND ${index + 1}` : "SPIELER";
  const totalLabel = value.total > 21 ? "BUST" : value.soft && value.total < 21 ? `SOFT ${value.total}` : value.total;
  return `
    <div class="player-hand ${active ? "active" : ""} ${resultClass}">
      <div class="hand-label"><span>${label}</span><b>${totalLabel}</b><span>${formatChips(hand.bet)} Chips</span></div>
      <div class="table-hand">${hand.cards.map((card, cardIndex) => gameCardMarkup(card, false, cardIndex)).join("")}</div>
      <div class="hand-result">${hand.resultText || ""}</div>
    </div>
  `;
}

function updateGameStatsUi() {
  const data = state.blackjack;
  document.getElementById("gameBankroll").textContent = formatChips(data.bankroll);
  document.getElementById("gameHandsPlayed").textContent = data.handsPlayed;
  document.getElementById("gameWins").textContent = data.wins;
  document.getElementById("gameProfit").textContent = `${data.profit > 0 ? "+" : ""}${formatChips(data.profit)}`;
  document.getElementById("gameProfit").style.color = data.profit > 0 ? "var(--lime)" : data.profit < 0 ? "#ef9999" : "var(--text)";
  const decisionAccuracy = data.decisions ? Math.round((data.correctDecisions / data.decisions) * 100) : 0;
  document.getElementById("gameDecisionAccuracy").textContent = `${decisionAccuracy}%`;
  const history = data.history || [];
  document.getElementById("gameHistory").innerHTML = history.slice(0, 5).map((item) => `
    <div class="game-history-row"><span>${escapeHtml(item.label)}</span><b class="${item.profit > 0 ? "win" : item.profit < 0 ? "loss" : ""}">${item.profit > 0 ? "+" : ""}${formatChips(item.profit)}</b></div>
  `).join("") || '<div class="empty-activity">Noch keine gespielte Runde.</div>';
}

function updateGameRecommendation() {
  const box = document.getElementById("strategyRecommendation");
  const show = document.getElementById("showGameCoach").checked;
  if (!show) {
    box.innerHTML = '<small>COACH AUS</small><strong>Selbst entscheiden</strong><span>Aktiviere den Coach, um die Empfehlung vor deiner Aktion zu sehen.</span>';
    return;
  }
  if (!["player", "insurance"].includes(gameRound.phase)) {
    box.innerHTML = '<small>EMPFEHLUNG</small><strong>Warte auf die Karten</strong><span>Der Coach erscheint, sobald eine Entscheidung ansteht.</span>';
    return;
  }
  const recommendation = strategyForHand();
  box.innerHTML = `<small>EMPFEHLUNG</small><strong>${gameActionLabels[recommendation.action]}</strong><span>${recommendation.reason}</span>`;
}

function updateGameUi() {
  const rules = gameRules();
  const activeRound = ["player", "dealer", "insurance", "dealing"].includes(gameRound.phase);
  const controlsOpen = !activeRound;
  const remainingCards = Math.max(0, gameShoe.length - gameShoePosition);
  const remainingRatio = gameShoe.length ? remainingCards / gameShoe.length : 1;
  document.getElementById("gameBet").textContent = formatChips(gameBet);
  document.getElementById("gameShoeProgress").style.width = `${remainingRatio * 100}%`;
  document.getElementById("gameCutMarker").style.left = `${rules.penetration * 100}%`;
  document.getElementById("gameCardsRemaining").textContent = `${remainingCards} Karten`;
  document.getElementById("tableRuleSummary").textContent = `${rules.decks} ${rules.decks === 1 ? "Deck" : "Decks"} · ${rules.dealerHitsSoft17 ? "H17" : "S17"} · ${rules.payout === 1.5 ? "3:2" : "6:5"} · ${rules.surrender ? "LS" : "kein LS"}`;
  document.querySelector(".table-logo b").textContent = `PAYS ${rules.payout === 1.5 ? "3 TO 2" : "6 TO 5"}`;
  document.querySelector(".table-logo small").textContent = rules.dealerHitsSoft17 ? "DEALER HITS SOFT 17" : "DEALER STANDS ON ALL 17";
  const hideCount = document.getElementById("hideGameCount").checked;
  document.getElementById("gameRunningCount").textContent = hideCount ? "••" : formatSigned(gameRunningCount);
  document.getElementById("gameTrueCount").textContent = hideCount ? "••" : formatSigned(gameTrueCount());
  document.getElementById("gameDecksLeft").textContent = gameDecksLeft().toFixed(1);
  const dealerHidden = gameRound.dealer.length > 1 && !gameRound.dealer[1].counted;
  document.getElementById("dealerHand").innerHTML = gameRound.dealer.map((card, index) => gameCardMarkup(card, index === 1 && dealerHidden, index)).join("");
  if (!gameRound.dealer.length) {
    document.getElementById("dealerTotal").textContent = "–";
  } else if (dealerHidden) {
    document.getElementById("dealerTotal").textContent = cardPointValue(gameRound.dealer[0].rank);
  } else {
    const dealerValue = handValue(gameRound.dealer).total;
    document.getElementById("dealerTotal").textContent = dealerValue > 21 ? "BUST" : dealerValue;
  }
  document.getElementById("playerHands").innerHTML = gameRound.hands.map(renderGameHand).join("") || '<div class="empty-seat">Einsatz platzieren</div>';
  const standardButtons = ["gameHit", "gameStand", "gameDouble", "gameSplit", "gameSurrender"];
  standardButtons.forEach((id) => document.getElementById(id).classList.toggle("hidden", gameRound.phase !== "player"));
  document.getElementById("gameInsurance").classList.toggle("hidden", gameRound.phase !== "insurance");
  document.getElementById("gameNoInsurance").classList.toggle("hidden", gameRound.phase !== "insurance");
  if (gameRound.phase === "player") {
    document.getElementById("gameHit").disabled = false;
    document.getElementById("gameStand").disabled = false;
    document.getElementById("gameDouble").disabled = !canGameDouble();
    document.getElementById("gameSplit").disabled = !canGameSplit();
    document.getElementById("gameSurrender").disabled = !canGameSurrender();
  }
  document.getElementById("gameInsurance").disabled = gameRound.phase !== "insurance" || state.blackjack.bankroll < gameBet / 2;
  document.querySelectorAll("[data-chip]").forEach((button) => { button.disabled = !controlsOpen; });
  document.getElementById("clearGameBet").disabled = !controlsOpen;
  const dealButton = document.getElementById("dealGameRound");
  dealButton.disabled = !controlsOpen || gameBet <= 0 || gameBet > state.blackjack.bankroll;
  dealButton.textContent = gameRound.phase === "settled" ? "Nächste Runde" : gameRound.phase === "betting" ? "Karten geben" : "Runde läuft";
  ["gameRuleDecks", "gameRuleSoft17", "gameRulePayout", "gameRulePenetration", "gameRuleSurrender"].forEach((id) => {
    document.getElementById(id).disabled = activeRound;
  });
  updateGameRecommendation();
  updateGameStatsUi();
}

function setRoundMessage(message, tone = "") {
  const element = document.getElementById("roundMessage");
  element.textContent = message;
  element.className = `round-message ${tone}`.trim();
}

function dealerHasNatural() {
  return gameRound.dealer.length === 2 && handValue(gameRound.dealer).total === 21;
}

function beginPlayerPhase() {
  if (isNatural(gameRound.hands[0])) {
    settleGameRound(false);
    return;
  }
  gameRound.phase = "player";
  gameRound.activeHand = 0;
  setRoundMessage("Deine Entscheidung.");
  updateGameUi();
}

function beginGameRound() {
  if (!["betting", "settled"].includes(gameRound.phase)) return;
  if (gameBet <= 0 || gameBet > state.blackjack.bankroll) {
    showToast("Wähle einen gültigen Einsatz.");
    return;
  }
  if (!gameShoe.length || gameShoePosition >= gameCutPosition()) {
    prepareGameShoe();
    showToast("Cut Card erreicht · neuer Schuh gemischt.");
  }
  const roundStartBankroll = state.blackjack.bankroll;
  state.blackjack.bankroll -= gameBet;
  gameRound = {
    phase: "dealing",
    dealer: [],
    hands: [{ cards: [], bet: gameBet, state: "playing", fromSplit: false, splitAces: false, resultText: "", outcome: "" }],
    activeHand: 0,
    roundStartBankroll,
    insuranceBet: 0,
    lastCoach: ""
  };
  const hand = gameRound.hands[0];
  hand.cards.push(drawGameCard(true));
  gameRound.dealer.push(drawGameCard(true));
  hand.cards.push(drawGameCard(true));
  gameRound.dealer.push(drawGameCard(false));
  if (dealerUpValue() === 11) {
    gameRound.phase = "insurance";
    setRoundMessage("Dealer zeigt Ass. Insurance wählen oder ablehnen.");
  } else if (dealerUpValue() === 10 && dealerHasNatural()) {
    revealGameCard(gameRound.dealer[1]);
    settleGameRound(true);
    return;
  } else {
    beginPlayerPhase();
    return;
  }
  saveState();
  updateGameUi();
}

function handleGameInsurance(takeInsurance) {
  if (gameRound.phase !== "insurance") return;
  const recommendation = strategyForHand();
  evaluateGameDecision(takeInsurance ? "insurance" : "no-insurance", recommendation);
  if (takeInsurance) {
    const insuranceBet = gameBet / 2;
    if (state.blackjack.bankroll < insuranceBet) {
      showToast("Nicht genug Guthaben für Insurance.");
      return;
    }
    state.blackjack.bankroll -= insuranceBet;
    gameRound.insuranceBet = insuranceBet;
  }
  if (dealerHasNatural()) {
    if (gameRound.insuranceBet) state.blackjack.bankroll += gameRound.insuranceBet * 3;
    revealGameCard(gameRound.dealer[1]);
    settleGameRound(true);
    return;
  }
  setRoundMessage(gameRound.insuranceBet ? "Keine Dealer-Blackjack. Insurance verloren." : "Keine Dealer-Blackjack. Runde läuft weiter.");
  beginPlayerPhase();
}

function evaluateGameDecision(action, recommendation = strategyForHand()) {
  if (!["hit", "stand", "double", "split", "surrender", "insurance", "no-insurance"].includes(action)) return;
  const correct = action === recommendation.action;
  state.blackjack.decisions += 1;
  if (correct) {
    state.blackjack.correctDecisions += 1;
    state.xp += 1;
  }
  gameRound.lastCoach = correct ? `Strategisch korrekt: ${gameActionLabels[action]}.` : `Coach: ${gameActionLabels[recommendation.action]} wäre empfohlen.`;
  const coachMessage = document.getElementById("coachMessage");
  coachMessage.textContent = gameRound.lastCoach;
  coachMessage.classList.toggle("hidden", !document.getElementById("showGameCoach").checked);
  saveState();
}

function advanceGameHand() {
  let next = gameRound.activeHand + 1;
  while (next < gameRound.hands.length && gameRound.hands[next].state !== "playing") next += 1;
  if (next < gameRound.hands.length) {
    gameRound.activeHand = next;
    setRoundMessage(`Hand ${next + 1} ist aktiv.`);
    updateGameUi();
    return;
  }
  const liveHand = gameRound.hands.some((hand) => !["bust", "surrendered"].includes(hand.state));
  if (liveHand) playGameDealer();
  else settleGameRound(false);
}

function gameHit() {
  if (gameRound.phase !== "player") return;
  evaluateGameDecision("hit");
  const hand = currentGameHand();
  hand.cards.push(drawGameCard(true));
  const total = handValue(hand.cards).total;
  if (total > 21) {
    hand.state = "bust";
    hand.resultText = "Bust";
    advanceGameHand();
  } else if (total === 21) {
    hand.state = "stood";
    hand.resultText = "21";
    advanceGameHand();
  } else {
    setRoundMessage(`Hand steht bei ${total}.`);
    updateGameUi();
  }
}

function gameStand() {
  if (gameRound.phase !== "player") return;
  evaluateGameDecision("stand");
  const hand = currentGameHand();
  hand.state = "stood";
  hand.resultText = `Steht bei ${handValue(hand.cards).total}`;
  advanceGameHand();
}

function gameDouble() {
  const hand = currentGameHand();
  if (gameRound.phase !== "player" || !canGameDouble(hand)) return;
  evaluateGameDecision("double");
  state.blackjack.bankroll -= hand.bet;
  hand.bet *= 2;
  hand.cards.push(drawGameCard(true));
  const total = handValue(hand.cards).total;
  hand.state = total > 21 ? "bust" : "stood";
  hand.resultText = total > 21 ? "Double · Bust" : `Double · ${total}`;
  advanceGameHand();
}

function gameSplit() {
  const hand = currentGameHand();
  if (gameRound.phase !== "player" || !canGameSplit(hand)) return;
  evaluateGameDecision("split");
  state.blackjack.bankroll -= hand.bet;
  const splittingAces = hand.cards[0].rank === "A" && hand.cards[1].rank === "A";
  const first = { cards: [hand.cards[0], drawGameCard(true)], bet: hand.bet, state: splittingAces ? "stood" : "playing", fromSplit: true, splitAces: splittingAces, resultText: splittingAces ? "Split-Ass" : "", outcome: "" };
  const second = { cards: [hand.cards[1], drawGameCard(true)], bet: hand.bet, state: splittingAces ? "stood" : "playing", fromSplit: true, splitAces: splittingAces, resultText: splittingAces ? "Split-Ass" : "", outcome: "" };
  gameRound.hands.splice(gameRound.activeHand, 1, first, second);
  if (splittingAces) advanceGameHand();
  else {
    setRoundMessage(`Hand ${gameRound.activeHand + 1} ist aktiv.`);
    updateGameUi();
  }
}

function gameSurrender() {
  const hand = currentGameHand();
  if (gameRound.phase !== "player" || !canGameSurrender(hand)) return;
  evaluateGameDecision("surrender");
  hand.state = "surrendered";
  hand.resultText = "Aufgegeben · ½ Einsatz zurück";
  state.blackjack.bankroll += hand.bet / 2;
  advanceGameHand();
}

function playGameDealer() {
  gameRound.phase = "dealer";
  revealGameCard(gameRound.dealer[1]);
  let value = handValue(gameRound.dealer);
  while (value.total < 17 || (value.total === 17 && value.soft && gameRules().dealerHitsSoft17)) {
    gameRound.dealer.push(drawGameCard(true));
    value = handValue(gameRound.dealer);
  }
  settleGameRound(false);
}

function settleGameRound(dealerBlackjack) {
  const dealerValue = handValue(gameRound.dealer).total;
  const dealerBust = dealerValue > 21;
  let wins = 0;
  let losses = 0;
  let pushes = 0;
  gameRound.hands.forEach((hand) => {
    const playerValue = handValue(hand.cards).total;
    if (hand.state === "surrendered") {
      hand.outcome = "loss";
      losses += 1;
      return;
    }
    if (hand.state === "bust" || playerValue > 21) {
      hand.outcome = "loss";
      hand.resultText = "Verloren · Bust";
      losses += 1;
      return;
    }
    if (dealerBlackjack) {
      if (isNatural(hand)) {
        state.blackjack.bankroll += hand.bet;
        hand.outcome = "push";
        hand.resultText = "Push · beide Blackjack";
        pushes += 1;
      } else {
        hand.outcome = "loss";
        hand.resultText = "Dealer Blackjack";
        losses += 1;
      }
      return;
    }
    if (isNatural(hand)) {
      state.blackjack.bankroll += hand.bet * (1 + gameRules().payout);
      hand.outcome = "win";
      hand.resultText = `Blackjack · ${gameRules().payout === 1.5 ? "3:2" : "6:5"}`;
      wins += 1;
      return;
    }
    if (dealerBust || playerValue > dealerValue) {
      state.blackjack.bankroll += hand.bet * 2;
      hand.outcome = "win";
      hand.resultText = dealerBust ? "Gewonnen · Dealer Bust" : `Gewonnen · ${playerValue} zu ${dealerValue}`;
      wins += 1;
    } else if (playerValue === dealerValue) {
      state.blackjack.bankroll += hand.bet;
      hand.outcome = "push";
      hand.resultText = `Push · ${playerValue}`;
      pushes += 1;
    } else {
      hand.outcome = "loss";
      hand.resultText = `Verloren · ${playerValue} zu ${dealerValue}`;
      losses += 1;
    }
  });
  const roundProfit = state.blackjack.bankroll - gameRound.roundStartBankroll;
  state.blackjack.handsPlayed += gameRound.hands.length;
  state.blackjack.wins += wins;
  state.blackjack.losses += losses;
  state.blackjack.pushes += pushes;
  state.blackjack.profit += roundProfit;
  state.blackjack.bestBankroll = Math.max(state.blackjack.bestBankroll, state.blackjack.bankroll);
  const label = wins ? `${wins}× gewonnen` : pushes && !losses ? "Push" : "Verloren";
  state.blackjack.history.unshift({ label, profit: roundProfit, timestamp: Date.now() });
  state.blackjack.history = state.blackjack.history.slice(0, 12);
  state.xp += Math.max(1, wins * 3);
  state.recent.unshift({ mode: "blackjack", correct: roundProfit >= 0, detail: `${label} · ${roundProfit > 0 ? "+" : ""}${formatChips(roundProfit)} Chips`, xp: Math.max(1, wins * 3), timestamp: Date.now() });
  state.recent = state.recent.slice(0, 30);
  gameRound.phase = "settled";
  const message = roundProfit > 0 ? `Runde gewonnen: +${formatChips(roundProfit)} Chips.` : roundProfit < 0 ? `Runde beendet: ${formatChips(roundProfit)} Chips.` : "Runde endet unentschieden.";
  setRoundMessage(message, roundProfit > 0 ? "win" : roundProfit < 0 ? "loss" : "");
  gameBet = Math.min(gameBet, state.blackjack.bankroll);
  saveState();
  updateAllStats();
  updateGameUi();
}

function addGameChip(amount) {
  if (!["betting", "settled"].includes(gameRound.phase)) return;
  gameBet = Math.min(state.blackjack.bankroll, gameBet + amount);
  updateGameUi();
}

function applyGameRules() {
  state.gameRules = {
    decks: Number(document.getElementById("gameRuleDecks").value),
    dealerHitsSoft17: document.getElementById("gameRuleSoft17").value === "hit",
    payout: Number(document.getElementById("gameRulePayout").value),
    penetration: Number(document.getElementById("gameRulePenetration").value),
    surrender: document.getElementById("gameRuleSurrender").checked
  };
  prepareGameShoe();
  gameRound = { phase: "betting", dealer: [], hands: [], activeHand: 0, roundStartBankroll: state.blackjack.bankroll, insuranceBet: 0, lastCoach: "" };
  setRoundMessage("Regeln übernommen. Neuer Schuh gemischt.");
  saveState();
  updateGameUi();
}

function resetGameSession() {
  state.blackjack = clone(initialState.blackjack);
  gameBet = 25;
  prepareGameShoe();
  gameRound = { phase: "betting", dealer: [], hands: [], activeHand: 0, roundStartBankroll: 1000, insuranceBet: 0, lastCoach: "" };
  setRoundMessage("Neue Session. Einsatz wählen und Karten geben.");
  saveState();
  updateAllStats();
  updateGameUi();
}

function checkGameCount(event) {
  event.preventDefault();
  const input = document.getElementById("gameCountGuess");
  if (input.value.trim() === "") return;
  const guess = Number(input.value);
  const correct = guess === gameRunningCount;
  if (correct) {
    state.xp += 3;
    saveState();
    updateAllStats();
  }
  showToast(correct ? `Count stimmt: ${formatSigned(gameRunningCount)} · +3 XP` : `Korrekt ist ${formatSigned(gameRunningCount)}.`);
  input.select();
}

function initializeBlackjackGame() {
  document.getElementById("gameRuleDecks").value = String(gameRules().decks);
  document.getElementById("gameRuleSoft17").value = gameRules().dealerHitsSoft17 ? "hit" : "stand";
  document.getElementById("gameRulePayout").value = String(gameRules().payout);
  document.getElementById("gameRulePenetration").value = String(gameRules().penetration);
  document.getElementById("gameRuleSurrender").checked = gameRules().surrender;
  prepareGameShoe();
  gameBet = Math.min(25, state.blackjack.bankroll);
  gameRound = { phase: "betting", dealer: [], hands: [], activeHand: 0, roundStartBankroll: state.blackjack.bankroll, insuranceBet: 0, lastCoach: "" };
  updateGameUi();
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
  document.querySelectorAll("[data-chip]").forEach((button) => {
    button.addEventListener("click", () => addGameChip(Number(button.dataset.chip)));
  });
  document.getElementById("clearGameBet").addEventListener("click", () => {
    gameBet = 0;
    updateGameUi();
  });
  document.getElementById("dealGameRound").addEventListener("click", beginGameRound);
  document.getElementById("gameHit").addEventListener("click", gameHit);
  document.getElementById("gameStand").addEventListener("click", gameStand);
  document.getElementById("gameDouble").addEventListener("click", gameDouble);
  document.getElementById("gameSplit").addEventListener("click", gameSplit);
  document.getElementById("gameSurrender").addEventListener("click", gameSurrender);
  document.getElementById("gameInsurance").addEventListener("click", () => handleGameInsurance(true));
  document.getElementById("gameNoInsurance").addEventListener("click", () => handleGameInsurance(false));
  document.getElementById("hideGameCount").addEventListener("change", updateGameUi);
  document.getElementById("showGameCoach").addEventListener("change", () => {
    document.getElementById("coachMessage").classList.toggle("hidden", !document.getElementById("showGameCoach").checked || !gameRound.lastCoach);
    updateGameRecommendation();
  });
  document.getElementById("gameCountCheck").addEventListener("submit", checkGameCount);
  ["gameRuleDecks", "gameRuleSoft17", "gameRulePayout", "gameRulePenetration", "gameRuleSurrender"].forEach((id) => {
    document.getElementById(id).addEventListener("change", applyGameRules);
  });
  document.getElementById("resetGameBankroll").addEventListener("click", () => {
    if (window.confirm("Neue Session starten und das virtuelle Guthaben auf 1.000 setzen?")) resetGameSession();
  });
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
  document.addEventListener("keydown", (event) => {
    const playActive = document.querySelector('[data-screen="play"]').classList.contains("active");
    if (!playActive || gameRound.phase !== "player" || ["INPUT", "SELECT"].includes(document.activeElement.tagName)) return;
    const key = event.key.toLowerCase();
    if (key === "h") gameHit();
    if (key === "s") gameStand();
    if (key === "d" && canGameDouble()) gameDouble();
    if (key === "p" && canGameSplit()) gameSplit();
    if (key === "r" && canGameSurrender()) gameSurrender();
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
    initializeBlackjackGame();
    updateAllStats();
    resetDialog.close();
    showToast("Fortschritt wurde zurückgesetzt.");
  });
}

function initialize() {
  ensureDailyState();
  renderLessons();
  initializeEvents();
  initializeBlackjackGame();
  nextValueCard();
  generateTrueQuestion();
  generateDeckEstimate();
  startQuiz();
  shuffleSimulator();
  updateAllStats();
  setRoute(location.hash.slice(1) || "dashboard");
}

initialize();
