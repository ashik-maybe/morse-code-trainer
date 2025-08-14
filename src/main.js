// 1844 Telegraph Operator - Vintage Interface
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
  // Learn elements
  lettersGrid: document.getElementById('letters-grid'),
  numbersGrid: document.getElementById('numbers-grid'),
  symbolsGrid: document.getElementById('symbols-grid')
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

// Tab switching with vintage mechanical feel
function setupTabs() {
  Object.entries(elements.tabs).forEach(([name, tab]) => {
    tab.addEventListener('click', () => {
      // Remove active classes with mechanical delay
      Object.values(elements.tabs).forEach(t => t.classList.remove('active'));
      Object.values(elements.sections).forEach(s => s.classList.remove('active'));

      // Add active classes with vintage feel
      setTimeout(() => {
        tab.classList.add('active');
        elements.sections[name].classList.add('active');
      }, 100);
    });
  });
}

// Learn section with grouped references
function setupLearnSection() {
  // Clear grids
  elements.lettersGrid.innerHTML = '';
  elements.numbersGrid.innerHTML = '';
  elements.symbolsGrid.innerHTML = '';

  // Group characters
  const letters = {};
  const numbers = {};
  const symbols = {};

  Object.entries(MORSE_CODE).forEach(([char, code]) => {
    if (/[A-Z]/.test(char)) {
      letters[char] = code;
    } else if (/[0-9]/.test(char)) {
      numbers[char] = code;
    } else {
      symbols[char] = code;
    }
  });

  // Populate letter grid
  Object.entries(letters).forEach(([char, code]) => {
    const item = createMorseItem(char, code);
    elements.lettersGrid.appendChild(item);
  });

  // Populate number grid
  Object.entries(numbers).forEach(([char, code]) => {
    const item = createMorseItem(char, code);
    elements.numbersGrid.appendChild(item);
  });

  // Populate symbol grid
  Object.entries(symbols).forEach(([char, code]) => {
    const item = createMorseItem(char, code);
    elements.symbolsGrid.appendChild(item);
  });
}

// Create Morse item element
function createMorseItem(char, code) {
  const item = document.createElement('div');
  item.className = 'morse-item';
  item.innerHTML = `
    <div class="morse-char">${char}</div>
    <div class="morse-code">${code}</div>
  `;
  return item;
}

// Practice section
function setupPracticeSection() {
  // Sliders with vintage feedback
  elements.speedSlider.addEventListener('input', () => {
    elements.speedValue.textContent = `${elements.speedSlider.value} WPM`;
  });

  elements.freqSlider.addEventListener('input', () => {
    elements.freqValue.textContent = `${elements.freqSlider.value} Hz`;
  });

  // Input with vintage response
  elements.practiceInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      checkAnswer();
    }
  });

  // Buttons with mechanical click
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
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '@#.?';

  const challengeTypes = [
    () => {
      // Single character
      return chars[Math.floor(Math.random() * chars.length)];
    },
    () => {
      // Two characters
      let result = '';
      for (let i = 0; i < 2; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
      return result;
    },
    () => {
      // Word (3-4 characters)
      const length = Math.floor(Math.random() * 2) + 3;
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
      return result;
    },
    () => {
      // Number
      return numbers[Math.floor(Math.random() * numbers.length)];
    },
    () => {
      // Symbol
      return symbols[Math.floor(Math.random() * symbols.length)];
    }
  ];

  const randomType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
  const challenge = randomType();

  elements.challengeText.textContent = challenge;
  elements.practiceInput.value = '';
  elements.practiceInput.classList.remove('correct', 'incorrect');
  elements.practiceInput.focus();
}

// Check answer with vintage feedback
function checkAnswer() {
  const input = elements.practiceInput.value.trim().toUpperCase();
  const correct = elements.challengeText.textContent;

  stats.total++;

  if (input === correct) {
    stats.correct++;
    elements.practiceInput.classList.add('correct');

    // Vintage success feedback
    setTimeout(() => {
      generateChallenge();
      updateStats();
    }, 1000);
  } else {
    elements.practiceInput.classList.add('incorrect');

    // Vintage error feedback
    setTimeout(() => {
      elements.practiceInput.classList.remove('incorrect');
    }, 1500);
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

// Play morse code with vintage telegraph sound
function playMorse(morse) {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const wpm = parseInt(elements.speedSlider.value);
  const freq = parseInt(elements.freqSlider.value);

  // Calculate timing based on WPM (vintage standard)
  const dotDuration = 1.2 / wpm;
  const dashDuration = dotDuration * 3;
  const gap = dotDuration;
  const letterGap = dotDuration * 3;

  let time = 0;

  // Simulate vintage telegraph keying
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

// Play beep with vintage telegraph characteristics
function beep(delay, duration, frequency) {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'square'; // Vintage telegraph sound

  // Vintage envelope for authentic feel
  gainNode.gain.setValueAtTime(0, audioContext.currentTime + delay);
  gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + delay + 0.002);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + delay + duration - 0.001);

  oscillator.start(audioContext.currentTime + delay);
  oscillator.stop(audioContext.currentTime + delay + duration);
}

// Initialize when DOM loaded
document.addEventListener('DOMContentLoaded', init);

// Add vintage page load effect
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 1.5s steps(12)';
    document.body.style.opacity = '1';
  }, 200);
});
