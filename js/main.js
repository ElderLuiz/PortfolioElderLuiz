// Elder Luiz Moreira · Portfólio
document.documentElement.classList.add('js');

const WHATSAPP = '5561998578884';
const EMAIL = 'elderluizmoreira1@gmail.com';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Nav: fundo ao rolar + menu mobile ----------
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const closeMenu = () => {
  navLinks.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Abrir menu');
};
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// ---------- Link ativo conforme a seção ----------
const sections = [...document.querySelectorAll('main section[id]')];
const linkFor = id => navLinks.querySelector(`a[href="#${id}"]`);
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.querySelectorAll('a').forEach(a => a.classList.remove('is-active'));
    linkFor(entry.target.id)?.classList.add('is-active');
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => sectionObserver.observe(s));

// ---------- Efeito de digitação ----------
const typed = document.getElementById('typed');
const roles = [
  'Desenvolvedor Fullstack',
  'Java & Spring Boot',
  'React & JavaScript',
  'Microsserviços na AWS',
  'Sites que geram clientes',
];
if (!reduceMotion) {
  let r = 0, i = roles[0].length, deleting = true;
  const tick = () => {
    const word = roles[r];
    typed.textContent = word.slice(0, i);
    let delay = deleting ? 38 : 75;
    if (deleting && i === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
    else if (!deleting && i === roles[r].length) { deleting = true; delay = 2000; }
    i += deleting ? -1 : 1;
    setTimeout(tick, delay);
  };
  setTimeout(tick, 2200);
}

// ---------- Revelar ao rolar ----------
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => {
  // pequeno atraso em cascata entre irmãos
  const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
  el.style.setProperty('--d', `${Math.min(siblings.indexOf(el), 6) * 0.07}s`);
  // o hero anima via CSS logo no carregamento, sem depender do observer
  if (!el.closest('.hero')) revealObserver.observe(el);
});

// ---------- Contadores ----------
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    counterObserver.unobserve(el);
    if (reduceMotion) { el.textContent = target; return; }
    const start = performance.now();
    const dur = 1400;
    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ---------- Spotlight que segue o mouse ----------
document.querySelectorAll('.spotlight').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

// ---------- Filtro de projetos ----------
const filters = document.querySelectorAll('.filter');
const items = document.querySelectorAll('#projetos [data-cat]');
const subhead = document.querySelector('[data-sub="code"]');
filters.forEach(btn => btn.addEventListener('click', () => {
  const f = btn.dataset.filter;
  filters.forEach(b => {
    b.classList.toggle('is-active', b === btn);
    b.setAttribute('aria-selected', String(b === btn));
  });
  items.forEach(el => {
    const show = f === 'all' || el.dataset.cat === f;
    el.classList.toggle('is-hidden', !show);
    if (show) el.classList.add('is-in');
  });
  subhead.classList.toggle('is-hidden', f === 'web');
}));

// ---------- Toast ----------
const toast = document.getElementById('toast');
let toastTimer;
const showToast = msg => {
  toast.textContent = msg;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
};

// ---------- Copiar e-mail ----------
document.querySelectorAll('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(btn.dataset.copy);
    showToast('E-mail copiado ✓');
  } catch {
    showToast(btn.dataset.copy);
  }
}));

// ---------- Formulário: abre WhatsApp ou e-mail já preenchido ----------
const form = document.getElementById('contactForm');
const formError = document.getElementById('formError');
form.addEventListener('submit', e => {
  e.preventDefault();
  const via = e.submitter?.dataset.via || 'whatsapp';
  const data = new FormData(form);
  const nome = data.get('nome').trim();
  const empresa = data.get('empresa').trim();
  const mensagem = data.get('mensagem').trim();

  if (!nome || !mensagem) {
    formError.textContent = '! preencha seu nome e a mensagem.';
    (nome ? form.mensagem : form.nome).focus();
    return;
  }
  formError.textContent = '';

  const header = `Olá, Elder! Aqui é ${nome}${empresa ? ` (${empresa})` : ''}.`;
  const text = `${header}\n\n${mensagem}`;

  if (via === 'email') {
    const subject = `Contato pelo portfólio · ${nome}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  } else {
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }
  showToast('Abrindo sua mensagem…');
});

// ---------- Ano no rodapé ----------
document.getElementById('year').textContent = new Date().getFullYear();
