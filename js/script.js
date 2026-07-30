// ---- Wedding date (year, monthIndex 0-based, day, hour, minute) ----
const WEDDING_DATE = new Date(2026, 9, 17, 17, 0, 0); // 17 Հոկտեմբերի, 2026, 17:00

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
