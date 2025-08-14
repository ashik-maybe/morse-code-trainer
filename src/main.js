// Telegraph Trainer - Modern Morse Code
import { MORSE_CODE } from './morse.js';

const REVERSE_MORSE = Object.fromEntries(
  Object.entries(MORSE_CODE).map(([k, v]) => [v, k])
);

// State
let stats = { correct: 0, total: 0 };
let audioContext;

// DOM Elements
const elements = {
  tabs: {
    learn: document.getElementById('learn-tab'),
    practice: document.getElementById('practice-tab'),
    translate: document.getElementById('translate-tab')
  },
  sections: {
    learn: document.getElementById('learn-section'),
    practice: document.getElementById('practice-section'),
    translate: document.getElementById('translate-section')
  },
  // Practice elements
  challengeText: document.getElementById('challenge-text'),
  practiceInput: document.getElementById('practice-input'),
  playBtn: document.getElementById('play-btn'),
  newBtn: document.getElementById('new-btn'),
  speedSlider: document.getElementById('speed-slider'),
  speedValue: document.getElementById('speed-value'),
  freqSlider: document.getElementById('freq-slider'),
  freqValue: document.getElementById('freq-value'),
  correct: document.getElementById('correct'),
  total: document.getElementById('total'),
  accuracy: document.getElementById('accuracy'),
  // Translate elements
  textInput: document.getElementById('text-input'),
  morseInput: document.getElementById('morse-input'),
  morseOutput: document.getElementById('morse-output'),
  textOutput: document.getElementById('text-output'),
  toMorseBtn: document.getElementById('to-morse-btn'),
  toTextBtn: document.getElementById('to-text-btn'),
  playMorseBtn: document.getElementById('play-morse-btn'),
  morseGrid: document.getElementById('morse-grid')
};

// Initialize app
function init() {
  setupTabs();
  setupLearnSection();
  setupPracticeSection();
  setupTranslateSection();
  generateChallenge();
  updateStats();
}

// Tab switching
function setupTabs() {
  Object.entries(elements.tabs).forEach(([name, tab]) => {
    tab.addEventListener('click', () => {
      // Remove active classes
      Object.values(elements.tabs).forEach(t => t.classList.remove('active'));
      Object.values(elements.sections).forEach(s => s.classList.remove('active'));

      // Add active classes
      tab.classList.add('active');
      elements.sections[name].classList.add('active');
    });
  });
}

// Learn section
function setupLearnSection() {
  elements.morseGrid.innerHTML = '';

  Object.entries(MORSE_CODE).forEach(([char, code]) => {
    const item = document.createElement('div');
    item.className = 'morse-item';
    item.innerHTML = `
      <div class="morse-char">${char}</div>
      <div class="morse-code">${code}</div>
    `;
    elements.morseGrid.appendChild(item);
  });
}

// Practice section
function setupPracticeSection() {
  // Sliders
  elements.speedSlider.addEventListener('input', () => {
    elements.speedValue.textContent = `${elements.speedSlider.value} WPM`;
  });

  elements.freqSlider.addEventListener('input', () => {
    elements.freqValue.textContent = `${elements.freqSlider.value} Hz`;
  });

  // Input
  elements.practiceInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
  });

  // Buttons
  elements.playBtn.addEventListener('click', playChallenge);
  elements.newBtn.addEventListener('click', generateChallenge);
}

// Translate section
function setupTranslateSection() {
  elements.toMorseBtn.addEventListener('click', () => {
    const text = elements.textInput.value.toUpperCase();
    elements.morseOutput.textContent = textToMorse(text);
  });

  elements.toTextBtn.addEventListener('click', () => {
    const morse = elements.morseInput.value.trim();
    elements.textOutput.textContent = morseToText(morse);
  });

  elements.playMorseBtn.addEventListener('click', () => {
    const morse = elements.morseOutput.textContent;
    if (morse) playMorse(morse);
  });
}

// Generate practice challenge
function generateChallenge() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#.?';
  const length = Math.floor(Math.random() * 4) + 1;
  let challenge = '';

  for (let i = 0; i < length; i++) {
    challenge += chars[Math.floor(Math.random() * chars.length)];
  }

  elements.challengeText.textContent = challenge;
  elements.practiceInput.value = '';
  elements.practiceInput.classList.remove('correct', 'incorrect');
  elements.practiceInput.focus();
}

// Check answer
function checkAnswer() {
  const input = elements.practiceInput.value.trim().toUpperCase();
  const correct = elements.challengeText.textContent;

  stats.total++;

  if (input === correct) {
    stats.correct++;
    elements.practiceInput.classList.add('correct');
    setTimeout(() => {
      generateChallenge();
      updateStats();
    }, 800);
  } else {
    elements.practiceInput.classList.add('incorrect');
    setTimeout(() => {
      elements.practiceInput.classList.remove('incorrect');
    }, 1000);
  }

  updateStats();
}

// Update stats display
function updateStats() {
  elements.correct.textContent = stats.correct;
  elements.total.textContent = stats.total;
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  elements.accuracy.textContent = `${accuracy}%`;
}

// Play current challenge
function playChallenge() {
  const text = elements.challengeText.textContent;
  const morse = textToMorse(text);
  playMorse(morse);
}

// Convert text to morse
function textToMorse(text) {
  return text.split('').map(char => {
    if (char === ' ') return '/';
    return MORSE_CODE[char] || char;
  }).join(' ');
}

// Convert morse to text
function morseToText(morse) {
  return morse.split(' ').map(code => {
    if (code === '/') return ' ';
    return REVERSE_MORSE[code] || code;
  }).join('');
}

// Play morse code
function playMorse(morse) {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const wpm = parseInt(elements.speedSlider.value);
  const freq = parseInt(elements.freqSlider.value);

  const dotDuration = 1.2 / wpm;
  const dashDuration = dotDuration * 3;
  const gap = dotDuration;
  const letterGap = dotDuration * 3;

  let time = 0;

  for (let i = 0; i < morse.length; i++) {
    const char = morse[i];

    if (char === '.') {
      beep(time, dotDuration, freq);
      time += dotDuration + gap;
    } else if (char === '-') {
      beep(time, dashDuration, freq);
      time += dashDuration + gap;
    } else if (char === ' ') {
      time += letterGap;
    } else if (char === '/') {
      time += letterGap * 2;
    }
  }
}

// Play beep
function beep(delay, duration, frequency) {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0, audioContext.currentTime + delay);
  gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + delay + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + delay + duration - 0.01);

  oscillator.start(audioContext.currentTime + delay);
  oscillator.stop(audioContext.currentTime + delay + duration);
}

// Initialize when DOM loaded
document.addEventListener('DOMContentLoaded', init);
