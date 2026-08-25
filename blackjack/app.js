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
    basicStrategy: statTemplate(),
    deviations: statTemplate(),
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
  sessions: [],
  gameDirectory: [],
  bankrollPools: [],
  teamNotes: [],
  toolUsage: {
    evCalculations: 0,
    simulations: 0
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
  basicStrategy: "Basic Strategy",
  deviations: "Abweichungen",
  knowledgeQuiz: "Wissenstest",
  blackjack: "Blackjack-Tisch"
};

const drillByMode = {
  cardValues: "card-values",
  runningCount: "running-count",
  trueCount: "true-count",
  deckEstimation: "deck-estimation",
  shoeSimulator: "shoe-simulator",
  basicStrategy: "basic-strategy",
  deviations: "deviations",
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
    merged.sessions = Array.isArray(saved.sessions) ? saved.sessions : [];
    merged.gameDirectory = Array.isArray(saved.gameDirectory) ? saved.gameDirectory : [];
    merged.bankrollPools = Array.isArray(saved.bankrollPools) ? saved.bankrollPools : [];
    merged.teamNotes = Array.isArray(saved.teamNotes) ? saved.teamNotes : [];
    merged.toolUsage = { ...merged.toolUsage, ...(saved.toolUsage || {}) };
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
  setText("[data-basic-best]", state.stats.basicStrategy.bestStreak);
  setText("[data-basic-accuracy]", `${accuracy(state.stats.basicStrategy)}%`);
  setText("[data-deviation-best]", state.stats.deviations.bestStreak);
  setText("[data-deviation-accuracy]", `${accuracy(state.stats.deviations)}%`);
  document.querySelectorAll("[data-level-progress]").forEach((element) => {
    element.style.width = `${(currentXp / 250) * 100}%`;
  });
  updateDaily();
  updateLessonProgress();
  updateRecent();
  updateHistory();
  updateSkillBars();
  updateRecommendation();
  updateCareer();
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
  const allowed = ["dashboard", "play", "learn", "practice", "reference", "toolbox", "stats"];
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

function openTool(tool) {
  location.hash = "toolbox";
  document.querySelectorAll("[data-tool]").forEach((button) => button.classList.toggle("active", button.dataset.tool === tool));
  document.querySelectorAll("[data-tool-view]").forEach((view) => view.classList.toggle("active", view.dataset.toolView === tool));
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

const deviationSet = [
  { hand: "Insurance", dealer: "A", index: 3, baseAction: "no-insurance", deviationAction: "insurance", note: "Insurance ab True Count +3." },
  { hand: "16", dealer: "10", index: 0, baseAction: "hit", deviationAction: "stand", note: "16 gegen 10 ab TC 0 stehen." },
  { hand: "15", dealer: "10", index: 4, baseAction: "hit", deviationAction: "stand", note: "Ohne Surrender: 15 gegen 10 ab TC +4 stehen." },
  { hand: "10", dealer: "10", index: 4, baseAction: "hit", deviationAction: "double", note: "10 gegen 10 ab TC +4 verdoppeln." },
  { hand: "10", dealer: "A", index: 4, baseAction: "hit", deviationAction: "double", note: "10 gegen Ass ab TC +4 verdoppeln." },
  { hand: "9", dealer: "2", index: 1, baseAction: "hit", deviationAction: "double", note: "9 gegen 2 ab TC +1 verdoppeln." },
  { hand: "9", dealer: "7", index: 3, baseAction: "hit", deviationAction: "double", note: "9 gegen 7 ab TC +3 verdoppeln." },
  { hand: "8", dealer: "6", index: 2, baseAction: "hit", deviationAction: "double", note: "8 gegen 6 ab TC +2 verdoppeln." },
  { hand: "8", dealer: "5", index: 4, baseAction: "hit", deviationAction: "double", note: "8 gegen 5 ab TC +4 verdoppeln." },
  { hand: "12", dealer: "3", index: 2, baseAction: "hit", deviationAction: "stand", note: "12 gegen 3 ab TC +2 stehen." },
  { hand: "12", dealer: "2", index: 3, baseAction: "hit", deviationAction: "stand", note: "12 gegen 2 ab TC +3 stehen." },
  { hand: "13", dealer: "2", index: -1, baseAction: "hit", deviationAction: "stand", note: "13 gegen 2 ab TC −1 stehen." },
  { hand: "12", dealer: "4", index: 0, baseAction: "hit", deviationAction: "stand", note: "12 gegen 4 ab TC 0 stehen." },
  { hand: "12", dealer: "5", index: -2, baseAction: "hit", deviationAction: "stand", note: "12 gegen 5 ab TC −2 stehen." },
  { hand: "12", dealer: "6", index: -1, baseAction: "hit", deviationAction: "stand", note: "12 gegen 6 ab TC −1 stehen." },
  { hand: "13", dealer: "3", index: -2, baseAction: "hit", deviationAction: "stand", note: "13 gegen 3 ab TC −2 stehen." },
  { hand: "15", dealer: "9", index: 2, baseAction: "hit", deviationAction: "stand", note: "15 gegen 9 ab TC +2 stehen." },
  { hand: "11", dealer: "A", index: 1, baseAction: "hit", deviationAction: "double", note: "11 gegen Ass ab TC +1 verdoppeln." }
];

let basicQuestion = null;
let basicLocked = false;
let deviationQuestion = null;
let deviationLocked = false;

function randomTrainingCard() {
  return {
    rank: ranks[Math.floor(Math.random() * ranks.length)],
    suit: suits[Math.floor(Math.random() * suits.length)],
    counted: true
  };
}

function basicStrategyAnswer(cards, dealerCard, hitsSoft17, surrenderAllowed) {
  const dealer = cardPointValue(dealerCard.rank);
  const value = handValue(cards);
  const total = value.total;
  const pair = sameSplitValue(cards) ? cardPointValue(cards[0].rank) : null;
  if (surrenderAllowed) {
    if (total === 17 && dealer === 11 && hitsSoft17) return { action: "surrender", reason: "Hard 17 gegen Ass wird im H17-Spiel aufgegeben." };
    if (pair === 8 && dealer === 11 && hitsSoft17) return { action: "surrender", reason: "8,8 gegen Ass wird im H17-Spiel aufgegeben." };
    if (total === 16 && pair !== 8 && [9, 10, 11].includes(dealer)) return { action: "surrender", reason: "Hard 16 gegen 9, 10 oder Ass aufgeben." };
    if (total === 15 && dealer === 10) return { action: "surrender", reason: "Hard 15 gegen 10 aufgeben." };
  }
  if (pair !== null) {
    if (pair === 11) return { action: "split", reason: "Asse immer teilen." };
    if (pair === 10) return { action: "stand", reason: "Zehnerpaare als 20 zusammenlassen." };
    if (pair === 9) return { action: [2, 3, 4, 5, 6, 8, 9].includes(dealer) ? "split" : "stand", reason: "9,9 gegen 2–6, 8 und 9 teilen." };
    if (pair === 8) return { action: "split", reason: "Achter werden geteilt." };
    if (pair === 7) return { action: dealer <= 7 ? "split" : "hit", reason: "7,7 gegen 2–7 teilen." };
    if (pair === 6) return { action: dealer <= 6 ? "split" : "hit", reason: "6,6 mit DAS gegen 2–6 teilen." };
    if (pair === 5) return { action: dealer <= 9 ? "double" : "hit", reason: "5,5 wie Hard 10 spielen." };
    if (pair === 4) return { action: [5, 6].includes(dealer) ? "split" : "hit", reason: "4,4 mit DAS gegen 5 oder 6 teilen." };
    if ([2, 3].includes(pair)) return { action: dealer <= 7 ? "split" : "hit", reason: "2,2 und 3,3 mit DAS gegen 2–7 teilen." };
  }
  if (value.soft) {
    if (total >= 20) return { action: "stand", reason: `Soft ${total} halten.` };
    if (total === 19) return { action: dealer === 6 && hitsSoft17 ? "double" : "stand", reason: hitsSoft17 ? "Soft 19 im H17-Spiel gegen 6 verdoppeln, sonst stehen." : "Soft 19 halten." };
    if (total === 18) {
      const doubles = hitsSoft17 ? [2, 3, 4, 5, 6] : [3, 4, 5, 6];
      if (doubles.includes(dealer)) return { action: "double", reason: `Soft 18 gegen ${dealer} verdoppeln.` };
      if ([2, 7, 8].includes(dealer)) return { action: "stand", reason: `Soft 18 gegen ${dealer} halten.` };
      return { action: "hit", reason: "Soft 18 gegen 9, 10 oder Ass ziehen." };
    }
    if (total === 17 && [3, 4, 5, 6].includes(dealer)) return { action: "double", reason: "Soft 17 gegen 3–6 verdoppeln." };
    if ([15, 16].includes(total) && [4, 5, 6].includes(dealer)) return { action: "double", reason: `Soft ${total} gegen 4–6 verdoppeln.` };
    if ([13, 14].includes(total) && [5, 6].includes(dealer)) return { action: "double", reason: `Soft ${total} gegen 5–6 verdoppeln.` };
    return { action: "hit", reason: `Soft ${total} ziehen.` };
  }
  if (total >= 17) return { action: "stand", reason: `Hard ${total} halten.` };
  if (total >= 13) return { action: dealer <= 6 ? "stand" : "hit", reason: `Hard ${total}: gegen 2–6 stehen, sonst ziehen.` };
  if (total === 12) return { action: [4, 5, 6].includes(dealer) ? "stand" : "hit", reason: "Hard 12 steht gegen 4–6." };
  if (total === 11) return { action: "double", reason: "Hard 11 verdoppeln." };
  if (total === 10) return { action: dealer <= 9 ? "double" : "hit", reason: "Hard 10 gegen 2–9 verdoppeln." };
  if (total === 9) return { action: [3, 4, 5, 6].includes(dealer) ? "double" : "hit", reason: "Hard 9 gegen 3–6 verdoppeln." };
  return { action: "hit", reason: `Hard ${total} ziehen.` };
}

function generateBasicQuestion() {
  const cards = [randomTrainingCard(), randomTrainingCard()];
  const dealer = randomTrainingCard();
  const hitsSoft17 = document.getElementById("basicRule").value === "h17";
  const surrenderAllowed = document.getElementById("basicSurrender").checked;
  const answer = basicStrategyAnswer(cards, dealer, hitsSoft17, surrenderAllowed);
  basicQuestion = { cards, dealer, answer };
  basicLocked = false;
  document.getElementById("basicDealerCard").innerHTML = gameCardMarkup(dealer, false, 0);
  document.getElementById("basicPlayerHand").innerHTML = cards.map((card, index) => gameCardMarkup(card, false, index)).join("");
  const value = handValue(cards);
  document.getElementById("basicHandTotal").textContent = `${value.soft ? "Soft " : ""}${value.total}`;
  document.querySelectorAll("[data-basic-action]").forEach((button) => {
    button.disabled = false;
    button.classList.remove("correct", "wrong");
  });
  const feedback = document.getElementById("basicFeedback");
  feedback.className = "feedback-line";
  feedback.textContent = "Wähle die optimale Aktion.";
}

function answerBasicStrategy(button) {
  if (basicLocked) return;
  basicLocked = true;
  const action = button.dataset.basicAction;
  const correct = action === basicQuestion.answer.action;
  button.classList.add(correct ? "correct" : "wrong");
  document.querySelector(`[data-basic-action="${basicQuestion.answer.action}"]`).classList.add("correct");
  document.querySelectorAll("[data-basic-action]").forEach((item) => { item.disabled = true; });
  const feedback = document.getElementById("basicFeedback");
  feedback.className = `feedback-line ${correct ? "success" : "error"}`;
  feedback.textContent = `${gameActionLabels[basicQuestion.answer.action]} · ${basicQuestion.answer.reason}`;
  recordResult("basicStrategy", correct, `${handValue(basicQuestion.cards).total} vs ${dealerUpLabel(basicQuestion.dealer)} · ${gameActionLabels[basicQuestion.answer.action]}`);
  setTimeout(generateBasicQuestion, 1300);
}

function dealerUpLabel(card) {
  return card.rank === "A" ? "A" : cardPointValue(card.rank);
}

function generateDeviationQuestion() {
  const entry = deviationSet[Math.floor(Math.random() * deviationSet.length)];
  const trueCount = entry.index + Math.floor(Math.random() * 5) - 2;
  const answer = trueCount >= entry.index ? entry.deviationAction : entry.baseAction;
  const optionSet = new Set([entry.baseAction, entry.deviationAction]);
  const extras = shuffle(["hit", "stand", "double", "split", "surrender", "insurance", "no-insurance"]);
  extras.forEach((action) => {
    if (optionSet.size < 4) optionSet.add(action);
  });
  deviationQuestion = { entry, trueCount, answer, options: shuffle([...optionSet]) };
  deviationLocked = false;
  document.getElementById("deviationHand").textContent = entry.hand;
  document.getElementById("deviationDealer").textContent = entry.dealer;
  document.getElementById("deviationTrueCount").textContent = formatSigned(trueCount);
  document.getElementById("deviationActions").innerHTML = deviationQuestion.options.map((action) => `<button data-deviation-action="${action}"><span>${action === "double" ? "×2" : action === "stand" ? "■" : action === "hit" ? "＋" : action === "split" ? "Ⅱ" : action === "surrender" ? "½" : action === "insurance" ? "2:1" : "×"}</span>${gameActionLabels[action]}</button>`).join("");
  document.getElementById("deviationExplanation").classList.add("hidden");
  document.getElementById("nextDeviation").classList.add("hidden");
}

function answerDeviation(button) {
  if (deviationLocked) return;
  deviationLocked = true;
  const action = button.dataset.deviationAction;
  const correct = action === deviationQuestion.answer;
  button.classList.add(correct ? "correct" : "wrong");
  document.querySelector(`[data-deviation-action="${deviationQuestion.answer}"]`).classList.add("correct");
  document.querySelectorAll("[data-deviation-action]").forEach((item) => { item.disabled = true; });
  const explanation = document.getElementById("deviationExplanation");
  explanation.textContent = `${deviationQuestion.entry.note} Bei TC ${formatSigned(deviationQuestion.trueCount)} ist ${gameActionLabels[deviationQuestion.answer]} korrekt.`;
  explanation.classList.remove("hidden");
  document.getElementById("nextDeviation").classList.remove("hidden");
  recordResult("deviations", correct, `${deviationQuestion.entry.hand} vs ${deviationQuestion.entry.dealer} · TC ${formatSigned(deviationQuestion.trueCount)}`);
}

function formatMetric(value, digits = 1) {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: digits }).format(value);
}

function sessionTotals() {
  const sorted = [...state.sessions].sort((a, b) => String(a.date).localeCompare(String(b.date)) || a.createdAt - b.createdAt);
  let cumulative = 0;
  let peak = 0;
  let maxDrawdown = 0;
  let totalHours = 0;
  let totalEv = 0;
  sorted.forEach((session) => {
    cumulative += Number(session.result) || 0;
    totalHours += Number(session.hours) || 0;
    totalEv += Number(session.ev) || 0;
    peak = Math.max(peak, cumulative);
    maxDrawdown = Math.max(maxDrawdown, peak - cumulative);
  });
  return {
    sorted,
    result: cumulative,
    hours: totalHours,
    ev: totalEv,
    hourly: totalHours ? cumulative / totalHours : 0,
    maxDrawdown
  };
}

function lineChartSvg(values, options = {}) {
  const width = 900;
  const height = 260;
  const padding = 22;
  const data = values.length === 1 ? [0, values[0]] : values;
  const min = Math.min(0, ...data);
  const max = Math.max(0, ...data);
  const range = Math.max(1, max - min);
  const points = data.map((value, index) => {
    const x = padding + (index / Math.max(1, data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return [x, y];
  });
  const line = points.map((point, index) => `${index ? "L" : "M"}${point[0].toFixed(1)},${point[1].toFixed(1)}`).join(" ");
  const area = `${line} L${points[points.length - 1][0].toFixed(1)},${height - padding} L${points[0][0].toFixed(1)},${height - padding} Z`;
  const zeroY = height - padding - ((0 - min) / range) * (height - padding * 2);
  return `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="${escapeHtml(options.label || "Verlauf")}"><defs><linearGradient id="trackerArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c6f36b" stop-opacity="0.24"/><stop offset="1" stop-color="#c6f36b" stop-opacity="0"/></linearGradient></defs><line x1="${padding}" y1="${zeroY.toFixed(1)}" x2="${width - padding}" y2="${zeroY.toFixed(1)}" stroke="rgba(255,255,255,.13)" stroke-dasharray="5 6"/><path d="${area}" fill="url(#trackerArea)"/><path d="${line}" fill="none" stroke="#c6f36b" stroke-width="3" vector-effect="non-scaling-stroke"/><circle cx="${points[points.length - 1][0].toFixed(1)}" cy="${points[points.length - 1][1].toFixed(1)}" r="5" fill="#c6f36b" vector-effect="non-scaling-stroke"/></svg>`;
}

function renderTracker() {
  const totals = sessionTotals();
  document.getElementById("trackerTotalResult").textContent = `${totals.result > 0 ? "+" : ""}${formatMetric(totals.result)}`;
  document.getElementById("trackerTotalHours").textContent = formatMetric(totals.hours);
  document.getElementById("trackerHourlyRate").textContent = `${totals.hourly > 0 ? "+" : ""}${formatMetric(totals.hourly)}`;
  document.getElementById("trackerDrawdown").textContent = formatMetric(totals.maxDrawdown);
  const chart = document.getElementById("trackerChart");
  if (!totals.sorted.length) {
    chart.innerHTML = '<div class="empty-chart">Noch keine Sessions erfasst</div>';
  } else {
    let cumulative = 0;
    const values = [0, ...totals.sorted.map((session) => {
      cumulative += Number(session.result) || 0;
      return cumulative;
    })];
    chart.innerHTML = lineChartSvg(values, { label: "Bankroll-Verlauf aus Sessions" });
  }
  document.getElementById("sessionCount").textContent = state.sessions.length;
  document.getElementById("sessionVsEv").textContent = `${totals.result - totals.ev > 0 ? "+" : ""}${formatMetric(totals.result - totals.ev)}`;
  const best = state.sessions.length ? Math.max(...state.sessions.map((session) => Number(session.result) || 0)) : 0;
  document.getElementById("sessionBest").textContent = `${best > 0 ? "+" : ""}${formatMetric(best)}`;
  const title = !state.sessions.length ? "Noch keine Daten" : totals.result >= totals.ev ? "Über dem erfassten EV" : "Unter dem erfassten EV";
  const copy = !state.sessions.length
    ? "Erfasse deine erste Session, um Ergebnis, EV-Abweichung und Stundenrate zu sehen."
    : `${state.sessions.length} Sessions und ${formatMetric(totals.hours)} Stunden ergeben ${formatMetric(totals.hourly)} Einheiten pro Stunde. Kurzfristige Abweichungen vom EV sind normal.`;
  document.getElementById("sessionInsightTitle").textContent = title;
  document.getElementById("sessionInsightCopy").textContent = copy;
  document.getElementById("sessionTableBody").innerHTML = [...state.sessions].sort((a, b) => String(b.date).localeCompare(String(a.date))).map((session) => `
    <tr>
      <td>${escapeHtml(session.date)}</td>
      <td><b>${escapeHtml(session.venue)}</b><br><small>${escapeHtml(session.notes || "")}</small></td>
      <td>${escapeHtml(session.game)}</td>
      <td>${formatMetric(session.hours)}</td>
      <td class="${session.result > 0 ? "positive-value" : session.result < 0 ? "negative-value" : ""}">${session.result > 0 ? "+" : ""}${formatMetric(session.result)}</td>
      <td>${session.ev === "" || session.ev === null ? "–" : `${session.ev > 0 ? "+" : ""}${formatMetric(session.ev)}`}</td>
      <td><button class="delete-row" data-delete-session="${session.id}" aria-label="Session löschen">×</button></td>
    </tr>
  `).join("") || '<tr><td colspan="7">Noch keine Sessions.</td></tr>';
}

function addSession(event) {
  event.preventDefault();
  const session = {
    id: `session-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    date: document.getElementById("sessionDate").value,
    venue: document.getElementById("sessionVenue").value.trim(),
    game: document.getElementById("sessionGame").value,
    hours: Number(document.getElementById("sessionHours").value),
    result: Number(document.getElementById("sessionResult").value),
    ev: document.getElementById("sessionEv").value === "" ? "" : Number(document.getElementById("sessionEv").value),
    notes: document.getElementById("sessionNotes").value.trim(),
    createdAt: Date.now()
  };
  state.sessions.push(session);
  saveState();
  event.currentTarget.reset();
  document.getElementById("sessionDate").value = getDateKey();
  document.getElementById("sessionHours").value = 2;
  renderTracker();
  updateCareer();
  showToast("Session gespeichert.");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function exportSessionsCsv() {
  const headers = ["date", "venue", "game", "hours", "result", "ev", "notes"];
  const rows = state.sessions.map((session) => headers.map((header) => csvEscape(session[header])).join(","));
  const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `count-lab-sessions-${getDateKey()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted && char === '"' && text[index + 1] === '"') {
      field += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((item) => item !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  row.push(field);
  if (row.some((item) => item !== "")) rows.push(row);
  return rows;
}

async function importSessionsCsv(file) {
  const rows = parseCsv(await file.text());
  if (rows.length < 2) throw new Error("empty csv");
  const headers = rows[0].map((header) => header.trim().toLowerCase());
  const required = ["date", "venue", "game", "hours", "result"];
  if (!required.every((header) => headers.includes(header))) throw new Error("missing headers");
  const imported = rows.slice(1).map((row, index) => {
    const get = (name) => row[headers.indexOf(name)] ?? "";
    return {
      id: `import-${Date.now()}-${index}`,
      date: get("date"),
      venue: get("venue"),
      game: get("game") || "Blackjack",
      hours: Number(get("hours")) || 0,
      result: Number(get("result")) || 0,
      ev: get("ev") === "" ? "" : Number(get("ev")) || 0,
      notes: get("notes"),
      createdAt: Date.now() + index
    };
  }).filter((session) => session.date && session.venue && session.hours > 0);
  state.sessions.push(...imported);
  saveState();
  renderTracker();
  updateCareer();
  showToast(`${imported.length} Sessions importiert.`);
}

function erf(value) {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x);
  return sign * y;
}

function normalCdf(value) {
  return 0.5 * (1 + erf(value / Math.sqrt(2)));
}

function calculateEvModel(trackUsage = false) {
  const bankroll = Math.max(0, Number(document.getElementById("evBankroll").value));
  const unit = Math.max(0, Number(document.getElementById("evUnit").value));
  const handsHour = Math.max(1, Number(document.getElementById("evHandsHour").value));
  const hours = Math.max(1, Number(document.getElementById("evHours").value));
  const baseEdge = Number(document.getElementById("evBaseEdge").value) / 100;
  const edgePerTc = Number(document.getElementById("evPerTc").value) / 100;
  const tcValues = [-0.5, 1, 2, 3, 4.5];
  const rawFrequencies = [0, 1, 2, 3, 4].map((index) => Math.max(0, Number(document.querySelector(`[data-spread-frequency="${index}"]`).value)));
  const frequencyTotal = rawFrequencies.reduce((sum, value) => sum + value, 0) || 1;
  const frequencies = rawFrequencies.map((value) => value / frequencyTotal);
  const bets = [0, 1, 2, 3, 4].map((index) => Math.max(0, Number(document.querySelector(`[data-spread-bet="${index}"]`).value)) * unit);
  const edges = tcValues.map((tc) => baseEdge + tc * edgePerTc);
  const averageBet = bets.reduce((sum, bet, index) => sum + bet * frequencies[index], 0);
  const evHand = bets.reduce((sum, bet, index) => sum + bet * edges[index] * frequencies[index], 0);
  const secondMoment = bets.reduce((sum, bet, index) => sum + Math.pow(1.15 * bet, 2) * frequencies[index], 0);
  const varianceHand = Math.max(0.0001, secondMoment - evHand * evHand);
  const hourlyEv = evHand * handsHour;
  const totalHands = handsHour * hours;
  const totalEv = evHand * totalHands;
  const hourlySd = Math.sqrt(varianceHand * handsHour);
  const tripSd = Math.sqrt(varianceHand * totalHands);
  const riskRuin = evHand > 0 ? Math.min(1, Math.exp((-2 * bankroll * evHand) / varianceHand)) : 1;
  const nZero = evHand > 0 ? varianceHand / (evHand * evHand) : Infinity;
  const tripLoss = tripSd ? normalCdf(-totalEv / tripSd) : totalEv < 0 ? 1 : 0;
  document.getElementById("evHourlyResult").textContent = `${hourlyEv > 0 ? "+" : ""}${formatMetric(hourlyEv, 2)}`;
  document.getElementById("evTotalResult").textContent = `${totalEv > 0 ? "+" : ""}${formatMetric(totalEv)}`;
  document.getElementById("evAverageBet").textContent = formatMetric(averageBet);
  document.getElementById("evHourlySd").textContent = formatMetric(hourlySd);
  document.getElementById("evRiskRuin").textContent = `${formatMetric(riskRuin * 100, 2)}%`;
  document.getElementById("evNZero").textContent = Number.isFinite(nZero) ? `${formatMetric(nZero / 1000)}k Hände` : "–";
  document.getElementById("evTripLoss").textContent = `${formatMetric(tripLoss * 100, 1)}%`;
  document.getElementById("evHourlyResult").style.color = hourlyEv > 0 ? "var(--lime)" : hourlyEv < 0 ? "#ef9999" : "var(--text)";
  if (trackUsage) {
    state.toolUsage.evCalculations += 1;
    saveState();
    updateCareer();
  }
  return { evHand, varianceHand, hourlyEv, hourlySd };
}

function randomNormal() {
  let first = 0;
  let second = 0;
  while (first === 0) first = Math.random();
  while (second === 0) second = Math.random();
  return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * second);
}

function percentile(values, ratio) {
  const sorted = [...values].sort((a, b) => a - b);
  const position = (sorted.length - 1) * ratio;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

function monteCarloSvg(p10, p50, p90) {
  const width = 900;
  const height = 260;
  const padding = 20;
  const all = [...p10, ...p90];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = Math.max(1, max - min);
  const point = (value, index, length) => [padding + (index / Math.max(1, length - 1)) * (width - padding * 2), height - padding - ((value - min) / range) * (height - padding * 2)];
  const linePath = (values) => values.map((value, index) => {
    const [x, y] = point(value, index, values.length);
    return `${index ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const upper = p90.map((value, index) => point(value, index, p90.length));
  const lower = p10.map((value, index) => point(value, index, p10.length)).reverse();
  const band = [...upper, ...lower].map((item, index) => `${index ? "L" : "M"}${item[0].toFixed(1)},${item[1].toFixed(1)}`).join(" ") + " Z";
  return `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="Monte-Carlo-Perzentile"><path d="${band}" fill="rgba(198,243,107,.14)"/><path d="${linePath(p10)}" fill="none" stroke="rgba(198,243,107,.32)" stroke-width="1.5" vector-effect="non-scaling-stroke"/><path d="${linePath(p90)}" fill="none" stroke="rgba(198,243,107,.32)" stroke-width="1.5" vector-effect="non-scaling-stroke"/><path d="${linePath(p50)}" fill="none" stroke="#c6f36b" stroke-width="3" vector-effect="non-scaling-stroke"/></svg>`;
}

function runMonteCarlo() {
  const bankroll = Math.max(1, Number(document.getElementById("mcBankroll").value));
  const hands = Math.max(100, Math.min(1000000, Number(document.getElementById("mcHands").value)));
  const averageBet = Math.max(1, Number(document.getElementById("mcAverageBet").value));
  const edge = Number(document.getElementById("mcEdge").value) / 100;
  const sdUnits = Math.max(0.1, Number(document.getElementById("mcSd").value));
  const trials = Math.max(100, Math.min(5000, Number(document.getElementById("mcTrials").value)));
  const steps = 61;
  const handsPerStep = hands / (steps - 1);
  const paths = [];
  let drawdownCount = 0;
  for (let trial = 0; trial < trials; trial += 1) {
    const path = [bankroll];
    let value = bankroll;
    let hitDrawdown = false;
    for (let step = 1; step < steps; step += 1) {
      const mean = handsPerStep * averageBet * edge;
      const sd = Math.sqrt(handsPerStep) * averageBet * sdUnits;
      value += mean + randomNormal() * sd;
      path.push(value);
      if (value <= bankroll * 0.8) hitDrawdown = true;
    }
    if (hitDrawdown) drawdownCount += 1;
    paths.push(path);
  }
  const p10 = [];
  const p50 = [];
  const p90 = [];
  for (let step = 0; step < steps; step += 1) {
    const column = paths.map((path) => path[step]);
    p10.push(percentile(column, 0.1));
    p50.push(percentile(column, 0.5));
    p90.push(percentile(column, 0.9));
  }
  const finals = paths.map((path) => path[path.length - 1]);
  const profitChance = finals.filter((value) => value > bankroll).length / trials;
  document.getElementById("mcMedian").textContent = formatMetric(percentile(finals, 0.5));
  document.getElementById("mcProfitChance").textContent = `${formatMetric(profitChance * 100, 1)}%`;
  document.getElementById("mcDrawdownChance").textContent = `${formatMetric((drawdownCount / trials) * 100, 1)}%`;
  document.getElementById("mcChart").innerHTML = monteCarloSvg(p10, p50, p90);
  state.toolUsage.simulations += 1;
  saveState();
  updateCareer();
}

function directoryScore(entry) {
  const penetrationScore = Math.max(0, Math.min(40, ((entry.penetration - 45) / 40) * 40));
  const ruleScore = (entry.rules.includes("S17") ? 12 : 6) + (entry.rules.includes("DAS") ? 8 : 0) + (entry.rules.includes("LS") ? 5 : 0);
  const limitScore = Math.max(2, 20 - Math.max(0, entry.minBet - 5) * 0.35);
  const ratingScore = entry.rating * 3;
  return Math.round(Math.min(100, penetrationScore + ruleScore + limitScore + ratingScore));
}

function renderDirectory() {
  const query = document.getElementById("directorySearch").value.trim().toLowerCase();
  const entries = [...state.gameDirectory]
    .filter((entry) => `${entry.venue} ${entry.city}`.toLowerCase().includes(query))
    .sort((a, b) => directoryScore(b) - directoryScore(a));
  document.getElementById("directoryList").innerHTML = entries.map((entry) => `
    <div class="directory-entry">
      <div><b>${escapeHtml(entry.venue)}</b><small>${escapeHtml(entry.city)} · ${escapeHtml(entry.notes || "Keine Notiz")}</small></div>
      <span>${entry.decks} Decks · ${escapeHtml(entry.rules)}</span>
      <span>${entry.penetration}% Pen.</span>
      <span>Min. ${formatMetric(entry.minBet, 0)}</span>
      <span class="game-score">${directoryScore(entry)}</span>
      <button class="delete-row" data-delete-directory="${entry.id}" aria-label="Spiel löschen">×</button>
    </div>
  `).join("") || '<div class="empty-activity">Noch keine passenden Spiele gespeichert.</div>';
}

function addDirectoryEntry(event) {
  event.preventDefault();
  state.gameDirectory.push({
    id: `game-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    venue: document.getElementById("directoryVenue").value.trim(),
    city: document.getElementById("directoryCity").value.trim(),
    decks: Number(document.getElementById("directoryDecks").value),
    minBet: Number(document.getElementById("directoryMinBet").value),
    penetration: Number(document.getElementById("directoryPenetration").value),
    rules: document.getElementById("directoryRules").value,
    rating: Number(document.getElementById("directoryRating").value),
    notes: document.getElementById("directoryNotes").value.trim(),
    createdAt: Date.now()
  });
  saveState();
  event.currentTarget.reset();
  document.getElementById("directoryDecks").value = "6";
  document.getElementById("directoryMinBet").value = "10";
  document.getElementById("directoryPenetration").value = "75";
  document.getElementById("directoryRating").value = "3";
  renderDirectory();
  updateCareer();
  showToast("Spiel im Directory gespeichert.");
}

function renderPoolsAndNotes() {
  const ownedTotal = state.bankrollPools.reduce((sum, pool) => sum + pool.balance * (pool.share / 100), 0);
  document.getElementById("poolOwnedTotal").textContent = formatMetric(ownedTotal);
  document.getElementById("poolList").innerHTML = state.bankrollPools.map((pool) => `
    <div class="pool-entry"><div><b>${escapeHtml(pool.name)}</b><small>${escapeHtml(pool.owner)} · ${pool.share}% Anteil</small></div><span>${formatMetric(pool.balance)}</span><button class="delete-row" data-delete-pool="${pool.id}" aria-label="Pool löschen">×</button></div>
  `).join("") || '<div class="empty-activity">Noch keine Bankroll-Pools.</div>';
  document.getElementById("teamNotes").innerHTML = [...state.teamNotes].reverse().map((note) => `
    <article class="team-note"><header><b>${escapeHtml(note.author)}</b><span>${new Date(note.createdAt).toLocaleDateString("de-DE")}</span></header><p>${escapeHtml(note.message)}</p></article>
  `).join("");
}

function addBankrollPool(event) {
  event.preventDefault();
  state.bankrollPools.push({
    id: `pool-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: document.getElementById("poolName").value.trim(),
    owner: document.getElementById("poolOwner").value.trim(),
    balance: Number(document.getElementById("poolBalance").value),
    share: Number(document.getElementById("poolShare").value)
  });
  saveState();
  event.currentTarget.reset();
  document.getElementById("poolShare").value = "100";
  renderPoolsAndNotes();
}

function addTeamNote(event) {
  event.preventDefault();
  state.teamNotes.push({
    id: `note-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    author: document.getElementById("teamNoteAuthor").value.trim(),
    message: document.getElementById("teamNoteMessage").value.trim(),
    createdAt: Date.now()
  });
  state.teamNotes = state.teamNotes.slice(-30);
  saveState();
  document.getElementById("teamNoteMessage").value = "";
  renderPoolsAndNotes();
}

function careerMissionData() {
  const blackjackAccuracy = state.blackjack.decisions ? Math.round((state.blackjack.correctDecisions / state.blackjack.decisions) * 100) : 0;
  return [
    { title: "Lernpfad abschließen", detail: `${state.completedLessons.length}/8 Module`, complete: state.completedLessons.length >= 8 },
    { title: "Kartenwerte meistern", detail: `${state.stats.cardValues.attempts}/100 · ${accuracy(state.stats.cardValues)}%`, complete: state.stats.cardValues.attempts >= 100 && accuracy(state.stats.cardValues) >= 90 },
    { title: "Running Count stabilisieren", detail: `${state.stats.runningCount.attempts}/20 · ${accuracy(state.stats.runningCount)}%`, complete: state.stats.runningCount.attempts >= 20 && accuracy(state.stats.runningCount) >= 90 },
    { title: "True Count beherrschen", detail: `${state.stats.trueCount.attempts}/20 · ${accuracy(state.stats.trueCount)}%`, complete: state.stats.trueCount.attempts >= 20 && accuracy(state.stats.trueCount) >= 90 },
    { title: "Basic Strategy perfektionieren", detail: `${state.stats.basicStrategy.attempts}/50 · ${accuracy(state.stats.basicStrategy)}%`, complete: state.stats.basicStrategy.attempts >= 50 && accuracy(state.stats.basicStrategy) >= 90 },
    { title: "Indizes automatisieren", detail: `${state.stats.deviations.attempts}/30 · ${accuracy(state.stats.deviations)}%`, complete: state.stats.deviations.attempts >= 30 && accuracy(state.stats.deviations) >= 85 },
    { title: "100 Hände spielen", detail: `${state.blackjack.handsPlayed}/100 · ${blackjackAccuracy}% Strategie`, complete: state.blackjack.handsPlayed >= 100 && blackjackAccuracy >= 95 },
    { title: "Sessions dokumentieren", detail: `${state.sessions.length}/10 Sessions`, complete: state.sessions.length >= 10 },
    { title: "Risiko modellieren", detail: `${state.toolUsage.evCalculations}/1 EV · ${state.toolUsage.simulations}/1 MC`, complete: state.toolUsage.evCalculations >= 1 && state.toolUsage.simulations >= 1 },
    { title: "Games katalogisieren", detail: `${state.gameDirectory.length}/3 Spiele`, complete: state.gameDirectory.length >= 3 }
  ];
}

function updateCareer() {
  const missions = careerMissionData();
  const complete = missions.filter((mission) => mission.complete).length;
  const percent = Math.round((complete / missions.length) * 100);
  const rank = complete >= 10 ? "Count Lab Pro" : complete >= 8 ? "Road Tested" : complete >= 6 ? "Advantage Player" : complete >= 4 ? "Table Ready" : complete >= 2 ? "Counter in Training" : "Rookie";
  document.getElementById("careerPercent").textContent = `${percent}%`;
  document.getElementById("careerRing").style.background = `conic-gradient(var(--lime) ${percent * 3.6}deg, rgba(255, 255, 255, 0.08) 0deg)`;
  document.getElementById("careerRank").textContent = rank;
  document.getElementById("careerNext").textContent = complete === missions.length ? "Alle Missionen abgeschlossen." : `Noch ${missions.length - complete} Missionen bis zum vollständigen Karrierepfad.`;
  document.getElementById("careerMissions").innerHTML = missions.map((mission, index) => `
    <div class="career-mission ${mission.complete ? "complete" : ""}"><span>${mission.complete ? "✓" : String(index + 1).padStart(2, "0")}</span><div><b>${mission.title}</b><small>${mission.detail}</small></div><i>${mission.complete ? "FERTIG" : "OFFEN"}</i></div>
  `).join("");
}

function updateToolbox() {
  renderTracker();
  renderDirectory();
  renderPoolsAndNotes();
  updateCareer();
  calculateEvModel(false);
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
  document.querySelectorAll("[data-tool]").forEach((button) => {
    button.addEventListener("click", () => openTool(button.dataset.tool));
  });
  document.querySelectorAll("[data-open-tool]").forEach((button) => {
    button.addEventListener("click", () => openTool(button.dataset.openTool));
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
  document.getElementById("basicActions").addEventListener("click", (event) => {
    const button = event.target.closest("[data-basic-action]");
    if (button) answerBasicStrategy(button);
  });
  document.getElementById("basicRule").addEventListener("change", generateBasicQuestion);
  document.getElementById("basicSurrender").addEventListener("change", generateBasicQuestion);
  document.getElementById("deviationActions").addEventListener("click", (event) => {
    const button = event.target.closest("[data-deviation-action]");
    if (button) answerDeviation(button);
  });
  document.getElementById("nextDeviation").addEventListener("click", generateDeviationQuestion);
  document.getElementById("sessionForm").addEventListener("submit", addSession);
  document.getElementById("sessionTableBody").addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-session]");
    if (!button) return;
    state.sessions = state.sessions.filter((session) => session.id !== button.dataset.deleteSession);
    saveState();
    renderTracker();
    updateCareer();
  });
  document.getElementById("exportSessions").addEventListener("click", exportSessionsCsv);
  document.getElementById("importSessionsButton").addEventListener("click", () => document.getElementById("importSessionsFile").click());
  document.getElementById("importSessionsFile").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      await importSessionsCsv(file);
    } catch {
      showToast("CSV konnte nicht importiert werden.");
    }
    event.target.value = "";
  });
  document.getElementById("evForm").addEventListener("submit", (event) => {
    event.preventDefault();
    calculateEvModel(true);
  });
  document.getElementById("monteCarloForm").addEventListener("submit", (event) => {
    event.preventDefault();
    runMonteCarlo();
  });
  document.getElementById("directoryForm").addEventListener("submit", addDirectoryEntry);
  document.getElementById("directorySearch").addEventListener("input", renderDirectory);
  document.getElementById("directoryList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-directory]");
    if (!button) return;
    state.gameDirectory = state.gameDirectory.filter((entry) => entry.id !== button.dataset.deleteDirectory);
    saveState();
    renderDirectory();
    updateCareer();
  });
  document.getElementById("bankrollPoolForm").addEventListener("submit", addBankrollPool);
  document.getElementById("poolList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-pool]");
    if (!button) return;
    state.bankrollPools = state.bankrollPools.filter((pool) => pool.id !== button.dataset.deletePool);
    saveState();
    renderPoolsAndNotes();
  });
  document.getElementById("teamNoteForm").addEventListener("submit", addTeamNote);
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
    generateBasicQuestion();
    generateDeviationQuestion();
    document.getElementById("sessionDate").value = getDateKey();
    updateToolbox();
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
  generateBasicQuestion();
  generateDeviationQuestion();
  document.getElementById("sessionDate").value = getDateKey();
  updateToolbox();
  updateAllStats();
  setRoute(location.hash.slice(1) || "dashboard");
}

initialize();
