/**
 * OrixOps — Vanilla JavaScript (UI/UX Pro Max Edition)
 * Комментарии на русском для разработчиков.
 */

import './style.css';

// ==========================================================================
// Утилиты
// ==========================================================================

/** Проверяем, включён ли режим уменьшенного движения */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Проверяем touch-устройство */
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// ==========================================================================
// Scroll Reveal (IntersectionObserver)
// Элементы с классом .reveal плавно появляются при скролле.
// UI/UX Pro Max: поддержка prefers-reduced-motion, stagger 30-50ms.
// ==========================================================================
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Задержка stagger задаётся через data-delay атрибут в HTML
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, Number(delay));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

// ==========================================================================
// Hover Spotlight (Эффект фонарика)
// Координаты курсора передаются в CSS-переменные --mouse-x / --mouse-y.
// UI/UX Pro Max: отключаем на touch-устройствах, budget < 16ms.
// ==========================================================================
function initSpotlight() {
  if (isTouchDevice) return;

  const containers = document.querySelectorAll('.spotlight-container');
  containers.forEach((container) => {
    container.addEventListener('mousemove', (e) => {
      const cards = container.querySelectorAll('.spotlight-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  });
}

// ==========================================================================
// Magnetic Buttons (Магнитный эффект кнопок)
// Кнопка слегка тянется к курсору с коэффициентом ~0.3.
// UI/UX Pro Max: spring-like возврат, touch-action: manipulation, отключаем на мобильных.
// ==========================================================================
function initMagneticButtons() {
  if (isTouchDevice) return;

  const buttons = document.querySelectorAll('.magnetic-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * 0.3;
      const deltaY = (e.clientY - centerY) * 0.3;
      btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      // Пружинистый возврат через CSS transition (задана в .magnetic-btn)
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

// ==========================================================================
// 3D Tilt (Наклон карточек)
// Лёгкий 3D-эффект при наведении мыши.
// UI/UX Pro Max: используем только CSS transform, не анимируем width/height.
// ==========================================================================
function initTiltCards() {
  if (isTouchDevice || prefersReducedMotion) return;

  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (y - 0.5) * -8; // Макс 4 градуса
      const rotateY = (x - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });
}

// ==========================================================================
// Parallax Background (Параллакс фоновых Glow Orbs)
// UI/UX Pro Max: используем transform, бюджет < 16ms, отключаем при reduced-motion.
// ==========================================================================
function initParallax() {
  if (isTouchDevice || prefersReducedMotion) return;

  const orbs = document.querySelectorAll('.glow-orb');
  if (!orbs.length) return;

  let ticking = false;
  document.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      orbs.forEach((orb, index) => {
        const speed = (index + 1) * 15;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
      ticking = false;
    });
  });
}

// ==========================================================================
// Mobile Menu (Мобильное меню)
// UI/UX Pro Max: scrim overlay, закрытие по Escape и клику на overlay, focus trap.
// ==========================================================================
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-menu-overlay');
  if (!toggle || !menu || !overlay) return;

  function openMenu() {
    menu.classList.add('open');
    overlay.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Фокус на первую ссылку
    const firstLink = menu.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    menu.classList.remove('open');
    overlay.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Закрытие по клику на overlay
  overlay.addEventListener('click', closeMenu);

  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Закрытие при клике на ссылку внутри меню
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

// ==========================================================================
// Sticky Header (Изменение фона при скролле)
// ==========================================================================
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle('scrolled', !entry.isIntersecting);
    },
    { threshold: 0 }
  );

  // Наблюдаем за самым верхом страницы
  const sentinel = document.getElementById('scroll-sentinel');
  if (sentinel) observer.observe(sentinel);
}

// ==========================================================================
// Lead Form (Обратная связь)
// UI/UX Pro Max: inline-validation on blur, aria-live для ошибок,
// disabled state при отправке, success toast 3-5s.
// ==========================================================================
function initLeadForm() {
  const form = document.getElementById('lead-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnSpinner = submitBtn?.querySelector('.btn-spinner');

  // Валидация на blur
  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
  });

  function validateField(field) {
    const group = field.closest('.form-group');
    if (!group) return true;

    const errorEl = group.querySelector('.error-msg');
    let valid = true;

    if (field.required && !field.value.trim()) {
      group.classList.add('has-error');
      if (errorEl) {
        errorEl.textContent = 'This field is required.';
        errorEl.style.display = 'block';
      }
      valid = false;
    } else if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      group.classList.add('has-error');
      if (errorEl) {
        errorEl.textContent = 'Please enter a valid email address.';
        errorEl.style.display = 'block';
      }
      valid = false;
    } else {
      group.classList.remove('has-error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
    }

    return valid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Валидируем все поля
    const fields = form.querySelectorAll('input, textarea');
    let allValid = true;
    fields.forEach((field) => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      // Фокус на первое поле с ошибкой
      const firstError = form.querySelector('.has-error input, .has-error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // Блокируем кнопку (disabled + spinner)
    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Sending...';
    if (btnSpinner) btnSpinner.style.display = 'inline-block';

    // Имитация отправки (в будущем — webhook/CRM)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Успех — показать toast
    showToast('Thank you! We will contact you shortly.');
    form.reset();

    // Сброс кнопки
    submitBtn.disabled = false;
    if (btnText) btnText.textContent = 'Book a Discovery Call';
    if (btnSpinner) btnSpinner.style.display = 'none';
  });
}

// ==========================================================================
// Toast (Уведомление)
// UI/UX Pro Max: auto-dismiss 4s, aria-live="polite".
// ==========================================================================
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  const textEl = toast.querySelector('.toast-text');
  if (textEl) textEl.textContent = message;

  toast.classList.add('visible');

  setTimeout(() => {
    toast.classList.remove('visible');
  }, 4000);
}

// ==========================================================================
// ROI Calculator
// ==========================================================================
function initROICalculator() {
  const slider = document.getElementById('roi-slider');
  const countEl = document.getElementById('roi-agent-count');
  const costUSEl = document.getElementById('roi-cost-us');
  const costBPOEl = document.getElementById('roi-cost-bpo');
  const savingsEl = document.getElementById('roi-savings');

  if (!slider || !countEl || !costUSEl || !costBPOEl || !savingsEl) return;

  const costPerAgentUS = 4500;
  const costPerAgentBPO = 1200;

  function updateCards() {
    const agents = parseInt(slider.value, 10);
    const usTotal = agents * costPerAgentUS;
    const bpoTotal = agents * costPerAgentBPO;
    const savings = usTotal - bpoTotal;

    countEl.textContent = agents;
    costUSEl.textContent = `$${usTotal.toLocaleString()}`;
    costBPOEl.textContent = `$${bpoTotal.toLocaleString()}`;
    savingsEl.textContent = `$${savings.toLocaleString()}`;
  }

  slider.addEventListener('input', updateCards);
  updateCards(); // init
}

// ==========================================================================
// CountUp for Metrics
// ==========================================================================
function initCountUp() {
  const elements = document.querySelectorAll('.countup');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = +entry.target.dataset.target;
          animateValue(entry.target, 0, target, 2000);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  elements.forEach((el) => observer.observe(el));

  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      obj.innerHTML = Math.floor(easeOutQuart * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.innerHTML = end; // Ensure exact final value
      }
    };
    window.requestAnimationFrame(step);
  }
}

// ==========================================================================
// Sticky Workflow (Как это работает)
// ==========================================================================
function initWorkflowSteps() {
  const steps = document.querySelectorAll('.workflow-step');
  const visuals = document.querySelectorAll('.visual-slide');
  if (!steps.length || !visuals.length) return;

  // Initialize first step as active since it lacks opacity-100 classes by default
  steps[0].classList.remove('opacity-40');
  steps[0].classList.add('opacity-100');
  const firstVisual = document.getElementById('visual-step-1');
  if (firstVisual && !firstVisual.classList.contains('opacity-0')) {
     firstVisual.classList.add('opacity-100');
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const targetStep = entry.target.dataset.step;
          
          steps.forEach(s => {
            s.classList.remove('opacity-100');
            s.classList.add('opacity-40');
          });
          entry.target.classList.remove('opacity-40');
          entry.target.classList.add('opacity-100');
          
          visuals.forEach(v => {
            v.classList.remove('opacity-100');
            v.classList.add('opacity-0');
          });
          const currentVisual = document.getElementById(`visual-step-${targetStep}`);
          if (currentVisual) {
            currentVisual.classList.remove('opacity-0');
            currentVisual.classList.add('opacity-100');
          }
        }
      });
    },
    { threshold: 0.5, rootMargin: '-20% 0px -30% 0px' }
  );

  steps.forEach((el) => observer.observe(el));
}

// ==========================================================================
// Smooth scroll для навигационных ссылок
// ==========================================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ==========================================================================
// Инициализация при DOMContentLoaded
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initSpotlight();
  initMagneticButtons();
  initTiltCards();
  initParallax();
  initMobileMenu();
  initStickyHeader();
  initLeadForm();
  initSmoothScroll();
  initROICalculator();
  initCountUp();
  initWorkflowSteps();
});

