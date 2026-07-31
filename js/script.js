// ---- Wedding date (year, monthIndex 0-based, day, hour, minute) ----
const WEDDING_DATE = new Date(2026, 7, 22, 15, 30, 0); // 22 Օգոստոսի, 2026, 15:30 (պսակադրություն)

// ---- Countdown ----
function updateCountdown() {
  const now = new Date();
  const diff = WEDDING_DATE - now;

  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    min: document.getElementById('cd-min'),
    sec: document.getElementById('cd-sec'),
  };
  if (!els.days) return;

  if (diff <= 0) {
    els.days.textContent = '00';
    els.hours.textContent = '00';
    els.min.textContent = '00';
    els.sec.textContent = '00';
    return;
  }

  const pad = (n) => String(n).padStart(2, '0');
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  els.days.textContent = pad(days);
  els.hours.textContent = pad(hours);
  els.min.textContent = pad(minutes);
  els.sec.textContent = pad(seconds);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ---- Reveal on scroll ----
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => observer.observe(el));

// ---- RSVP form (no backend: opens an email with the answers pre-filled) ----
const RSVP_EMAIL = 'davitmelkonyan2003@gmail.com'; // TODO: փոխարինել իրական էլ. հասցեով

const rsvpForm = document.getElementById('rsvp-form');
if (rsvpForm) {
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rsvp-name').value.trim();
    const guests = document.getElementById('rsvp-guests').value.trim();
    const attend = rsvpForm.querySelector('input[name="attend"]:checked').value;
    const message = document.getElementById('rsvp-msg').value.trim();

    const subject = encodeURIComponent(`RSVP՝ ${name}`);
    const body = encodeURIComponent(
      `Անուն. ${name}\nՀյուրերի քանակ. ${guests}\nՄասնակցություն. ${attend}\nՈւղերձ. ${message || '-'}`
    );

    window.location.href = `mailto:${RSVP_EMAIL}?subject=${subject}&body=${body}`;
  });
}

// ---- Gallery: auto-loads assets/photos/1.jpg, 2.jpg, ... and skips missing ones ----
const galleryGrid = document.getElementById('gallery-grid');
if (galleryGrid) {
  const MAX_PHOTOS = 30;
  for (let i = 1; i <= MAX_PHOTOS; i++) {
    const img = new Image();
    img.src = `assets/photos/${i}.jpg`;
    img.alt = 'Դավիթ ու Մարիամ';
    img.loading = 'lazy';
    img.onload = () => {
      const fig = document.createElement('figure');
      fig.appendChild(img);
      galleryGrid.appendChild(fig);
    };
  }
}

// ============ INTRO SEAL + BACKGROUND MUSIC (YouTube) ============
const YT_VIDEO_ID = 'MqazV4hbu8E';

let ytPlayer = null;
let ytReady = false;
let playRequested = false;

function loadYouTubeAPI() {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = function () {
  ytPlayer = new YT.Player('yt-player', {
    videoId: YT_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      loop: 1,
      playlist: YT_VIDEO_ID,
      playsinline: 1,
    },
    events: {
      onReady: () => {
        ytReady = true;
        if (playRequested) playMusic();
      },
    },
  });
};

function playMusic() {
  if (ytReady && ytPlayer) {
    ytPlayer.playVideo();
    musicBtn.classList.add('playing');
    musicBtn.textContent = '🎶';
  } else {
    playRequested = true;
  }
}

function toggleMusic() {
  if (!ytReady || !ytPlayer) {
    playMusic();
    return;
  }
  const state = ytPlayer.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    ytPlayer.pauseVideo();
    musicBtn.classList.remove('playing');
    musicBtn.textContent = '🎵';
  } else {
    playMusic();
  }
}

const musicBtn = document.getElementById('music-toggle');
if (musicBtn) {
  loadYouTubeAPI();
  musicBtn.addEventListener('click', toggleMusic);
}

// ---- Intro seal: click to open, then reveal site + start music ----
const introEl = document.getElementById('intro');
const sealBtn = document.getElementById('seal');
if (introEl && sealBtn) {
  document.body.classList.add('locked');
  sealBtn.addEventListener('click', () => {
    introEl.classList.add('opening');
    playMusic();
    setTimeout(() => {
      introEl.classList.add('hidden');
      document.body.classList.remove('locked');
    }, 1000);
  }, { once: true });
}
