/* script.js
   - generate starfield (many stars with random size/duration)
   - control audio: start on user click (Start button), toggle mute/pause via audio control
   - start typing effect after start
*/

/* ---------- Starfield ---------- */
(function generateStars() {
  const container = document.getElementById("starField");
  if (!container) return;
  const density = Math.max(80, Math.round(window.innerWidth / 8)); // number of stars
  for (let i = 0; i < density; i++) {
    const s = document.createElement("div");
    s.className = "star";
    const size = Math.random() * 2.6 + 0.6; // px
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    // twinkle duration + delay
    const dur = (2 + Math.random() * 3).toFixed(2);
    const delay = (Math.random() * 5).toFixed(2);
    s.style.animation = `starTwinkle ${dur}s ease-in-out ${delay}s infinite`;
    s.style.opacity = (0.2 + Math.random() * 0.9).toFixed(2);
    // small horizontal drifting transform using CSS animation via JS (kept simple here)
    container.appendChild(s);
  }
})();

/* Add star twinkle keyframes dynamically (so we keep CSS modular) */
(function addStarKeyframes() {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes starTwinkle {
      0% { opacity: 0.2; transform: translateY(0) scale(1); }
      50% { opacity: 1; transform: translateY(-6px) scale(1.2); }
      100% { opacity: 0.2; transform: translateY(0) scale(1); }
    }`;
  document.head.appendChild(style);
})();

/* ---------- Typing effect (per character) ---------- */
const messages = [
  "Hai, kamu udah hebat banget hari ini 🌸",
  "Jangan lupa istirahat, tubuhmu juga butuh tenang 💖",
  "Apapun yang kamu hadapi, kamu nggak sendirian 🍃",
  "Pelan-pelan aja, semua akan baik-baik saja 🌙",
  "Kamu lebih kuat dari yang kamu kira ✨",
  "Langkah kecilmu hari ini adalah awal dari hal besar esok 💫",
  "Jangan ragu untuk bahagia 💐",
  "Kamu pantas mendapatkan semua hal indah di dunia ini 💝",
];

const heroTitle = document.getElementById("heroText");
const heroSub = document.getElementById("heroSub");

let msgIndex = 0;
let charIndex = 0;
const typingSpeed = 50;
const betweenMessages = 2000;
let typingActive = false;

function typeNextChar() {
  const txt = messages[msgIndex];
  if (charIndex < txt.length) {
    heroTitle.textContent += txt.charAt(charIndex);
    charIndex++;
    setTimeout(typeNextChar, typingSpeed);
  } else {
    // After full line, optionally show a short subtitle or blank
    setTimeout(() => {
      // clear and advance
      heroTitle.textContent = "";
      charIndex = 0;
      msgIndex = (msgIndex + 1) % messages.length;
      setTimeout(typeNextChar, 500);
    }, betweenMessages);
  }
}

/* ---------- Audio control ---------- */
const audio = document.getElementById("bgAudio");
const startBtn = document.getElementById("startBtn");
const overlay = document.getElementById("startOverlay");
const audioBtn = document.getElementById("audioControl");

// Start button: user gesture — play audio (unmuted) and start typing
startBtn.addEventListener("click", async () => {
  try {
    // attempt to play and unmute
    audio.muted = false;
    await audio.play();
  } catch (err) {
    // fallback: ensure audio.play is attempted muted then unmuted on user gesture
    audio.muted = false;
    audio.play().catch(() => {});
  }
  // hide overlay w/ fade
  overlay.style.transition = "opacity 450ms ease, visibility 450ms";
  overlay.style.opacity = "0";
  setTimeout(() => (overlay.style.display = "none"), 500);

  // start typing
  if (!typingActive) {
    typingActive = true;
    typeNextChar();
  }
  updateAudioBtn();
});

// Audio button toggles mute/pause behavior: clicks cycle -> unmute(play) / mute(play) / pause
function updateAudioBtn() {
  if (!audio) return;
  if (!audio.paused && !audio.muted) audioBtn.textContent = "🔊";
  else if (!audio.paused && audio.muted) audioBtn.textContent = "🔇";
  else audioBtn.textContent = "▶️";
}

audioBtn.addEventListener("click", async (e) => {
  e.stopPropagation();
  if (audio.paused) {
    try {
      await audio.play();
      audio.muted = false;
    } catch (err) {
      audio.muted = true;
      audio.play().catch(() => {});
    }
  } else {
    // if playing, toggle mute first; if muted, unmute; if unmuted, mute on first click
    if (audio.muted) {
      audio.muted = false;
    } else {
      // mute first click
      audio.muted = true;
      // second click will pause (so next click when muted will unmute; next when unmuted will mute)
    }
  }
  updateAudioBtn();
});

// Reflect state changes
audio.addEventListener("play", updateAudioBtn);
audio.addEventListener("pause", updateAudioBtn);
audio.addEventListener("volumechange", updateAudioBtn);
