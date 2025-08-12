// Kata-kata yang akan ditampilkan
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

let index = 0;
let charIndex = 0;
const typingSpeed = 80; // kecepatan ketikan
const typingText = document.getElementById("typingText");

// Efek Typing
function typeMessage() {
  if (charIndex < messages[index].length) {
    typingText.textContent += messages[index].charAt(charIndex);
    charIndex++;
    setTimeout(typeMessage, typingSpeed);
  } else {
    setTimeout(nextMessage, 2500); // delay sebelum pesan berikutnya
  }
}

// Pesan berikutnya
function nextMessage() {
  index++;
  if (index >= messages.length) {
    index = 0; // ulangi dari awal
  }
  charIndex = 0;
  typingText.textContent = "";
  typeMessage();
}

// Mulai efek typing
typeMessage();

// Kontrol Musik
const music = document.getElementById("bg-music");
const btn = document.getElementById("music-btn");

let isPlaying = false;

// Autoplay (mute → unmute trick)
window.addEventListener("load", () => {
  music.volume = 0;
  music
    .play()
    .then(() => {
      setTimeout(() => {
        music.volume = 1;
        isPlaying = true;
        btn.textContent = "⏸️";
      }, 500);
    })
    .catch(() => {
      // kalau gagal autoplay, user harus klik tombol
      btn.textContent = "🎵";
    });
});

// Tombol kontrol musik
btn.addEventListener("click", () => {
  if (isPlaying) {
    music.pause();
    isPlaying = false;
    btn.textContent = "🎵";
  } else {
    music.play();
    isPlaying = true;
    btn.textContent = "⏸️";
  }
});
