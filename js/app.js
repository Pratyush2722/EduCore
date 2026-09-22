const STORAGE_KEYS = {
  practice: 'educore.practiceResults',
  tests: 'educore.testResults',
  mistakes: 'educore.mistakes',
  planner: 'educore.plannerTasks',
  bookmarks: 'educore.bookmarkedNotes',
  settings: 'educore.settings'
};

const DEFAULT_SETTINGS = {
  name: 'Student',
  classNumber: '11',
  preferredSubjects: ['Biology'],
  dailyGoal: '60',
  defaultSubject: 'Biology',
  defaultMode: 'Explain',
  notifications: {
    studyReminder: true,
    testReminder: true,
    progressUpdates: true
  },
  theme: 'light',
  difficulty: 'balanced',
  explanations: true
};

const appState = {
  practiceResults: readStorage(STORAGE_KEYS.practice, []),
  testResults: readStorage(STORAGE_KEYS.tests, []),
  mistakes: readStorage(STORAGE_KEYS.mistakes, []),
  plannerTasks: readStorage(STORAGE_KEYS.planner, []),
  bookmarkedNotes: readStorage(STORAGE_KEYS.bookmarks, []),
  settings: readSettings()
};

let learningSession = null;

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    eduToast('Local storage is unavailable');
  }
}

function readSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings));
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return structuredClone(DEFAULT_SETTINGS);
    return {
      ...structuredClone(DEFAULT_SETTINGS),
      ...stored,
      notifications: { ...DEFAULT_SETTINGS.notifications, ...(stored.notifications || {}) }
    };
  } catch (error) {
    return structuredClone(DEFAULT_SETTINGS);
  }
}

function persistSettings() {
  writeStorage(STORAGE_KEYS.settings, appState.settings);
  applyTheme();
}

function applyTheme() {
  document.body.dataset.theme = appState.settings.theme || DEFAULT_SETTINGS.theme;
}

function persistState() {
  writeStorage(STORAGE_KEYS.practice, appState.practiceResults);
  writeStorage(STORAGE_KEYS.tests, appState.testResults);
  writeStorage(STORAGE_KEYS.mistakes, appState.mistakes);
  writeStorage(STORAGE_KEYS.planner, appState.plannerTasks);
  writeStorage(STORAGE_KEYS.bookmarks, appState.bookmarkedNotes);
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
}

function modal(title, payload) {
  const modalEl = document.getElementById('appModal');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = payload;
  modalEl.classList.add('active');
  modalEl.setAttribute('aria-hidden', 'false');
}

function closeAllModals() {
  const modalEl = document.getElementById('appModal');
  if (modalEl) {
    modalEl.classList.remove('active');
    modalEl.setAttribute('aria-hidden', 'true');
  }
  learningSession = null;
}

function eduToast(message) {
  const toast = document.getElementById('eduToast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.__eduToastTimer);
  window.__eduToastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

window.modal = modal;
window.closeAllModals = closeAllModals;
window.eduToast = eduToast;

function getCurriculumSubject(classNum, subjectName) {
  const cls = CURRICULUM[classNum] || CURRICULUM[11];
  return cls.subjects[subjectName] || null;
}

function findChapter(classNum, subjectName, chapterId) {
  const subject = getCurriculumSubject(classNum, subjectName);
  return subject ? subject.chapters.find(chapter => chapter.id === chapterId) : null;
}

function allChapters() {
  const entries = [];
  Object.entries(CURRICULUM).forEach(([classNum, cls]) => {
    Object.entries(cls.subjects).forEach(([subjectName, subject]) => {
      subject.chapters.forEach(chapter => entries.push({ classNum: Number(classNum), cls, subjectName, subject, chapter }));
    });
  });
  return entries;
}

function allNotes() {
  return allChapters().flatMap(entry => (entry.chapter.notes || []).map(note => ({ ...entry, note })));
}

function allResources() {
  return allChapters().flatMap(entry => (entry.chapter.resources || []).map(resource => ({ ...entry, resource })));
}

function allQuestions() {
  return allChapters().flatMap(entry => (entry.chapter.questions || []).map(question => ({ ...entry, question })));
}

function eduOpenChapter(subject, chapterNumber) {
  const entry = allChapters().find(item => item.classNum === 11 && item.subjectName === subject && item.chapter.number === chapterNumber);
  if (entry) {
    eduOpenCurriculumChapter(entry.classNum, entry.subjectName, entry.chapter.id);
    return;
  }
  modal(`${subject} • Chapter ${chapterNumber}`, '<p>Chapter data is not available yet.</p>');
}

function eduOpenCurriculumChapter(classNum, subjectName, chapterId) {
  const chapter = findChapter(classNum, subjectName, chapterId);
  if (!chapter) {
    modal('Curriculum unavailable', '<p>This chapter could not be found in the curriculum data.</p>');
    return;
  }
  const topics = chapter.topics.length
    ? `<ul>${chapter.topics.map(topic => `<li>${escapeHtml(topic)}</li>`).join('')}</ul>`
    : `<div class="resource-item"><p>${escapeHtml(chapter.note || 'Topic data is not available yet.')}</p></div>`;
  const status = chapter.status === 'todo' ? '<span class="tag">Data pending</span>' : '';
  modal(`${CURRICULUM[classNum].label} • ${subjectName}`, `
    <div class="section-header"><h3 class="section-title">${escapeHtml(chapter.name)}</h3>${status}</div>
    ${chapter.note && chapter.status !== 'todo' ? `<p>${escapeHtml(chapter.note)}</p>` : ''}
    ${topics}
    <div class="ec-row">
      <button class="action-btn" onclick="eduOpenNotes(${classNum}, '${subjectName}', '${chapter.id}')">📖 Notes</button>
      <button class="secondary-btn" onclick="eduLectures(${classNum}, '${subjectName}', '${chapter.id}')">🎬 Lectures</button>
      <button class="secondary-btn" onclick="eduOpenPractice(${classNum}, '${subjectName}', '${chapter.id}')">☑️ Practice</button>
      <button class="secondary-btn" onclick="eduOpenTests(${classNum}, '${subjectName}', '${chapter.id}')">📝 Test</button>
    </div>
  `);
}

function eduCurriculumHub(classNum) {
  const cls = CURRICULUM[classNum] || CURRICULUM[11];
  const classButtons = Object.keys(CURRICULUM).map(key => `<button class="chip-btn" style="${+key === +classNum ? 'background:#edf3ff;color:#2457d6;border-color:#d8e5ff' : ''}" onclick="eduCurriculumHub(${key})">${CURRICULUM[key].label}</button>`).join('');
  const subjectCards = Object.entries(cls.subjects).map(([subjectName, subject]) => `
    <div class="resource-item">
      <h3>${subjectName}</h3><p>${escapeHtml(subject.description)}</p>
      <div class="ec-row"><button class="secondary-btn" onclick="eduSubjectModule(${classNum}, '${subjectName}')">Open chapters</button><button class="chip-btn" onclick="eduOpenPractice(${classNum}, '${subjectName}', 'all')">Practice</button></div>
    </div>
  `).join('');
  modal(`📚 EDUCORE • ${cls.label}`, `<div class="ec-row" style="margin-bottom: 12px;">${classButtons}</div>${subjectCards}`);
}

function eduSubjectModule(classNum, subjectName) {
  const cls = CURRICULUM[classNum] || CURRICULUM[11];
  const subject = getCurriculumSubject(classNum, subjectName);
  if (!subject) return modal('Curriculum unavailable', '<p>This subject could not be found in the curriculum data.</p>');
  const chapters = subject.chapters.map(chapter => `<div class="resource-item"><h3>${escapeHtml(chapter.name)}</h3><p>${chapter.topics.length ? `${chapter.topics.length} topics available` : 'Topics pending'}</p><button class="secondary-btn" onclick="eduOpenCurriculumChapter(${classNum}, '${subjectName}', '${chapter.id}')">Open chapter</button></div>`).join('');
  modal(`${cls.label} • ${subjectName}`, `<p>${escapeHtml(subject.description)}</p>${chapters}`);
}

function eduOpenClassSource(classNum, subject, source) {
  if (source === 'practice') return eduOpenPractice(classNum, subject, 'all');
  if (source === 'tests') return eduOpenTests(classNum, subject, 'all');
  if (source === 'notes') return eduOpenNotes(classNum, subject, 'all');
  const cls = CURRICULUM[classNum] || CURRICULUM[11];
  const names = subject && subject !== 'all' ? [subject] : Object.keys(cls.subjects);
  const items = names.map(name => `<div class="resource-item"><h3>${name}</h3><p>${escapeHtml(cls.subjects[name].description)}</p><button class="secondary-btn" onclick="eduSubjectModule(${classNum}, '${name}')">Chapters</button></div>`).join('');
  modal(`📚 ${cls.label} • Resources`, `<p>Choose a subject to open its chapters and available learning material.</p>${items}`);
}

function eduOpenSource(source) {
  if (source === 'notes') return eduOpenNotes();
  if (source === 'videos' || source === 'lectures') return eduLectures();
  if (source === 'practice' || source === 'pyq') return eduOpenPractice();
  if (source === 'tests') return eduOpenTests();
  return eduOpenClassSource(11, 'all', 'resources');
}

function eduOpenNotes(classNum = 11, subjectName = 'all', chapterId = 'all') {
  const notes = allNotes().filter(item => item.classNum === Number(classNum) && (subjectName === 'all' || item.subjectName === subjectName) && (chapterId === 'all' || item.chapter.id === chapterId));
  const saved = new Set(appState.bookmarkedNotes);
  if (!notes.length) return modal('📖 Notes', '<div class="resource-item"><p>No notes are available for this selection yet.</p></div>');
  const body = notes.map(item => `<div class="resource-item"><h3>${escapeHtml(item.note.title)}</h3><p>${escapeHtml(item.note.content)}</p><p><span class="tag">${item.note.type}</span> <span class="tag">${item.cls.label} • ${item.subjectName}</span></p><button class="secondary-btn" onclick="eduOpenNote('${item.note.id}')">Open note</button><button class="chip-btn" onclick="toggleNoteBookmark('${item.note.id}')">${saved.has(item.note.id) ? '★ Saved' : '☆ Save'}</button></div>`).join('');
  modal('📖 Notes', `<p>Notes are local study material from the current curriculum data.</p>${body}<button class="soft-btn" onclick="eduOpenSavedNotes()">View saved notes</button>`);
}

function eduOpenNote(noteId) {
  const item = allNotes().find(entry => entry.note.id === noteId);
  if (!item) return modal('Note unavailable', '<p>This note is no longer available.</p>');
  const saved = appState.bookmarkedNotes.includes(noteId);
  modal(item.note.title, `<p>${escapeHtml(item.note.content)}</p><p><span class="tag">${item.cls.label} • ${item.subjectName} • ${item.chapter.name}</span></p><button class="secondary-btn" onclick="toggleNoteBookmark('${noteId}')">${saved ? '★ Saved' : '☆ Save note'}</button>`);
}

function toggleNoteBookmark(noteId) {
  const index = appState.bookmarkedNotes.indexOf(noteId);
  if (index >= 0) appState.bookmarkedNotes.splice(index, 1); else appState.bookmarkedNotes.push(noteId);
  persistState();
  eduToast(index >= 0 ? 'Note removed from saved notes' : 'Note saved locally');
}

function eduOpenSavedNotes() {
  const notes = allNotes().filter(item => appState.bookmarkedNotes.includes(item.note.id));
  if (!notes.length) return modal('Saved notes', '<div class="resource-item"><p>No saved notes yet.</p></div>');
  modal('Saved notes', notes.map(item => `<div class="resource-item"><h3>${escapeHtml(item.note.title)}</h3><p>${escapeHtml(item.note.content)}</p><button class="secondary-btn" onclick="eduOpenNote('${item.note.id}')">Open</button></div>`).join(''));
}

function eduLectures(classNum = 11, subjectName = 'all', chapterId = 'all') {
  const resources = allResources().filter(item => item.classNum === Number(classNum) && (subjectName === 'all' || item.subjectName === subjectName) && (chapterId === 'all' || item.chapter.id === chapterId));
  if (!resources.length) return modal('🎬 Lecture Library', '<div class="resource-item"><p>No lectures are available for this selection yet.</p></div>');
  const body = resources.map(item => `<div class="resource-item"><h3>${escapeHtml(item.resource.title)}</h3><p><span class="tag">${item.resource.type}</span> <span class="tag">${item.cls.label} • ${item.subjectName} • ${item.chapter.name}</span></p>${item.resource.url ? `<a class="action-btn" href="${escapeHtml(item.resource.url)}" target="_blank" rel="noopener noreferrer">Open resource</a>` : '<span class="tag">Demo/local resource unavailable</span>'}</div>`).join('');
  modal('🎬 Lecture Library', `<p>Only resources with URLs already present in the project are opened externally.</p>${body}`);
}

function questionsFor(classNum, subjectName, chapterId) {
  return allQuestions().filter(item => item.classNum === Number(classNum) && (subjectName === 'all' || item.subjectName === subjectName) && (chapterId === 'all' || item.chapter.id === chapterId));
}

function eduOpenPractice(classNum = 11, subjectName = 'all', chapterId = 'all') {
  const questions = questionsFor(classNum, subjectName, chapterId);
  if (!questions.length) return modal('☑️ Practice', '<div class="resource-item"><p>No sample practice questions are available for this selection yet.</p></div>');
  modal('☑️ Practice', `<p>Sample Practice • ${questions.length} question${questions.length === 1 ? '' : 's'}</p><button class="action-btn" onclick="startLearningSession('practice', ${classNum}, '${subjectName}', '${chapterId}')">Start practice</button>`);
}

function eduOpenTests(classNum = 11, subjectName = 'all', chapterId = 'all') {
  const questions = questionsFor(classNum, subjectName, chapterId);
  if (!questions.length) return modal('📝 Tests', '<div class="resource-item"><p>No sample test questions are available for this selection yet.</p></div>');
  modal('📝 Tests', `<p>Demo Test • ${questions.length} question${questions.length === 1 ? '' : 's'}</p><button class="action-btn" onclick="startLearningSession('test', ${classNum}, '${subjectName}', '${chapterId}')">Start test</button>`);
}

function startLearningSession(mode, classNum, subjectName, chapterId) {
  const questions = questionsFor(classNum, subjectName, chapterId);
  learningSession = { mode, classNum, subjectName, chapterId, questions, index: 0, answers: [], submitted: false, score: 0 };
  renderLearningQuestion();
}

function renderLearningQuestion() {
  const session = learningSession;
  const question = session.questions[session.index];
  const selected = session.answers[session.index];
  const submitted = session.submitted;
  const answerButtons = question.question.options.map((option, index) => `<button class="option-btn ${selected === index ? 'selected' : ''}" ${submitted ? 'disabled' : ''} onclick="selectLearningAnswer(${index})">${String.fromCharCode(65 + index)}. ${escapeHtml(option)}</button>`).join('');
  const feedback = submitted ? `<div class="feedback ${selected === question.question.correctIndex ? 'correct' : 'incorrect'}"><strong>${selected === question.question.correctIndex ? 'Correct' : 'Incorrect'}</strong><p>${escapeHtml(question.question.explanation || '')}</p></div>` : '';
  const nextLabel = session.index === session.questions.length - 1 ? 'Finish' : 'Next';
  modal(`${session.mode === 'test' ? '📝 Demo Test' : '☑️ Sample Practice'} • ${session.index + 1}/${session.questions.length}`, `<p><span class="tag">${question.question.label}</span> <span class="tag">${question.cls.label} • ${question.subjectName} • ${question.chapter.name}</span></p><div class="question-card"><h3>${escapeHtml(question.question.prompt)}</h3><div class="option-list">${answerButtons}</div>${feedback}</div><div class="ec-row"><span class="tag">Question ${session.index + 1} of ${session.questions.length}</span>${session.mode === 'test' && session.index > 0 ? '<button class="soft-btn" onclick="previousLearningQuestion()">Previous</button>' : ''}${!submitted ? '<button class="action-btn" onclick="submitLearningAnswer()">Check answer</button>' : `<button class="action-btn" onclick="nextLearningQuestion()">${nextLabel}</button>`}</div>`);
}

function selectLearningAnswer(index) {
  if (learningSession && !learningSession.submitted) { learningSession.answers[learningSession.index] = index; renderLearningQuestion(); }
}

function submitLearningAnswer() {
  const session = learningSession;
  if (!session || session.answers[session.index] === undefined) return eduToast('Choose an answer first');
  const question = session.questions[session.index];
  session.submitted = true;
  if (session.answers[session.index] === question.question.correctIndex) session.score += 1;
  if (session.answers[session.index] !== question.question.correctIndex) saveMistake(question, session.answers[session.index]);
  renderLearningQuestion();
}

function nextLearningQuestion() {
  const session = learningSession;
  if (session.index === session.questions.length - 1) return finishLearningSession();
  session.index += 1; session.submitted = false; renderLearningQuestion();
}

function previousLearningQuestion() {
  if (!learningSession || learningSession.index === 0) return;
  learningSession.index -= 1; learningSession.submitted = learningSession.answers[learningSession.index] !== undefined; renderLearningQuestion();
}

function finishLearningSession() {
  const session = learningSession;
  const result = { date: new Date().toISOString(), score: session.score, total: session.questions.length, classNum: session.classNum, subjectName: session.subjectName };
  if (session.mode === 'test') appState.testResults.push(result); else appState.practiceResults.push(result);
  persistState();
  const percentage = Math.round((session.score / session.questions.length) * 100);
  modal(session.mode === 'test' ? 'Test result' : 'Practice result', `<div class="stats-grid" style="grid-template-columns: repeat(2, minmax(0, 1fr));"><div class="stat-card"><small>Score</small><strong>${session.score}/${session.questions.length}</strong></div><div class="stat-card"><small>Percentage</small><strong>${percentage}%</strong></div></div><p>Your result was saved locally.</p><button class="action-btn" onclick="startLearningSession('${session.mode}', ${session.classNum}, '${session.subjectName}', '${session.chapterId}')">Retry</button>`);
  learningSession = null;
}

function saveMistake(question, selectedIndex) {
  if (appState.mistakes.some(item => item.id === question.question.id)) return;
  appState.mistakes.push({ id: question.question.id, prompt: question.question.prompt, options: question.question.options, selectedIndex, correctIndex: question.question.correctIndex, explanation: question.question.explanation, classNum: question.classNum, subjectName: question.subjectName, chapterName: question.chapter.name });
  persistState();
}

function eduMistakes() {
  if (!appState.mistakes.length) return modal('📕 Mistake Book', '<div class="resource-item"><p>Your Mistake Book is empty. Incorrect practice and test answers will appear here.</p></div>');
  const body = appState.mistakes.map(item => `<div class="resource-item"><h3>${escapeHtml(item.prompt)}</h3><p>${item.classNum} • ${escapeHtml(item.subjectName)} • ${escapeHtml(item.chapterName)}</p><button class="secondary-btn" onclick="eduReviewMistake('${item.id}')">Review</button><button class="chip-btn" onclick="removeMistake('${item.id}')">Remove</button></div>`).join('');
  modal('📕 Mistake Book', `${body}<button class="soft-btn" onclick="clearMistakes()">Clear mistakes</button>`);
}

function eduReviewMistake(id) {
  const item = appState.mistakes.find(mistake => mistake.id === id);
  if (!item) return eduMistakes();
  modal('📕 Mistake review', `<p>${escapeHtml(item.prompt)}</p><p><span class="tag">Selected: ${escapeHtml(item.options[item.selectedIndex])}</span> <span class="tag">Correct: ${escapeHtml(item.options[item.correctIndex])}</span></p><div class="feedback incorrect"><p>${escapeHtml(item.explanation || 'Review this question again.')}</p></div><button class="chip-btn" onclick="removeMistake('${id}')">Remove mistake</button>`);
}

function removeMistake(id) { appState.mistakes = appState.mistakes.filter(item => item.id !== id); persistState(); eduMistakes(); }
function clearMistakes() { appState.mistakes = []; persistState(); eduMistakes(); }

function eduProgress() {
  const practiceAttempts = appState.practiceResults.length;
  const testAttempts = appState.testResults.length;
  const correct = appState.practiceResults.reduce((sum, item) => sum + item.score, 0) + appState.testResults.reduce((sum, item) => sum + item.score, 0);
  const answered = appState.practiceResults.reduce((sum, item) => sum + item.total, 0) + appState.testResults.reduce((sum, item) => sum + item.total, 0);
  modal('📊 Progress Dashboard', `<div class="stats-grid" style="grid-template-columns: repeat(3, minmax(0, 1fr));"><div class="stat-card"><small>Practice attempts</small><strong>${practiceAttempts}</strong></div><div class="stat-card"><small>Test attempts</small><strong>${testAttempts}</strong></div><div class="stat-card"><small>Accuracy</small><strong>${answered ? Math.round(correct / answered * 100) : 0}%</strong></div></div><p>These figures reflect activity saved on this browser only.</p><div class="resource-item"><h3>Saved notes</h3><p>${appState.bookmarkedNotes.length} note${appState.bookmarkedNotes.length === 1 ? '' : 's'} saved locally.</p></div>`);
}

function eduPlanner() {
  const today = new Date().toISOString().slice(0, 10);
  const renderTasks = list => list.length ? list.map(task => `<div class="list-item"><label><input type="checkbox" ${task.completed ? 'checked' : ''} onchange="togglePlannerTask('${task.id}')"> ${escapeHtml(task.title)} <span class="tag">${escapeHtml(task.subject || 'General')} • ${escapeHtml(task.date || 'No date')}</span></label><button class="chip-btn" onclick="deletePlannerTask('${task.id}')">Delete</button></div>`).join('') : '<p>No tasks yet.</p>';
  modal('🎯 Study Planner', `<form onsubmit="savePlannerTask(event)"><div class="form-grid"><label class="field">Task title<input id="plannerTitle" required placeholder="Revise a topic"></label><label class="field">Subject/topic<input id="plannerSubject" placeholder="Biology • Classification"></label><label class="field">Date<input id="plannerDate" type="date" value="${today}"></label></div><button class="action-btn" type="submit">Add task</button></form><div class="resource-item"><h3>Today</h3>${renderTasks(appState.plannerTasks.filter(task => task.date === today && !task.completed))}</div><div class="resource-item"><h3>Upcoming</h3>${renderTasks(appState.plannerTasks.filter(task => task.date !== today && !task.completed))}</div><div class="resource-item"><h3>Completed</h3>${renderTasks(appState.plannerTasks.filter(task => task.completed))}</div>`);
}

function savePlannerTask(event) { event.preventDefault(); appState.plannerTasks.push({ id: `task-${Date.now()}`, title: document.getElementById('plannerTitle').value.trim(), subject: document.getElementById('plannerSubject').value.trim(), date: document.getElementById('plannerDate').value, completed: false }); persistState(); eduPlanner(); }
function togglePlannerTask(id) { const task = appState.plannerTasks.find(item => item.id === id); if (task) task.completed = !task.completed; persistState(); eduPlanner(); }
function deletePlannerTask(id) { appState.plannerTasks = appState.plannerTasks.filter(item => item.id !== id); persistState(); eduPlanner(); }

function settingsSubjectOptions() {
  return ['Physics', 'Chemistry', 'Mathematics', 'Biology'].map(subject => `<label class="toggle-row"><input type="checkbox" name="preferredSubject" value="${subject}" ${appState.settings.preferredSubjects.includes(subject) ? 'checked' : ''}> <span>${subject}</span></label>`).join('');
}

function eduSettings() {
  const settings = appState.settings;
  const notificationOptions = [
    ['studyReminder', 'Study reminders'],
    ['testReminder', 'Test reminders'],
    ['progressUpdates', 'Progress updates']
  ].map(([key, label]) => `<label class="toggle-row"><input type="checkbox" name="${key}" ${settings.notifications[key] ? 'checked' : ''}> <span>${label}</span></label>`).join('');

  modal('⚙️ Settings', `
    <form onsubmit="saveSettings(event)">
      <section class="settings-section">
        <div class="section-header"><h3 class="section-title">Profile</h3><span class="tag">Saved locally</span></div>
        <div class="form-grid">
          <label class="field">Name<input name="name" value="${escapeHtml(settings.name)}" required></label>
          <label class="field">Class<select name="classNumber"><option value="6" ${settings.classNumber === '6' ? 'selected' : ''}>Class 6</option><option value="7" ${settings.classNumber === '7' ? 'selected' : ''}>Class 7</option><option value="8" ${settings.classNumber === '8' ? 'selected' : ''}>Class 8</option><option value="9" ${settings.classNumber === '9' ? 'selected' : ''}>Class 9</option><option value="10" ${settings.classNumber === '10' ? 'selected' : ''}>Class 10</option><option value="11" ${settings.classNumber === '11' ? 'selected' : ''}>Class 11</option><option value="12" ${settings.classNumber === '12' ? 'selected' : ''}>Class 12</option></select></label>
        </div>
        <fieldset><legend>Preferred subjects</legend><div class="toggle-grid">${settingsSubjectOptions()}</div></fieldset>
      </section>

      <section class="settings-section">
        <div class="section-header"><h3 class="section-title">Study preferences</h3></div>
        <div class="form-grid">
          <label class="field">Daily study goal (minutes)<input name="dailyGoal" type="number" min="10" max="600" step="5" value="${escapeHtml(settings.dailyGoal)}" required></label>
          <label class="field">Default subject<select name="defaultSubject">${['Physics', 'Chemistry', 'Mathematics', 'Biology'].map(subject => `<option ${settings.defaultSubject === subject ? 'selected' : ''}>${subject}</option>`).join('')}</select></label>
          <label class="field">Default mode<select name="defaultMode"><option ${settings.defaultMode === 'Explain' ? 'selected' : ''}>Explain</option><option ${settings.defaultMode === 'Hint' ? 'selected' : ''}>Hint</option><option ${settings.defaultMode === 'Step-by-step' ? 'selected' : ''}>Step-by-step</option><option ${settings.defaultMode === 'Exam Answer' ? 'selected' : ''}>Exam Answer</option></select></label>
        </div>
      </section>

      <section class="settings-section"><div class="section-header"><h3 class="section-title">Notifications</h3></div><div class="toggle-grid">${notificationOptions}</div></section>

      <section class="settings-section">
        <div class="section-header"><h3 class="section-title">Appearance</h3></div>
        <label class="field">Theme<select name="theme"><option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light</option><option value="dim" ${settings.theme === 'dim' ? 'selected' : ''}>Dim</option><option value="contrast" ${settings.theme === 'contrast' ? 'selected' : ''}>High contrast</option></select></label>
      </section>

      <section class="settings-section"><div class="section-header"><h3 class="section-title">Learning preferences</h3></div><div class="form-grid"><label class="field">Difficulty<select name="difficulty"><option value="gentle" ${settings.difficulty === 'gentle' ? 'selected' : ''}>Gentle</option><option value="balanced" ${settings.difficulty === 'balanced' ? 'selected' : ''}>Balanced</option><option value="challenge" ${settings.difficulty === 'challenge' ? 'selected' : ''}>Challenge</option></select></label><label class="toggle-row settings-toggle"><input type="checkbox" name="explanations" ${settings.explanations ? 'checked' : ''}> <span>Show explanations after answers</span></label></div></section>

      <div class="settings-actions"><button class="action-btn" type="submit">Save settings</button><button class="soft-btn" type="button" onclick="resetSettings()">Reset settings</button></div>
    </form>

    <section class="settings-section data-section"><div class="section-header"><h3 class="section-title">Data</h3></div><p>Export or restore your local EDUCORE settings and learning activity.</p><div class="settings-actions"><button class="secondary-btn" onclick="exportLocalData()">Export data</button><label class="secondary-btn file-button">Import data<input type="file" accept="application/json" onchange="importLocalData(event)"></label><button class="danger-btn" onclick="clearLocalData()">Clear local data</button></div></section>
  `);
}

function saveSettings(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  appState.settings = {
    ...appState.settings,
    name: String(formData.get('name') || 'Student').trim(),
    classNumber: String(formData.get('classNumber') || '11'),
    preferredSubjects: formData.getAll('preferredSubject'),
    dailyGoal: String(formData.get('dailyGoal') || '60'),
    defaultSubject: String(formData.get('defaultSubject') || 'Biology'),
    defaultMode: String(formData.get('defaultMode') || 'Explain'),
    notifications: {
      studyReminder: formData.get('studyReminder') === 'on',
      testReminder: formData.get('testReminder') === 'on',
      progressUpdates: formData.get('progressUpdates') === 'on'
    },
    theme: String(formData.get('theme') || 'light'),
    difficulty: String(formData.get('difficulty') || 'balanced'),
    explanations: formData.get('explanations') === 'on'
  };
  persistSettings();
  eduToast('Settings saved locally');
  eduSettings();
}

function resetSettings() {
  appState.settings = structuredClone(DEFAULT_SETTINGS);
  persistSettings();
  eduSettings();
  eduToast('Settings reset');
}

function exportLocalData() {
  const payload = { settings: appState.settings, practiceResults: appState.practiceResults, testResults: appState.testResults, mistakes: appState.mistakes, plannerTasks: appState.plannerTasks, bookmarkedNotes: appState.bookmarkedNotes };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'educore-local-data.json';
  link.click();
  URL.revokeObjectURL(url);
  eduToast('Local data exported');
}

function importLocalData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!imported || typeof imported !== 'object') throw new Error('Invalid data');
      appState.settings = { ...structuredClone(DEFAULT_SETTINGS), ...(imported.settings || {}), notifications: { ...DEFAULT_SETTINGS.notifications, ...((imported.settings || {}).notifications || {}) } };
      ['practiceResults', 'testResults', 'mistakes', 'plannerTasks', 'bookmarkedNotes'].forEach(key => { if (Array.isArray(imported[key])) appState[key] = imported[key]; });
      persistState();
      persistSettings();
      eduSettings();
      eduToast('Local data imported');
    } catch (error) {
      eduToast('Import failed: invalid JSON data');
    }
  };
  reader.readAsText(file);
}

function clearLocalData() {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  appState.practiceResults = [];
  appState.testResults = [];
  appState.mistakes = [];
  appState.plannerTasks = [];
  appState.bookmarkedNotes = [];
  appState.settings = structuredClone(DEFAULT_SETTINGS);
  applyTheme();
  eduSettings();
  eduToast('Local data cleared');
}

function proSearch(query) {
  const value = (query || '').trim().toLowerCase();
  document.title = value ? `EDUCORE | Search: ${query.trim()}` : 'EDUCORE | Learn • Practice • Achieve';
  if (!value) { closeAllModals(); return; }
  const results = [];
  Object.entries(CURRICULUM).forEach(([classNum, cls]) => Object.entries(cls.subjects).forEach(([subjectName, subject]) => {
    if (subjectName.toLowerCase().includes(value) || subject.description.toLowerCase().includes(value)) results.push({ type: 'Subject', label: `${cls.label} • ${subjectName}`, detail: subject.description, action: `eduSubjectModule(${classNum}, '${subjectName}')` });
    subject.chapters.forEach(chapter => {
      if (`${chapter.name} ${chapter.topics.join(' ')}`.toLowerCase().includes(value)) results.push({ type: 'Chapter', label: `${cls.label} • ${subjectName} • ${chapter.name}`, detail: chapter.topics.join(' • '), action: `eduOpenCurriculumChapter(${classNum}, '${subjectName}', '${chapter.id}')` });
      (chapter.notes || []).forEach(note => { if (`${note.title} ${note.content}`.toLowerCase().includes(value)) results.push({ type: 'Note', label: note.title, detail: `${cls.label} • ${subjectName}`, action: `eduOpenNote('${note.id}')` }); });
      (chapter.questions || []).forEach(question => { if (question.prompt.toLowerCase().includes(value)) results.push({ type: 'Practice', label: question.prompt, detail: `${cls.label} • ${subjectName} • ${chapter.name}`, action: `eduOpenPractice(${classNum}, '${subjectName}', '${chapter.id}')` }); });
    });
  }));
  const body = results.length ? results.slice(0, 30).map(result => `<div class="resource-item"><p><span class="tag">${result.type}</span></p><h3>${escapeHtml(result.label)}</h3><p>${escapeHtml(result.detail)}</p><button class="secondary-btn" onclick="${result.action}">Open result</button></div>`).join('') : '<div class="resource-item"><p>No results found. Try a subject, chapter, topic, or note title.</p></div>';
  modal(`Search results for “${escapeHtml(query.trim())}”`, body);
}

function handleAiMode(mode) {
  modal(`🤖 AI Tutor • ${mode}`, `<p><span class="tag">Local demo tutor</span> No AI backend is connected.</p><form onsubmit="submitAiTutor(event, '${mode}')"><label class="field">Ask about a topic<textarea id="aiQuestion" rows="4" placeholder="Type a question or topic" required></textarea></label><div class="ec-row"><button class="action-btn" type="submit">Submit</button><button class="soft-btn" type="button" onclick="handleAiMode('${mode}')">Clear</button></div></form>`);
}

function submitAiTutor(event, mode) { event.preventDefault(); const question = document.getElementById('aiQuestion').value.trim(); if (!question) return eduToast('Enter a question first'); modal(`🤖 AI Tutor • ${mode}`, `<p><span class="tag">Local demo tutor</span></p><p><strong>You asked:</strong> ${escapeHtml(question)}</p><div class="resource-item"><h3>Guided response</h3><p>Start by defining the key terms, connect the question to the selected chapter topics, and check the result against your notes. A live AI response requires a backend connection.</p></div><button class="secondary-btn" onclick="handleAiMode('${mode}')">Ask another question</button>`); }

function proTab(button, tab) {
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  if (button) button.classList.add('active');
  const actions = {
    dashboard: () => { closeAllModals(); window.scrollTo({ top: 0, behavior: 'smooth' }); },
    classes: () => eduCurriculumHub(11),
    ai: () => handleAiMode('Explain'),
    practice: () => eduOpenPractice(11, 'all', 'all'),
    tests: () => eduOpenTests(11, 'all', 'all'),
    mistakes: () => eduMistakes(),
    progress: () => eduProgress(),
    planner: () => eduPlanner(),
    settings: () => eduSettings()
  };
  if (actions[tab]) actions[tab]();
}

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  const searchInput = document.getElementById('globalSearch');
  if (searchInput) searchInput.addEventListener('input', event => { if (event.target.value.trim().length > 1) proSearch(event.target.value); else if (!event.target.value.trim()) closeAllModals(); });
  document.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', closeAllModals));
  const modalEl = document.getElementById('appModal');
  modalEl.addEventListener('click', event => { if (event.target === event.currentTarget) closeAllModals(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeAllModals(); });
  document.querySelectorAll('.nav-item, .mobile-nav button').forEach(button => button.addEventListener('click', () => { if (button.dataset.tab) proTab(button, button.dataset.tab); }));
  document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
    const action = button.dataset.action;
    if (action === 'notifications') modal('🔔 Notifications', '<div class="resource-item"><h3>Today</h3><p>Biology revision reminder • 20 minutes</p></div><div class="resource-item"><h3>Practice</h3><p>Start a local sample practice session from the Practice section.</p></div>');
    if (action === 'settings') proTab(null, 'settings');
    if (action === 'profile') modal('👤 Student Profile', `<div class="resource-item"><h3>Student</h3><p>Class 11 • Science • Board preparation</p></div><div class="resource-item"><h3>Local activity</h3><p>${appState.practiceResults.length + appState.testResults.length} learning session(s) saved.</p></div>`);
    if (action === 'continue-learning') eduOpenChapter('Biology', 2);
    if (action === 'curriculum') eduCurriculumHub(11);
    if (action === 'ai-explore') handleAiMode('Explain');
    if (action === 'ai-explain') handleAiMode('Explain');
    if (action === 'ai-hint') handleAiMode('Hint');
    if (action === 'ai-step') handleAiMode('Step-by-step');
    if (action === 'ai-answer') handleAiMode('Exam Answer');
  }));
  document.querySelector('[data-action="open-biology"]').addEventListener('click', () => eduOpenChapter('Biology', 2));
  document.querySelector('[data-action="open-chemistry"]').addEventListener('click', () => eduOpenChapter('Chemistry', 3));
  document.querySelectorAll('.tool-btn').forEach(button => button.addEventListener('click', () => { const tool = button.dataset.tool; if (tool === 'notes') eduOpenNotes(); if (tool === 'lectures') eduLectures(); if (tool === 'pyq') eduOpenPractice(); if (tool === 'tests') eduOpenTests(); }));
});
